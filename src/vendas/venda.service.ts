import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venda } from './venda.entity';

@Injectable()
export class VendaService {
  constructor(
    @InjectRepository(Venda)
    private vendaRepository: Repository<Venda>,
  ) {}

  async create(vendaData: Partial<Venda>): Promise<Venda> {
    const venda = this.vendaRepository.create(vendaData);
    return await this.vendaRepository.save(venda);
  }

  async findAll(): Promise<Venda[]> {
    return await this.vendaRepository.find();
  }

  async findOne(id: string): Promise<Venda> {
    const venda = await this.vendaRepository.findOne({ where: { id } });
    if (!venda) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada.`);
    }
    return venda;
  }

  async update(id: string, updateData: Partial<Venda>): Promise<Venda> {
    const venda = await this.findOne(id);
    const updated = Object.assign(venda, updateData);
    return await this.vendaRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const venda = await this.findOne(id);
    await this.vendaRepository.remove(venda);
  }
}
