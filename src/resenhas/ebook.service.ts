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

  async listarEbooks(page: number, itemsPerPage: number, search?: string, categoryNames?: string[]) {
    const offset = (page - 1) * itemsPerPage;
    const searchPattern = search ? `%${search}%` : '%';

    const cacheKey = `ebooks_resenhas_${page}_${itemsPerPage}_${search}_${categoryNames?.join('_')}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    let categoryFilter = '';
    let categoryIds = [];

    if (categoryNames && categoryNames.length > 0) {
      const categories = await this.getCategoryIdsByName(categoryNames);
      categoryIds = categories.map(c => c.id);

      if (categoryIds.length > 0) {
        const placeholders = categoryIds.map(() => '?').join(',');
        categoryFilter = `AND C.term_id IN (${placeholders})`;
      }
    }

    const query = `
      SELECT P.ID, MAX(P.post_title) AS nome, MAX(P.post_content) AS post_content, MAX(P.post_status) AS post_status, P2.guid AS capa, C.name AS categoria,
      (SELECT COUNT(*) FROM RfdNV3uAM_postmeta WHERE post_id = P.ID AND meta_key = '_downloadable_files') AS postmeta_count,
      (SELECT meta_value FROM RfdNV3uAM_postmeta WHERE post_id = P.ID AND meta_key = '_downloadable_files') AS downloadable_files,
      (SELECT meta_value FROM RfdNV3uAM_postmeta WHERE post_id = P.ID AND meta_key = '_downloadable') AS downloadable
      FROM RfdNV3uAM_posts AS P
      LEFT JOIN RfdNV3uAM_posts AS P2 ON P2.post_parent = P.ID
      INNER JOIN RfdNV3uAM_term_relationships AS R ON P.id = R.object_id
      INNER JOIN RfdNV3uAM_terms AS C ON R.term_taxonomy_id = C.term_id
      WHERE C.name = 'RESENHAS' AND P2.post_mime_type LIKE 'image/%' 
      AND (P.post_title LIKE ? OR P.post_content LIKE ?)
      ${categoryFilter}
      GROUP BY P.ID
      HAVING postmeta_count > 0
      ORDER BY P.ID DESC
      LIMIT ?, ?`;

    const queryParams = [searchPattern, searchPattern, ...categoryIds, offset, itemsPerPage];
    const result = await this.ebookRepository.query(query, queryParams);

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
          const categoriasProdArray = await this.obterCategoriasDoEbook(
            ebook.ID,
          );
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
            id: parseInt(ebook.ID, 10),
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

  async obterEbookPorId(id: number) {
    const cacheKey = `ebook_resenha_${id}`;

    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const query = `
      SELECT P.ID, MAX(P.post_title) AS nome, MAX(P.post_content) AS post_content, MAX(P.post_status) AS post_status, P2.guid AS capa, C.name AS categoria,
      (SELECT COUNT(*) FROM RfdNV3uAM_postmeta WHERE post_id = P.ID AND meta_key = '_downloadable_files') AS postmeta_count,
      (SELECT meta_value FROM RfdNV3uAM_postmeta WHERE post_id = P.ID AND meta_key = '_downloadable_files') AS downloadable_files,
      (SELECT meta_value FROM RfdNV3uAM_postmeta WHERE post_id = P.ID AND meta_key = '_downloadable') AS downloadable
      FROM RfdNV3uAM_posts AS P
      LEFT JOIN RfdNV3uAM_posts AS P2 ON P2.post_parent = P.ID
      INNER JOIN RfdNV3uAM_term_relationships AS R ON P.id = R.object_id
      INNER JOIN RfdNV3uAM_terms AS C ON R.term_taxonomy_id = C.term_id
      WHERE C.name = 'RESENHAS' AND P2.post_mime_type LIKE 'image/%' AND P.ID = ?
      GROUP BY P.ID
      HAVING postmeta_count > 0
      ORDER BY P.ID DESC
      LIMIT 1`;

    const result = await this.ebookRepository.query(query, [id]);

    if (!result || result.length === 0) {
      throw new NotFoundException(`Ebook com ID ${id} não encontrado.`);
    }

    const ebook = result[0];
    const categoriasProdArray = await this.obterCategoriasDoEbook(ebook.ID);
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
      id: parseInt(ebook.ID, 10),
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
      .filter((categoriaProd) => categoriaProd.categoria !== 'simple')
      .map((categoriaProd) => ({
        id: parseInt(categoriaProd.id, 10),
        categoria: categoriaProd.categoria,
      }));

    return categoriasProdArray;
  }

  private async getCategoryIdsByName(categoryNames: string[]) {
    const placeholders = categoryNames.map(() => '?').join(',');
    const query = `
      SELECT term_id AS id, name AS categoria
      FROM RfdNV3uAM_terms
      WHERE name IN (${placeholders})`;

    return this.ebookRepository.query(query, categoryNames);
  }
}
