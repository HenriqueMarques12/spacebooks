import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  uid: string;
}
