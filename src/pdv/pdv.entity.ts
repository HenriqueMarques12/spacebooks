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

@Entity()
export class Pdv {
  [x: string]: any;
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  cidade: string;

  @Column()
  estado: string;

  @Column()
  nome: string;

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
