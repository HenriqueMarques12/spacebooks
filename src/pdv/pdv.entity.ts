import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { UserAuth } from '../auth/user-auth.entity'
import { Product } from 'src/produtos/product.entity'
import { TipoPdv } from './tipo-pdv.enum'
import { Venda } from 'src/vendas/venda.entity'

@Entity()
export class Pdv {
  [x: string]: any
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  cidade: string

  @Column()
  estado: string

  @Column()
  nome: string

  @Column({
    type: 'enum',
    enum: TipoPdv,
  })
  tipoPdv: TipoPdv

  @ManyToMany(() => UserAuth, user => user.pdvs)
  @JoinTable()
  users: UserAuth[]
  @ManyToOne(() => UserAuth, user => user.pdvs)
  @JoinColumn({ name: 'userAuthId' })
  user: UserAuth
  @OneToMany(() => Product, product => product.pdv)
  products: Product[]
  @OneToMany(() => Venda, vendas => vendas.pdv)
  sales: Venda[]

  @Column({ nullable: true })
  userAuthId: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
