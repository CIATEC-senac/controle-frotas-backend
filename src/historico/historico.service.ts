import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historico } from './entities/historico.entity';
import { HistoricoDto } from './dto/historico.dto';

@Injectable()
export class HistoricoService {
  constructor(
    @InjectRepository(Historico)
    private readonly historicoRepository: Repository<Historico>,
  ) {}

  async findAll(): Promise<Historico[]> {
    return this.historicoRepository.find();
  }

  async findOne(id: number): Promise<Historico> {
    const historico = await this.historicoRepository.findOne({
      where: { id },
    });

    if (!historico) {
      throw new Error(`Histórico com id ${id} não encontrado.`);
    }

    return historico;
  }

  async create(createHistoricoDto: HistoricoDto): Promise<Historico> {
    const historico = createHistoricoDto.toEntity();
    return this.historicoRepository.save(historico);
  }

  async update(
    id: number,
    createHistoricoDto: HistoricoDto,
  ): Promise<Historico> {
    const historico = await this.historicoRepository.findOne({ where: { id } });

    if (!historico) {
      throw new Error('Historico não encontrado');
    }

    historico.status = createHistoricoDto.status;

    return this.historicoRepository.save(historico);
  }
}
