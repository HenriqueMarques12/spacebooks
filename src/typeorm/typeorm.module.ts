import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'spacebooks.com.br',
      port: 3306,
      username: 'space9956_wp_ezp23',
      password: 'qM%6a@u6oZVB~XD3',
      database: 'space9956_wp_p6pnm',
      charset: 'utf8mb4',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class TypeormModule implements OnModuleInit {
  constructor(private readonly connection: Connection) {}

  async onModuleInit() {
    if (this.connection.isConnected) {
      console.log('Já está conectado ao banco de dados.');
      return;
    }

    try {
      await this.connection.connect();
      console.log('Conectado ao banco de dados.');
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados', error);
    }
  }
}
