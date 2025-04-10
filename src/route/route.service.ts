import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from 'src/route/entities/route.entity';
import { User } from 'src/user/entities/user.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Repository } from 'typeorm';
import { RouteDTO } from './dtos/route.dto';
import { GeoCodeService } from './geocode.service';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly repository: Repository<Route>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly geoCodeService: GeoCodeService,
  ) {}

  private async validateRelations(route: Route) {
    // Buscar o Veículo com a placa fornecida
    const vehicle = await this.vehicleRepository.findOneBy({
      id: route.vehicle.id,
    });

    if (!vehicle) {
      throw new Error('Veículo com a placa fornecida não encontrado');
    }

    // Buscar o usuário com o id fornecido
    const driver = await this.userRepository.findOneBy({ id: route.driver.id });

    if (!driver) {
      throw new Error('Motorista com o id fornecido não encontrado');
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

    return await this.repository.save(route);
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
          site: true,
          id: true,
          plate: true,
          capacity: true,
          enterprise: { id: true, name: true },
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
          enterprise: { id: true, name: true },
        },
        vehicle: {
          id: true,
          site: true,
          enterprise: { id: true, name: true },
          plate: true,
          capacity: true,
        },
      },
      relations: { vehicle: true, driver: true },
    });
  }
}
