import { Controller, Post, Request, UseGuards, Get, Param, Put, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }

  @Post('register')
  async register(@Request() req) {
    const { username, password, role, uid } = req.body;
    return this.authService.createUser(username, password, role, uid);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.authService.getUserById(+id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Request() req) {
    const { username, password, role, uid } = req.body;
    return this.authService.updateUser(+id, username, password, role, uid);
  }

  @Delete(':id') 
  async deleteUser(@Param('id') id: string) {
    await this.authService.deleteUser(+id);
    return { message: 'User deleted successfully' };
  }
}
