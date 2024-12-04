import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rota } from 'src/rota/entities/rota.entity';
import { User } from 'src/user/entities/user.entity';
import { Veiculo } from 'src/veiculo/entities/veiculo.entity';
import { Repository } from 'typeorm';
import { RotaDTO } from './dtos/rota.dto';

@Injectable()
export class RotaService {
  constructor(
    @InjectRepository(Rota)
    private readonly repository: Repository<Rota>,
    @InjectRepository(Veiculo)
    private readonly veiculoRepository: Repository<Veiculo>,
    @InjectRepository(User)
    private readonly usuarioRepository: Repository<User>,
  ) {}

  async create(rotaDTO: RotaDTO): Promise<Rota> {
    const rota = rotaDTO.toEntity();

    // Buscar o Veículo com a placa fornecida
    const veiculo = await this.veiculoRepository.findOne({
      where: { id: rota.veiculo.id },
    });

    if (!veiculo) {
      throw new Error('Veículo com a placa fornecida não encontrado');
    }

    rota.veiculo = veiculo;

    // Buscar o usuário com o id fornecido
    const motorista = await this.usuarioRepository.findOne({
      where: { id: rota.motorista.id },
    });

    if (!motorista) {
      throw new Error('Motorista com o id fornecido não encontrado');
    }

    rota.motorista = motorista;

    return await this.repository.save(rota);
  }

  async update(rota: Rota): Promise<any> {
    const rotaExistente = await this.repository.findOne({
      where: { id: rota.id },
    });

    if (!rotaExistente) {
      throw new Error('Rota não encontrada');
    }

    return this.repository.update({ id: rota.id }, rota);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  findAll(): Promise<Rota[]> {
    return this.repository.find({
      select: {
        motorista: {
          nome: true,
        },
        veiculo: {
          obra: true,
          empresa: true,
          placa: true,
          capacidade: true,
        },
      },
      relations: {
        veiculo: true,
        motorista: true,
      },
    });
  }

  findOneById(id: number): Promise<Rota | null> {
    return this.repository.findOne({
      where: { id },
      select: {
        motorista: {
          nome: true,
        },
        veiculo: {
          obra: true,
          empresa: true,
          placa: true,
          capacidade: true,
        },
      },
      relations: {
        veiculo: true,
        motorista: true,
      },
    });
  }
}
