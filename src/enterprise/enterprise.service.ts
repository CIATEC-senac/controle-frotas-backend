import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Enterprise } from './entities/enterprise.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EnterpriseService {
  constructor(
    @InjectRepository(Enterprise)
    private repository: Repository<Enterprise>,
  ) {}

  async findAll(): Promise<Enterprise[]> {
    return this.repository.find();
  }

  async findOneBy(id: number): Promise<Enterprise | undefined> {
    return this.repository.findOne({ where: { id } });
  }

  async create(enterprise: Enterprise): Promise<Enterprise> {
    return this.repository
      .insert(enterprise)
      .then((result) =>
        this.repository.findOneBy({ id: result.identifiers.at(0).id }),
      );
  }

  async update(enterprise: Enterprise): Promise<Enterprise> {
    return this.repository
      .update({ id: enterprise.id }, enterprise)
      .then(() => enterprise);
  }
}
