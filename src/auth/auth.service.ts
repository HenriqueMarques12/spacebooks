import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserAuth } from './user-auth.entity'

@Injectable()
export class AuthService {
  constructor (
    @InjectRepository(UserAuth)
    private readonly userRepository: Repository<UserAuth>,
  ) {}

  async validateUser(email: string, password: string): Promise<UserAuth | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async createUser (data: {
    username: string
    password: string
    role: string
    nome?: string
    cpf?: string
    dataNascimento?: string
    email?: string
    telefone?: string
    estado?: string
    regra?: string
    plano?: string
    planoStart?: Date
    planoFinish?: Date
    pdv?: string
    parceiro?: string
  }): Promise<UserAuth> {
    const { password, ...rest } = data
    const newUser = this.userRepository.create({ password, ...rest })
    return await this.userRepository.save(newUser)
  }

  async getUserById (id: number): Promise<UserAuth | null> {
    return this.userRepository.findOne({ where: { id } })
  }

  async getUsersByRole (role: string): Promise<UserAuth[]> {
    return this.userRepository.find({ where: { role } })
  }

  async updateUser (
    id: number,
    data: {
      username?: string
      password?: string
      role?: string
      nome?: string
      cpf?: string
      dataNascimento?: string
      email?: string
      telefone?: string
      estado?: string
      regra?: string
      plano?: string
      planoStart?: Date
      planoFinish?: Date
      pdv?: string
      parceiro?: string
    },
  ): Promise<UserAuth | null> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (user) {
      const { password, ...rest } = data
      Object.assign(user, rest)
      return this.userRepository.save(user)
    }
    return null
  }

  async deleteUser (id: number): Promise<void> {
    await this.userRepository.delete(id)
  }
}
