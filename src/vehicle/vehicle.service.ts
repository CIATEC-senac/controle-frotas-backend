import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private repository: Repository<Vehicle>,
  ) {}

  // Deleta um veículo pelo seu ID
  async delete(id: number): Promise<void> {
    // Chama o repositório para deletar o veículo, baseado no ID fornecido
    await this.repository.delete({ id });
  }

  // Retorna todos os veículos, com as manutenções relacionadas e a empresa associada
  findAll(): Promise<Vehicle[]> {
    return this.repository.find({
      select: {
        maintenances: { id: true, date: true },
      },
      relations: {
        // Carrega as relações de manutenções e a empresa associada ao veículo
        maintenances: true,
        enterprise: true,
      },
      order: {
        year: 'ASC',
        model: 'ASC',
      },
    });
  }

  // Retorna um único veículo, baseado no ID fornecido
  async findOneBy(id: number): Promise<Vehicle | undefined> {
    return this.repository.findOne({
      where: { id }, // Busca o veículo com o ID específico
      relations: {
        // Carrega as relações de manutenções e a empresa associada ao veículo
        maintenances: true,
        enterprise: true,
      },
    });
  }

  // Cria um novo veículo no banco de dados
  create(vehicle: Vehicle): Promise<Vehicle> {
    return this.repository
      .insert(vehicle)
      .then((result) =>
        this.repository.findOneBy({ id: result.identifiers.at(0).id }),
      );
  }

  // Atualiza um veículo existente no banco de dados
  update(vehicle: Vehicle): Promise<Vehicle> {
    return this.repository
      .update({ id: vehicle.id }, vehicle) // Atualiza o veículo com o ID fornecido
      .then(() => vehicle); // Retorna o veículo atualizado após a operação
  }
}
