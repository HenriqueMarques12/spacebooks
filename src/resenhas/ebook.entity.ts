import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ebook {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;
    
    @Column()
    capa: string;
}
