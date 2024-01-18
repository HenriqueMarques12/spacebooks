import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pdv } from '../pdv/pdv.entity';

@Entity()
export class Product {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome_produto: string;

  @Column()
  quantidade: number;
  @ManyToOne(() => Pdv, pdv => pdv.products)
  @JoinColumn({ name: 'pdvId' })
  pdv: Pdv;
}