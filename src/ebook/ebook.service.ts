import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ebook } from './ebook.entity';
import * as phpSerialize from 'php-serialize';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';

@Injectable()
export class EbookService {
  constructor(
    @InjectRepository(Ebook)
    private readonly ebookRepository: Repository<Ebook>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore,
  ) {}

  async listarEbooks(page: number, itemsPerPage: number, search?: string) {
    const offset = (page - 1) * itemsPerPage;
    const searchPattern = search ? `%${search}%` : '%';

    const cacheKey = `ebooks_${page}_${itemsPerPage}_${search}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const query = `
      SELECT P.ID, MAX(P.post_title) AS nome, MAX(P.post_content) AS post_content, MAX(P.post_status) AS post_status,
      (SELECT P2.guid FROM RfdNV3uAM_posts AS P2 WHERE P2.post_type = 'attachment' AND P2.ID = (SELECT meta_value FROM RfdNV3uAM_postmeta WHERE post_id = P.ID AND meta_key = '_thumbnail_id')) AS capa,
      C.term_id AS category_id, C.name AS categoria,
      (SELECT meta_value FROM RfdNV3uAM_postmeta WHERE post_id = P.ID AND meta_key = '_downloadable_files') AS downloadable_files,
      (SELECT meta_value FROM RfdNV3uAM_postmeta WHERE post_id = P.ID AND meta_key = '_downloadable') AS downloadable
      FROM RfdNV3uAM_posts AS P
      INNER JOIN RfdNV3uAM_term_relationships AS R ON P.id = R.object_id
      INNER JOIN RfdNV3uAM_terms AS C ON R.term_taxonomy_id = C.term_id
      WHERE P.post_type = 'product'
      AND (P.post_title LIKE ? OR P.post_content LIKE ?)
      GROUP BY P.ID
      ORDER BY P.ID DESC
      LIMIT ?, ?`;

    const result = await this.ebookRepository.query(query, [
      searchPattern,
      searchPattern,
      offset,
      itemsPerPage,
    ]);

    const mappedResult = await Promise.all(
      result.map(
        async (ebook: {
          ID: any;
          downloadable_files: string | Buffer;
          nome: any;
          capa: any;
          post_status: any;
          post_content: any;
          downloadable: any;
          categoria: any;
        }) => {
          const ebookId = parseInt(ebook.ID, 10);
          const categoriasProdArray =
            await this.obterCategoriasDoEbook(ebookId);
          const downloadableFiles =
            phpSerialize.unserialize(ebook.downloadable_files) || [];

          const downloads = [];
          for (const fileId in downloadableFiles) {
            if (downloadableFiles.hasOwnProperty(fileId)) {
              const file = downloadableFiles[fileId];
              downloads.push({
                id: file.id,
                name: file.name,
                url: file.file,
              });
            }
          }
          return {
            id: ebookId,
            nome: ebook.nome,
            capa: ebook.capa,
            status: ebook.post_status,
            post_content: ebook.post_content,
            downloadable: ebook.downloadable,
            downloads: downloads,
            categoria: ebook.categoria,
            categorias: categoriasProdArray,
          };
        },
      ),
    );

    await this.cacheManager.set(cacheKey, mappedResult, { ttl: 7200 });
    return mappedResult;
  }

  async obterEbookPorId(id: any) {
    const ebookId = parseInt(id, 10);

    const cacheKey = `ebook_${ebookId}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const query = `
      SELECT P.ID, MAX(P.post_title) AS nome, MAX(P.post_content) AS post_content, MAX(P.post_status) AS post_status,
      (SELECT P2.guid FROM RfdNV3uAM_posts AS P2 WHERE P2.post_type = 'attachment' AND P2.ID = (SELECT meta_value FROM RfdNV3uAM_postmeta WHERE post_id = P.ID AND meta_key = '_thumbnail_id')) AS capa,
      C.term_id AS category_id, C.name AS categoria,
      (SELECT meta_value FROM RfdNV3uAM_postmeta WHERE post_id = P.ID AND meta_key = '_downloadable_files') AS downloadable_files,
      (SELECT meta_value FROM RfdNV3uAM_postmeta WHERE post_id = P.ID AND meta_key = '_downloadable') AS downloadable
      FROM RfdNV3uAM_posts AS P
      INNER JOIN RfdNV3uAM_term_relationships AS R ON P.id = R.object_id
      INNER JOIN RfdNV3uAM_terms AS C ON R.term_taxonomy_id = C.term_id
      WHERE P.post_type = 'product' AND P.ID = ?
      GROUP BY P.ID`;

    const result = await this.ebookRepository.query(query, [ebookId]);

    if (!result || result.length === 0) {
      throw new NotFoundException(`Ebook com ID ${ebookId} não encontrado.`);
    }

    const ebook = result[0];
    const categoriasProdArray = await this.obterCategoriasDoEbook(ebookId);
    const downloadableFiles =
      phpSerialize.unserialize(ebook.downloadable_files) || [];

    const downloads = [];
    for (const fileId in downloadableFiles) {
      if (downloadableFiles.hasOwnProperty(fileId)) {
        const file = downloadableFiles[fileId];
        downloads.push({
          id: file.id,
          name: file.name,
          url: file.file,
        });
      }
    }

    const ebookData = {
      id: ebookId,
      nome: ebook.nome,
      capa: ebook.capa,
      status: ebook.post_status,
      post_content: ebook.post_content,
      downloadable: ebook.downloadable,
      downloads: downloads,
      categoria: ebook.categoria,
      categorias: categoriasProdArray,
    };

    await this.cacheManager.set(cacheKey, ebookData, { ttl: 7200 });
    return ebookData;
  }

  private async obterCategoriasDoEbook(ebookId: number) {
    const query_sql_categorias_prod = `
      SELECT C.term_id AS id, C.name AS categoria
      FROM RfdNV3uAM_term_relationships AS R
      INNER JOIN RfdNV3uAM_terms AS C ON R.term_taxonomy_id = C.term_id
      WHERE R.object_id = ?`;

    const categoriasProd = await this.ebookRepository.query(
      query_sql_categorias_prod,
      [ebookId],
    );

    const categoriasProdArray = categoriasProd
      .filter(
        (categoriaProd: { categoria: string }) =>
          categoriaProd.categoria !== 'simple',
      )
      .map((categoriaProd: { id: string; categoria: any }) => ({
        id: parseInt(categoriaProd.id, 10),
        categoria: categoriaProd.categoria,
      }));

    return categoriasProdArray;
  }
}
