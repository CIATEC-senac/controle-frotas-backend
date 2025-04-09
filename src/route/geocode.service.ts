import { Injectable } from '@nestjs/common';
import { Axios } from 'axios';
import * as http from 'http';
import * as https from 'https';
import { Coordinates } from 'src/history/entities/history.entity';
import { Coordinate, Route } from 'src/route/entities/route.entity';

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
  public async getAddress(address: string): Promise<Coordinate> {
    const request = this.axios.get('/maps/api/geocode/json', {
      params: { address: address, key: process.env.GCP_APIKEY },
    });

    return request
      .then((response) => {
        const { results } = JSON.parse(response.data);

        if (!results || !results[0]) {
          throw new Error(`Endereço não encontrado: ${address}`);
        }

        return <Coordinate>{
          lat: results[0].geometry.location.lat,
          lng: results[0].geometry.location.lng,
        };
      })
      .catch((error) => {
        throw new Error(
          `Erro ao processar a resposta da API: ${address} ${error.message}`,
        );
      });
  }

  public async getRoute(route: Route) {
    const origin = await this.getAddress(route.path?.origin);
    const destination = await this.getAddress(route.path?.destination);

    // Geocodificar os waypoints (endereços) e converte para coordenadas
    const geocodedWaypoints = await Promise.all(
      route.path.stops.map((stop) => this.getAddress(stop)),
    );

    route.pathCoordinates = {
      stops: geocodedWaypoints,
      origin: origin,
      destination: destination,
    };

    return await this.getGoogleRoute(
      route.path.origin,
      route.path.destination,
      geocodedWaypoints,
    );
  }

  public async getGoogleRoute(
    origin: string,
    destination: string,
    waypoints: Coordinates[],
  ) {
    const waypointsString = waypoints
      .map((wp) => `${wp.lat},${wp.lng}`)
      .join('|');

    return this.axios
      .get('/maps/api/directions/json', {
        params: {
          origin: origin,
          destination: destination,
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
