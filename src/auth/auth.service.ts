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

   calcularDatasPlano(plano: string): { planoStart: Date, planoFinish: Date } {
    const planoStart = new Date();
    let planoFinish = new Date(planoStart.getTime());
  
    const meses = parseInt(plano.split(' ')[0]);
    if (!isNaN(meses)) {
      planoFinish.setMonth(planoFinish.getMonth() + meses);
    } else {
      throw new Error('Formato de plano inválido');
    }
  
    return { planoStart, planoFinish };
  }
  async validateUser (
    email: string,
    password: string,
  ): Promise<UserAuth | null> {
    try {
      if (!email || !password) {
        console.log('Invalid email or password')
        return null
      }
      const user = await this.userRepository.findOne({ where: { email } })

      if (user && user.password === password) {
        return user
      }

      return null
    } catch (error) {
      console.error('Erro ao validar usuário:', error)
      return null
    }
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
    cidade?: string
    regra?: string
    plano?: string
    planoStart?: Date
    planoFinish?: Date
    pdv?: string
    parceiro?: string
  }): Promise<UserAuth> {
    const { password, plano, ...rest } = data
    if (plano) {
      const datasPlano = this.calcularDatasPlano(plano);
      data = { ...data, ...datasPlano };
    }
    const newUser = this.userRepository.create({ password, ...rest })
    return await this.userRepository.save(newUser)
  }

  async getUserById (id: number): Promise<UserAuth | null> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.pdvs', 'pdv')
        .where('user.id = :id', { id })
        .getOne()

      return user || null
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error)
      return null
    }
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
      cidade?: string
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
      const { plano, ...rest } = data;

      if (plano) {
        const datasPlano = this.calcularDatasPlano(plano);
        data = { ...data, ...datasPlano };
      }

      Object.assign(user, rest)
      return this.userRepository.save(user)
    }
    return null
  }

  async deleteUser (id: number): Promise<void> {
    await this.userRepository.delete(id)
  }
}
