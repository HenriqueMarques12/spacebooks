import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { UserAuth } from '../auth/user-auth.entity';
import { Pdv } from '../pdv/pdv.entity';
import { Product } from '../produtos/product.entity';

@Entity()
export class Venda {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserAuth, userAuth => userAuth.vendas)
  @JoinColumn({ name: 'userAuthId' })
  userAuth: UserAuth;

  @ManyToOne(() => Pdv, pdv => pdv.vendas)
  @JoinColumn({ name: 'pdvId' })
  pdv: Pdv;

  @ManyToOne(() => Product, product => product.vendas)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  quantidade: number;

  @Column({ default: 'Cartão de Débito' })
  metodoPagamento: string;

  @Column({ nullable: true })
  parcelas: number | null;
}

