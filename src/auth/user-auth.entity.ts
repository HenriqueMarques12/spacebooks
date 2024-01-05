import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Pdv } from '../pdv/pdv.entity';

@Entity()
export class UserAuth {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  nome: string;

  @Column()
  cpf: string;

  @Column()
  dataNascimento: string;

  @Column()
  email: string;

  @Column()
  telefone: string;

  @Column()
  estado: string;

  @Column()
  regra: string;

  @Column({ nullable: true })
  plano: string;

  @Column({ nullable: true })
  planoStart: Date;

  @Column({ nullable: true })
  planoFinish: Date;

  @OneToMany(() => Pdv, pdv => pdv.userAuth)
  pdvs: Pdv[];
  

  @Column({ nullable: true })
  parceiro: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
