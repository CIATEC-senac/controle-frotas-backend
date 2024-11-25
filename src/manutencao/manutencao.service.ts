import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manutencao } from './entities/manutencao.entity';
import { Repository, InsertResult } from 'typeorm';

@Injectable()
export class ManutencaoService {
    constructor (
        @InjectRepository (Manutencao)
        private repository: Repository<Manutencao>,
    ) {}

    async delete(id: number): Promise<void> {
        await this.repository.delete({ id });
      }
    
      findAll(page: number, perPage: number): Promise<Manutencao[]> {
        return this.repository.find({
          take: perPage,
          skip: perPage * (page - 1),
        });
      }
    
      findOne(id: number): Promise<Manutencao | null> {
        return this.repository.findOneBy({ id });
      }
    
      async findOneBy(id: number): Promise<Manutencao | undefined> {
        return this.repository.findOne({
          where: { id },
        });
      }
    
      create(Manutencao: Manutencao): Promise<InsertResult> {
        return this.repository.insert(Manutencao);
      }
    
      update(Manutencao: Manutencao) {
        return this.repository.update(
          {
            id: Manutencao.id,
          },
          Manutencao,
        );
      }




}

