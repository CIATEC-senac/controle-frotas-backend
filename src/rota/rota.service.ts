import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rota } from 'src/rota/entities/rota.entity';
import { User } from 'src/user/entities/user.entity';
import { Veiculo } from 'src/veiculo/entities/veiculo.entity';
import { Repository } from 'typeorm';
import { RotaDTO } from './dtos/rota.dto';
import { GeoCodeService } from './geocode.service';

@Injectable()
export class RotaService {
  constructor(
    @InjectRepository(Rota)
    private readonly repository: Repository<Rota>,
    @InjectRepository(Veiculo)
    private readonly veiculoRepository: Repository<Veiculo>,
    @InjectRepository(User)
    private readonly usuarioRepository: Repository<User>,
    private readonly geoCodeService: GeoCodeService,
  ) {}

  private async validateRelations(rota: Rota) {
    // Buscar o Veículo com a placa fornecida
    const veiculo = await this.veiculoRepository.findOneBy({
      id: rota.veiculo.id,
    });

    if (!veiculo) {
      throw new Error('Veículo com a placa fornecida não encontrado');
    }

    // Buscar o usuário com o id fornecido
    const motorista = await this.usuarioRepository.findOneBy({
      id: rota.motorista.id,
    });

    if (!motorista) {
      throw new Error('Motorista com o id fornecido não encontrado');
    }
  }

  async create(rotaDTO: RotaDTO): Promise<Rota> {
    const rota = rotaDTO.toEntity();

    await this.validateRelations(rota);

    const googleRoute = await this.geoCodeService.getRoute(rota);

    if (!Array.isArray(googleRoute?.legs)) {
      throw new Error('Erro: dados da rota inválidos.');
    }

    for (const leg of googleRoute.legs) {
      rota.tempoTotal += leg.duration.value;
      rota.kmTotal += leg.distance.value;
    }

    return await this.repository.save(rota);
  }

  async update(rotaDTO: RotaDTO): Promise<any> {
    const rotaExistente = await this.repository.findOne({
      where: { id: rotaDTO.id },
    });

    if (!rotaExistente) {
      throw new Error('Rota não encontrada');
    }

    return this.create(rotaDTO);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  findAll(): Promise<Rota[]> {
    return this.repository.find({
      select: {
        motorista: { nome: true, id: true },
        veiculo: {
          obra: true,
          id: true,
          empresa: true,
          placa: true,
          capacidade: true,
        },
      },
      relations: { veiculo: true, motorista: true },
    });
  }

  findOneById(id: number): Promise<Rota | null> {
    return this.repository.findOne({
      where: { id },
      select: {
        motorista: { nome: true, id: true },
        veiculo: {
          id: true,
          obra: true,
          empresa: true,
          placa: true,
          capacidade: true,
        },
      },
      relations: { veiculo: true, motorista: true },
    });
  }
}
