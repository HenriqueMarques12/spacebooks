import {
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { UserAuth } from './user-auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    try {
      const { email, password } = req.user;

      const user = await this.authService.validateUser(email, password);

      if (user) {
        return { message: 'Login bem-sucedido', user };
      } else {
        return { message: 'Credenciais inválidas' };
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      return { message: 'Erro durante o login' };
    }
  }

  @Post('register')
  async register(@Request() req) {
    const {
      username,
      password,
      role,
      nome,
      cpf,
      dataNascimento,
      email,
      telefone,
      estado,
      cidade,
      regra,
      plano,
      planoStart,
      planoFinish,
      pdv,
      parceiro,
    } = req.body;
    return this.authService.createUser({
      username,
      password,
      role,
      nome,
      cpf,
      dataNascimento,
      email,
      telefone,
      estado,
      cidade,
      regra,
      plano,
      planoStart,
      planoFinish,
      pdv,
      parceiro,
    });
  }
  @Post('migration')
  async registerMigration(@Request() req) {
    const {
      username,
      password,
      role,
      nome,
      cpf,
      dataNascimento,
      email,
      telefone,
      estado,
      cidade,
      regra,
      plano,
      planoStart,
      planoFinish,
      pdv,
      parceiro,
    } = req.body;
    return this.authService.createUserMigration({
      username,
      password,
      role,
      nome,
      cpf,
      dataNascimento,
      email,
      telefone,
      estado,
      cidade,
      regra,
      plano,
      planoStart,
      planoFinish,
      pdv,
      parceiro,
    });
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    const user = await this.authService.getUserById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Get('users/role/:role')
  getUsersByRole(@Param('role') role: string): Promise<UserAuth[]> {
    return this.authService.getUsersByRole(role);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Request() req) {
    const userId = parseInt(id, 10);
    const {
      username,
      password,
      role,
      nome,
      cpf,
      dataNascimento,
      email,
      telefone,
      estado,
      cidade,
      regra,
      plano,
      planoStart,
      planoFinish,
      pdv,
      parceiro,
    } = req.body;

    const updatedUser = await this.authService.updateUser(userId, {
      username,
      password,
      role,
      nome,
      cpf,
      dataNascimento,
      email,
      telefone,
      estado,
      cidade,
      regra,
      plano,
      planoStart,
      planoFinish,
      pdv,
      parceiro,
    });

    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return updatedUser;
  }

  @Post('users/:userId/pdvs/:pdvId')
  async addPdvToUser(
    @Param('userId') userId: number,
    @Param('pdvId') pdvId: number,
  ) {
    return this.authService.addPdvToUser(userId, pdvId);
  }

  @Delete('users/:userId/pdvs/:pdvId')
  async removePdvFromUser(
    @Param('userId') userId: number,
    @Param('pdvId') pdvId: number,
  ) {
    return this.authService.removePdvFromUser(userId, pdvId);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    await this.authService.deleteUser(userId);
    return { message: 'User deleted successfully' };
  }
}
