import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usersAuth')
export class UserAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  rule: string;
}
