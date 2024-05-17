import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuth } from './user-auth.entity';
import { Pdv } from 'src/pdv/pdv.entity';

@Injectable()
export class AuthService {
  [x: string]: any;
  constructor(
    @InjectRepository(UserAuth)
    private readonly userRepository: Repository<UserAuth>,
    @InjectRepository(Pdv)
    private readonly pdvRepository: Repository<Pdv>,
  ) {}

  calculatePlanDates(plan: string): { planStart: Date; planFinish: Date } {
    const planStart = new Date();
    let planFinish = new Date(planStart.getTime());

    const months = parseInt(plan.split(' ')[0]);
    if (!isNaN(months)) {
      planFinish.setMonth(planFinish.getMonth() + months);
    } else {
      throw new Error('Invalid plan format');
    }

    return { planStart, planFinish };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserAuth | null> {
    try {
      if (!email || !password) {
        console.log('Invalid email or password');
        return null;
      }
      const user = await this.userRepository.findOne({ where: { email } });

      if (user && user.password === password) {
        return user;
      }

      return null;
    } catch (error) {
      console.error('Erro ao validar usuário:', error);
      return null;
    }
  }

  async updateUserStatus(user: UserAuth): Promise<void> {
    const currentDate = new Date();
    if (
      user.planoFinish &&
      currentDate <= user.planoFinish &&
      currentDate >= user.planoStart
    ) {
      user.status = 'ativo';
    } else {
      user.status = 'inativo';
    }
    await this.userRepository.save(user);
  }

  async createUser(data: {
    username: string;
    password: string;
    role: string;
    nome?: string;
    cpf?: string;
    dataNascimento?: string;
    email: string;
    telefone?: string;
    estado?: string;
    cidade?: string;
    regra?: string;
    plano?: string;
    planoStart?: Date;
    planoFinish?: Date;
    status?: string;
    pdv?: string;
    parceiro?: string;
  }): Promise<UserAuth> {
    const { email, plano, ...rest } = data;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User already registered with this email.');
    }

    let planDates = { planStart: undefined, planFinish: undefined };
    if (plano) {
      planDates = this.calculatePlanDates(plano);
    }

    const newUser = this.userRepository.create({
      ...rest,
      email,
      plano,
      ...planDates,
    });

    return await this.userRepository.save(newUser);
  }

  async createUserMigration(data: {
    username: string;
    password: string;
    role: string;
    nome?: string;
    cpf?: string;
    dataNascimento?: string;
    email: string;
    telefone?: string;
    estado?: string;
    cidade?: string;
    regra?: string;
    plano?: string;
    planoStart?: Date;
    planoFinish?: Date;
    status?: string;
    pdv?: string;
    parceiro?: string;
  }): Promise<UserAuth> {
    const { email, plano, ...rest } = data;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User already registered with this email.');
    }

    const newUser = this.userRepository.create({
      ...rest,
      email,
      plano,
    });

    return await this.userRepository.save(newUser);
  }

  async getUserById(id: number): Promise<UserAuth | null> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.pdvs', 'pdv')
        .where('user.id = :id', { id })
        .getOne();

      return user || null;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }

  async getUsersByRole(role: string): Promise<UserAuth[]> {
    return this.userRepository.find({ where: { role } });
  }

  async updateUser(
    id: number,
    data: {
      username?: string;
      password?: string;
      role?: string;
      nome?: string;
      cpf?: string;
      dataNascimento?: string;
      email?: string;
      telefone?: string;
      estado?: string;
      cidade?: string;
      regra?: string;
      plano?: string;
      planoStart?: Date;
      planoFinish?: Date;
      status?: string;
      pdv?: string;
      parceiro?: string;
    },
  ): Promise<UserAuth> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['pdvs'],
    });

    if (!user) {
      console.error('User not found.');
      return null;
    }

    if (data.plano) {
      const planDates = this.calculatePlanDates(data.plano);
      data.planoStart = planDates.planStart;
      data.planoFinish = planDates.planFinish;
    } else {
      data.planoStart = null;
      data.planoFinish = null;
    }

    Object.assign(user, data);

    return await this.userRepository.save(user);
  }

  async addPdvToUser(userId: number, pdvId: number): Promise<UserAuth> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['pdvs'],
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const pdv = await this.pdvRepository.findOne({ where: { id: pdvId } });
    if (!pdv) {
      throw new NotFoundException('PDV not found.');
    }

    if (!user.pdvs.find((existingPdv) => existingPdv.id === pdvId)) {
      user.pdvs.push(pdv);
    }

    await this.userRepository.save(user);

    return user;
  }

  async removePdvFromUser(userId: number, pdvId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['pdvs'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const pdv = await this.pdvRepository.findOne({ where: { id: pdvId } });

    if (!pdv) {
      throw new NotFoundException(`PDV with ID ${pdvId} not found.`);
    }

    const pdvIndex = user.pdvs.findIndex((userPdv) => userPdv.id === pdv.id);
    if (pdvIndex === -1) {
      throw new NotFoundException(
        `PDV with ID ${pdvId} is not associated with user with ID ${userId}.`,
      );
    }

    user.pdvs.splice(pdvIndex, 1);

    await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async cancelUserPlan(userId: number): Promise<UserAuth> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    user.plano = null;
    user.planoStart = null;
    user.planoFinish = null;
    user.status = 'Cancelado';

    return await this.userRepository.save(user);
  }
}
