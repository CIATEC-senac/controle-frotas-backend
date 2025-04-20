import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from 'src/history/entities/history.entity';
import { HistoryService } from 'src/history/history.service';
import { Route } from 'src/route/entities/route.entity';
import { UserRole } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Repository } from 'typeorm';
import { RouteDTO } from './dtos/route.dto';
import { GeoCodeService } from './geocode.service';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly repository: Repository<Route>,
    private readonly vehicleService: VehicleService,
    private readonly userService: UserService,
    private readonly historyService: HistoryService,
    private readonly geoCodeService: GeoCodeService,
  ) {}

  // Valida se o veículo e motorista da rota existem e estão corretos
  private async validateRelations(route: Route) {
    // Buscar o Veículo com a placa fornecida
    const vehicle = await this.vehicleService.findOneBy(route.vehicle.id);

    if (!vehicle) {
      throw new Error(`Veículo ${route.vehicle.id} não encontrado`);
    }

    // Buscar o usuário com o id fornecido
    const driver = await this.userService.findOneById(route.driver.id);

    if (!driver) {
      throw new Error(`Motorista ${route.driver.id} não encontrado`);
    }

    // Verifica se o usuário encontrado realmente é um motorista
    if (driver.role != UserRole.DRIVER) {
      throw new Error(`Usuário ${driver.name} não é motorista`);
    }
  }

  // Cria uma nova rota a partir do DTO
  async create(routeDTO: RouteDTO): Promise<Route> {
    const route = routeDTO.toEntity(); // Converte DTO em entidade

    await this.validateRelations(route); // Valida motorista e veículo

    const googleRoute = await this.geoCodeService.getRoute(route); // Busca dados de rotas com Google maps

    if (!Array.isArray(googleRoute?.legs)) {
      throw new Error('Erro: dados da rota inválidos.');
    }

    // Soma distância e duração estimada de cada trecho da rota
    for (const leg of googleRoute.legs) {
      route.estimatedDuration += leg.duration.value;
      route.estimatedDistance += leg.distance.value;
    }

    // Salva no banco e retorna a rota
    return await this.repository.save(route).then(() => route);
  }

  // Atualiza uma rota existente. Primeiro verifica se ela existe, depois recria com os novos dados
  async update(routeDTO: RouteDTO): Promise<any> {
    const existingRoute = await this.repository.findOne({
      where: { id: routeDTO.id },
    });

    if (!existingRoute) {
      throw new Error('Rota não encontrada');
    }

    return this.create(routeDTO); // Chama o create novamente com os dados atualizados
  }

  // "Deleta" uma rota, desativando-a (status: false)
  async delete(id: number): Promise<void> {
    await this.repository.update({ id }, { status: false });
  }

  // Retorna todas as rotas, incluindo dados do motorista e veículo relacionados
  findAll(): Promise<Route[]> {
    return this.repository.find({
      select: {
        driver: {
          name: true,
          id: true,
          enterprise: { id: true, name: true },
        },
        vehicle: {
          id: true,
          plate: true,
          capacity: true,
          model: true,
          enterprise: { id: true, name: true },
          type: true,
        },
      },
      relations: { vehicle: true, driver: true },
      order: { id: 'DESC' },
    });
  }

  // Busca uma rota específica pelo ID, com mais detalhes do motorista e veículo
  findOneById(id: number): Promise<Route | null> {
    return this.repository.findOne({
      where: { id },
      select: {
        driver: {
          name: true,
          id: true,
          cnh: true,
          cpf: true,
          enterprise: { id: true, name: true },
        },
        vehicle: {
          id: true,
          enterprise: { id: true, name: true },
          plate: true,
          capacity: true,
          model: true,
          type: true,
        },
      },
      relations: { vehicle: true, driver: true },
    });
  }

  // Retorna o histórico de uma rota específica
  findHistory(id: number): Promise<History[]> {
    return this.historyService.findByRoute(id);
  }

  // Retorna todas as rotas atribuídas a um motorista específico
  async findByDriverId(driverId: number): Promise<Route[]> {
    return this.repository.find({
      where: { driver: { id: driverId } },
      relations: ['driver', 'vehicle'],
    });
  }
}
