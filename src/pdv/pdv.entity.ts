import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserAuth } from '../auth/user-auth.entity';

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

  @ManyToOne(() => UserAuth, userAuth => userAuth.pdvs, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'userAuthId' })
  userAuth: UserAuth;
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

