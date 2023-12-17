import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class UserAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

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

  @Column({ nullable: true })
  pdv: string;

  @Column({ nullable: true })
  parceiro: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
