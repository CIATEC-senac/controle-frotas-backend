import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from 'src/route/entities/route.entity';
import { UserRole } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RouteDTO } from './dtos/route.dto';
import { GeoCodeService } from './geocode.service';
import { UserService } from 'src/user/user.service';
import { VehicleService } from 'src/vehicle/vehicle.service';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly repository: Repository<Route>,
    private readonly vehicleService: VehicleService,
    private readonly userService: UserService,
    private readonly geoCodeService: GeoCodeService,
  ) {}

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

    if (driver.role != UserRole.DRIVER) {
      throw new Error(`Usuário ${driver.name} não é motorista`);
    }
  }

  async create(routeDTO: RouteDTO): Promise<Route> {
    const route = routeDTO.toEntity();

    await this.validateRelations(route);

    const googleRoute = await this.geoCodeService.getRoute(route);

    if (!Array.isArray(googleRoute?.legs)) {
      throw new Error('Erro: dados da rota inválidos.');
    }

    for (const leg of googleRoute.legs) {
      route.estimatedDuration += leg.duration.value;
      route.estimatedDistance += leg.distance.value;
    }

    return await this.repository.save(route).then(() => route);
  }

  async update(routeDTO: RouteDTO): Promise<any> {
    const existingRoute = await this.repository.findOne({
      where: { id: routeDTO.id },
    });

    if (!existingRoute) {
      throw new Error('Rota não encontrada');
    }

    return this.create(routeDTO);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

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
    });
  }

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
}
