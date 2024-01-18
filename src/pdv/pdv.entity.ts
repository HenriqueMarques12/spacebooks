import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserAuth } from '../auth/user-auth.entity';
import { Product } from 'src/produtos/product.entity';
import { TipoPdv } from './tipo-pdv.enum';

@Entity()
export class Pdv {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cidade: string;

  @Column()
  estado: string;

  @Column()
  nome: string;

  @Column({
    type: 'enum',
    enum: TipoPdv,
  })
  tipoPdv: TipoPdv;

  @ManyToOne(() => UserAuth, (userAuth) => userAuth.pdvs, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'userAuthId' })
  userAuth: UserAuth;

  @OneToMany(() => Product, (product) => product.pdv)
  products: Product[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
