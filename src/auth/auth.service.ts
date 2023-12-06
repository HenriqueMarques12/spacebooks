import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAuthRepository } from './user-auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userAuthRepository: UserAuthRepository,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userAuthRepository.findOne({ where: { username } });

    if (user && user.password === password) {
      return user;
    }

    return null;
  }

  async validateUserById(userId: number): Promise<any> {
    try {
      const user = await this.userAuthRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async generateToken(user: any): Promise<string> {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }
}

