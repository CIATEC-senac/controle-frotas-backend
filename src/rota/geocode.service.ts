import { Injectable } from '@nestjs/common';
import { Axios } from 'axios';
import * as http from 'http';
import * as https from 'https';
import { Coordenada, Rota } from 'src/rota/entities/rota.entity';

@Injectable()
export class GeoCodeService {
  private axios: Axios;

  constructor() {
    this.axios = new Axios({
      baseURL: 'https://maps.googleapis.com',
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      validateStatus: (status) => status < 400,
    });
  }

  // Função para geocodificar um endereço e retornar coordenadas
  public async getAddress(address: string): Promise<Coordenada> {
    const request = this.axios.get('/maps/api/geocode/json', {
      params: { address: address, key: process.env.GCP_APIKEY },
    });

    
    return request
    .then((response) => {
      const { results } = JSON.parse(response.data);
      
      if (!results || !results[0]) {
        throw new Error(`Endereço não encontrado: ${address}`);
      }
      
      return <Coordenada>{
        latitude: results[0].geometry.location.lat,
        longitude: results[0].geometry.location.lng,
      };
    })
    .catch((error) => {
      throw new Error(
        `Erro ao processar a resposta da API: ${address} ${error.message}`,
      );
    });
  }
  
  public async getRoute(rota: Rota) {
    const origin = await this.getAddress(rota.trajeto?.origem);
    const destination = await this.getAddress(rota.trajeto?.destino);

    // Geocodificar os waypoints (endereços) e converte para coordenadas
    const geocodedWaypoints = await Promise.all(
      rota.trajeto.paradas.map((parada) => this.getAddress(parada)),
    );

    rota.trajetoCoordenadas = {
      paradas: geocodedWaypoints,
      origem: origin,
      destino: destination,
    };

    return await this.getGoogleRoute(
      rota.trajeto.origem,
      rota.trajeto.destino,
      geocodedWaypoints,
    );
  }

  public async getGoogleRoute(
    origem: string,
    destino: string,
    waypoints: Coordenada[],
  ) {
    const waypointsString = waypoints
      .map((wp) => `${wp.latitude},${wp.longitude}`)
      .join('|');

    return this.axios
      .get('/maps/api/directions/json', {
        params: {
          origin: origem,
          destination: destino,
          waypoints: `optimize:true|${waypointsString}`,
          key: process.env.GCP_APIKEY,
          mode: 'driving',
        },
      })
      .then((response) => {
        const { routes } = JSON.parse(response.data);

        if (!routes || !routes[0]) {
          throw new Error('Erro ao obter dados da rota.');
        }

        return routes[0];
      })
      .catch((error) => {
        throw new Error(
          `Erro ao processar a resposta da API: ${error.message}`,
        );
      });
  }
}
