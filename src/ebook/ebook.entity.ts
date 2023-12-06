import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ebook {
    ID(ID: any) {
      throw new Error('Method not implemented.');
    }
    downloadable_files(downloadable_files: any) {
      throw new Error('Method not implemented.');
    }
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;
    
    @Column()
    capa: string;
  post_status: any;
  post_content: any;
  downloadable: any;
  categoria: any;
}
