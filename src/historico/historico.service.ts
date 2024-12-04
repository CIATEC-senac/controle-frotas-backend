import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historico } from 'src/historico/entities/historico.entity';
import { Rota } from 'src/rota/entities/rota.entity';
import { HistoricoDTO } from './dto/historico.dto';
import { StatusHistorico } from 'src/historico/entities/historico.entity';
import { User } from 'src/user/entities/user.entity'; 

@Injectable()
export class HistoricoService {
  constructor(
    @InjectRepository(Historico)
    private readonly historicoRepository: Repository<Historico>,
    @InjectRepository(Rota)
    private readonly rotaRepository: Repository<Rota>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 
  ) {}

  async create(historicoDTO: HistoricoDTO): Promise<Historico[]> {
    if (historicoDTO.status === StatusHistorico.REPROVADO && !historicoDTO.descricao) {
      throw new Error('Descrição é obrigatória quando o status é "reprovado".');
    }
    if (historicoDTO.paradaNaoProgramada && !historicoDTO.descricaoParadaNaoProgramada) {
      throw new Error('A descrição da parada não programada é obrigatória.');
    }

    const rota = await this.rotaRepository.findOne({
      where: { origem: historicoDTO.origem, destino: historicoDTO.destino },
      relations: ['veiculo'],
    });
    if (!rota) {
      throw new Error('Rota não encontrada');
    }

    const motorista = await this.userRepository.findOne({ 
      where: { id: historicoDTO.motoristaId },
    });
    if (!motorista) {
      throw new Error('Motorista não encontrado');
    }

    const historico = historicoDTO.toEntity();
    historico.rota = rota;
    historico.motorista = motorista; // Vincula o motorista ao histórico
    historico.origem = rota.origem; // A origem vem da rota
    historico.destino = rota.destino; // O destino vem da rota
    historico.capacidade = rota.veiculo?.capacidade;
    historico.placa = rota.veiculo?.placa;
    historico.empresa = rota.veiculo?.empresa;
    historico.tempoTotal = rota.tempoTotal;
    historico.kmTotal = rota.kmTotal;
    historico.motorista = motorista;
    historico.motoristaNome = motorista.nome;

    const savedHistorico = await this.historicoRepository.save(historico);

    return [savedHistorico];
  }

  async findAll(page: number, perPage: number): Promise<Historico[]> {
    return await this.historicoRepository.find({
      take: perPage,
      skip: perPage * (page - 1),
    });
  }

  async findOneById(id: number): Promise<Historico | null> {
    return await this.historicoRepository.findOne({ where: { id } });
  }
}
