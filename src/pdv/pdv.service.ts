import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pdv } from './pdv.entity';

@Injectable()
export class PdvService {
  constructor(
    @InjectRepository(Pdv)
    private pdvRepository: Repository<Pdv>,
  ) {}

  async findAll(): Promise<Pdv[]> {
    return this.pdvRepository.find();
  }

  async findOne(id: number): Promise<Pdv> {
    return this.pdvRepository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  async create(createPdvDto: Partial<Pdv>): Promise<Pdv> {
    const pdv = this.pdvRepository.create(createPdvDto);
    return this.pdvRepository.save(pdv);
  }

  async update(id: number, updatePdvDto: Partial<Pdv>): Promise<Pdv> {
    await this.pdvRepository.update(id, updatePdvDto);
    return this.pdvRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.pdvRepository.delete(id);
  }
}
