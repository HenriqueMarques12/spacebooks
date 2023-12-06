import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ebook } from './ebook.entity';
import * as phpSerialize from 'php-serialize';

@Injectable()
export class EbookService {
  constructor(
    @InjectRepository(Ebook)
    private readonly ebookRepository: Repository<Ebook>,
  ) { }

  async listarEbooks(page: number,  itemsPerPage: number) {
    const offset = (page - 1) * itemsPerPage;

    const query = `
      SELECT P.ID, MAX(P.post_title) AS nome, MAX(P.post_content) AS post_content, MAX(P.post_status) AS post_status, P2.guid AS capa, C.name AS categoria,
      (SELECT COUNT(*) FROM RfdNV3uAM_postmeta WHERE post_id = P.ID AND meta_key = '_downloadable_files') AS postmeta_count,
      (SELECT meta_value FROM RfdNV3uAM_postmeta WHERE post_id = P.ID AND meta_key = '_downloadable_files') AS downloadable_files,
      (SELECT meta_value FROM RfdNV3uAM_postmeta WHERE post_id = P.ID AND meta_key = '_downloadable') AS downloadable
      FROM RfdNV3uAM_posts AS P
      LEFT JOIN RfdNV3uAM_posts AS P2 ON P2.post_parent = P.ID
      INNER JOIN RfdNV3uAM_term_relationships AS R ON P.id = R.object_id
      INNER JOIN RfdNV3uAM_terms AS C ON R.term_taxonomy_id = C.term_id
      WHERE C.name = 'CURSOS' AND P2.post_mime_type LIKE 'image/%' 
      GROUP BY P.ID
      HAVING postmeta_count > 0
      ORDER BY P.ID DESC
      LIMIT ?, ?`;

    const result = await this.ebookRepository.query(query, [offset, itemsPerPage]);

    const mappedResult = await Promise.all(result.map(async ebook => {
      const categoriasProdArray = await this.obterCategoriasDoEbook(ebook.ID);
      const downloadableFiles = phpSerialize.unserialize(ebook.downloadable_files) || [];
    
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
        id: ebook.ID,
        nome: ebook.nome,
        capa: ebook.capa,
        status: ebook.post_status,
        post_content: ebook.post_content,
        downloadable: ebook.downloadable,
        downloads: downloads,
        categoria: ebook.categoria,
        categorias: categoriasProdArray,
      };
    }));

    return mappedResult;
  }

  private async obterCategoriasDoEbook(ebookId: number) {
    const query_sql_categorias_prod = `
      SELECT C.term_id AS id, C.name AS categoria
      FROM RfdNV3uAM_term_relationships AS R
      INNER JOIN RfdNV3uAM_terms AS C ON R.term_taxonomy_id = C.term_id
      WHERE R.object_id = ?`;

    const categoriasProd = await this.ebookRepository.query(query_sql_categorias_prod, [ebookId]);

    const categoriasProdArray = categoriasProd
      .filter(categoriaProd => categoriaProd.categoria !== 'simple')
      .map(categoriaProd => ({
        id: parseInt(categoriaProd.id, 10),
        categoria: categoriaProd.categoria,
      }));

    return categoriasProdArray;
  }
}





