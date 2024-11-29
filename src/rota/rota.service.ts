import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult, UpdateResult } from 'typeorm';
import { Rota } from 'src/rota/entities/rota.entity';
import { RotaDTO } from './dtos/rota.dto';
import * as https from 'https';

@Injectable()
export class RotaService {
  private readonly googleApiKey = 'AIzaSyBDE4ksnbBdrkh5ZnBl21pZ3V-Ypj5oKQQ';

  constructor(
    @InjectRepository(Rota)
    private readonly repository: Repository<Rota>,
  ) {}

  private fetchGoogleRoute(origem: string, destino: string, waypoints: string[]): Promise<any> {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origem}&destination=${destino}&waypoints=${waypoints.join('|')}&key=${this.googleApiKey}`;

    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
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
              reject(new Error('Nenhuma rota encontrada na resposta da API.'));
            }
          } catch (error) {
            reject(new Error('Erro ao processar a resposta da API: ' + error.message));
          }
        });
      }).on('error', (error) => {
        reject(new Error('Erro ao consultar a API do Google: ' + error.message));
      });
    });
  }

  async create(rotaDTO: RotaDTO): Promise<InsertResult> {
    const rota = rotaDTO.toEntity();
    const waypoints = rotaDTO.waypoints || [];


    const googleRoute = await this.fetchGoogleRoute(rota.origem, rota.destino, waypoints);

    // Preenche os dados com base na resposta da API
    rota.tempoTotal = googleRoute.legs.reduce((acc, leg) => acc + leg.duration.value, 0);
    rota.kmTotal = googleRoute.legs.reduce((acc, leg) => acc + leg.distance.value, 0);
    rota.rotaJson = googleRoute; 

    return this.repository.insert(rota);
  }

  async update(rota: Rota): Promise<UpdateResult> {
    const Rotaexistente = await this.repository.findOne({ where: { id: rota.id } });

    if (!Rotaexistente) {
      throw new Error('Rota não encontrada');
    }

  
    const waypoints = rota.waypoints || [];
    if (rota.origem !== Rotaexistente.origem || rota.destino !== Rotaexistente.destino || waypoints.length > 0) {
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
}
