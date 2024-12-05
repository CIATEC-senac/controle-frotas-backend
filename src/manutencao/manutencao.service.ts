import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Manutencao } from './entities/manutencao.entity';

@Injectable()
export class ManutencaoService {
  constructor(
    @InjectRepository(Manutencao)
    private repository: Repository<Manutencao>,
  ) {}

  async delete(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  findAll(from: Date): Promise<Manutencao[]> {
    const to = new Date(from);
    to.setDate(to.getDate() + 7);

    return this.repository.find({
      where: {
        data: Between(from, to),
      },
      relations: {
        veiculos: true,
      },
    });
  }

  findOne(id: number): Promise<Manutencao | null> {
    return this.repository.findOneBy({ id });
  }

  async findOneBy(id: number): Promise<Manutencao | undefined> {
    return this.repository.findOne({
      where: { id },
      relations: {
        veiculos: true,
      },
    });
  }

  create(manutencao: Manutencao): Promise<Manutencao> {
    return this.repository.save(manutencao);
  }

  update(manutencao: Manutencao) {
    return this.repository.save(manutencao);

    // return this.repository.update(
    //   {
    //     id: manutencao.id,
    //   },
    //   manutencao,
    // );
  }
}
