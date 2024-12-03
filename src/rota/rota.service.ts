import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rota } from 'src/rota/entities/rota.entity';
import { Veiculo } from 'src/veiculo/entities/veiculo.entity';
import * as https from 'https';
import { RotaDTO } from './dtos/rota.dto';

@Injectable()
export class RotaService {
  private readonly googleApiKey = 'AIzaSyBDE4ksnbBdrkh5ZnBl21pZ3V-Ypj5oKQQ';

  constructor(
    @InjectRepository(Rota)
    private readonly repository: Repository<Rota>,
    @InjectRepository(Veiculo)
    private readonly veiculoRepository: Repository<Veiculo>,
  ) {}

  // Função para geocodificar um endereço e retornar coordenadas
  private async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${this.googleApiKey}`;
  
    return new Promise((resolve, reject) => {
      https
        .get(url, (response) => {
          let data = '';
  
          response.on('data', (chunk) => {
            data += chunk;
          });
  
          response.on('end', () => {
            try {
              const result = JSON.parse(data);
              console.log('Resposta da API de Geocodificação:', result); 
              if (result.results && result.results[0]) {
                const location = result.results[0].geometry.location;
                resolve({ latitude: location.lat, longitude: location.lng });
              } else {
                reject(new Error(`Endereço não encontrado: ${address}`));
              }
            } catch (error) {
              reject(new Error(`Erro ao processar a resposta da API: ${error.message}`));
            }
          });
        })
        .on('error', (error) => {
          reject(new Error(`Erro ao geocodificar o endereço: ${error.message}`));
        });
    });
  }

  async create(rotaDTO: RotaDTO): Promise<Rota[]> {
    const rota = rotaDTO.toEntity();  
    const waypoints = rotaDTO.waypoints || [];

    // Buscar o Veículo com a placa fornecida
    const veiculo = await this.veiculoRepository.findOne({ where: { placa: rota.placa } });

    if (!veiculo) {
      throw new Error('Veículo com a placa fornecida não encontrado');
    }

    rota.placa = veiculo.placa;
    rota.veiculo = veiculo;    


    const originCoordinates = await this.geocodeAddress(rota.origem);
    const destinationCoordinates = await this.geocodeAddress(rota.destino);

    // Geocodificar os waypoints (endereços) e converte para coordenadas
    const geocodedWaypoints = await Promise.all(
      waypoints.map(async (waypoint) => {
        const coordinates = await this.geocodeAddress(waypoint);
        return { latitude: coordinates.latitude, longitude: coordinates.longitude };
      })
    );

    rota.waypoints = geocodedWaypoints;
    rota.origem = `${originCoordinates.latitude},${originCoordinates.longitude}`;
    rota.destino = `${destinationCoordinates.latitude},${destinationCoordinates.longitude}`;

    const googleRoute = await this.fetchGoogleRoute(
      rota.origem,
      rota.destino,
      geocodedWaypoints
    );

    if (googleRoute.legs && Array.isArray(googleRoute.legs)) {
      rota.tempoTotal = googleRoute.legs.reduce((acc, leg) => acc + leg.duration.value, 0);
      rota.kmTotal = googleRoute.legs.reduce((acc, leg) => acc + leg.distance.value, 0);
    } else {
      throw new Error('Erro: dados da rota inválidos.');
    }

    rota.rotaJson = googleRoute;

    const savedRota = await this.repository.save(rota);

    return [savedRota];
  }

  async update(rota: Rota): Promise<any> {
    const rotaExistente = await this.repository.findOne({ where: { id: rota.id } });

    if (!rotaExistente) {
      throw new Error('Rota não encontrada');
    }

    const waypoints = rota.waypoints || [];
    if (rota.origem !== rotaExistente.origem || rota.destino !== rotaExistente.destino || waypoints.length > 0) {
      const googleRoute = await this.fetchGoogleRoute(rota.origem, rota.destino, waypoints);

      rota.tempoTotal = googleRoute.legs.reduce((acc, leg) => acc + leg.duration.value, 0);
      rota.kmTotal = googleRoute.legs.reduce((acc, leg) => acc + leg.distance.value, 0);
    }

    return this.repository.update({ id: rota.id }, rota);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  findAll(page: number, perPage: number): Promise<Rota[]> {
    return this.repository.find({
      take: perPage,
      skip: perPage * (page - 1),
    });
  }

  findOneById(id: number): Promise<Rota | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  findOneByOrigemDestino(origem: string, destino: string): Promise<Rota | null> {
    return this.repository.findOne({
      where: { origem, destino },
    });
  }

  private async fetchGoogleRoute(
    origem: string,
    destino: string,
    waypoints: { latitude: number; longitude: number }[]
  ) {
    const waypointsString = waypoints
      .map((wp) => `${wp.latitude},${wp.longitude}`)
      .join('|');

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origem}&destination=${destino}&waypoints=optimize:true|${waypointsString}&key=${this.googleApiKey}`;

    return new Promise<any>((resolve, reject) => {
      https
        .get(url, (response) => {
          let data = '';

          response.on('data', (chunk) => {
            data += chunk;
          });

          response.on('end', () => {
            try {
              const result = JSON.parse(data);
              if (result.routes && result.routes[0]) {
                resolve(result.routes[0]);
              } else {
                reject(new Error('Erro ao obter dados da rota.'));
              }
            } catch (error) {
              reject(new Error(`Erro ao processar a resposta da API de rotas: ${error.message}`));
            }
          });
        })
        .on('error', (error) => {
          reject(new Error(`Erro na requisição à API de rotas: ${error.message}`));
        });
    });
  }
}
