import { Injectable } from '@nestjs/common';

import { Coordinate } from 'src/route/entities/route.entity';

@Injectable()
export class DouglasPeuckerService {
  /**
   * Aplica o algoritmo de Douglas-Peucker para simplificar uma linha de coordenadas.
   * @param points Lista de coordenadas (lat e lng)
   * @param tolerance Tolerância em metros
   * @returns Lista de coordenadas simplificadas
   */
  douglasPeucker(points: Coordinate[], tolerance: number): Coordinate[] {
    if (points.length <= 2) {
      return points;
    }

    let maxDistance = 0;
    let indexFarthest = 0;
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];

    for (let i = 1; i < points.length - 1; i++) {
      const dist = this.perpendicularDistance(points[i], firstPoint, lastPoint);
      if (dist > maxDistance) {
        maxDistance = dist;
        indexFarthest = i;
      }
    }

    if (maxDistance > tolerance) {
      const leftPart = points.slice(0, indexFarthest + 1);
      const rightPart = points.slice(indexFarthest);

      const simplifiedLeft = this.douglasPeucker(leftPart, tolerance);
      const simplifiedRight = this.douglasPeucker(rightPart, tolerance);

      return simplifiedLeft
        .slice(0, simplifiedLeft.length - 1)
        .concat(simplifiedRight);
    } else {
      return [firstPoint, lastPoint];
    }
  }

  /**
   * Calcula a distância perpendicular de um ponto a uma linha (definida por duas coordenadas).
   * @param point Ponto intermediário
   * @param lineStart Início da linha
   * @param lineEnd Fim da linha
   * @returns Distância perpendicular em metros
   */
  perpendicularDistance(
    point: Coordinate,
    lineStart: Coordinate,
    lineEnd: Coordinate,
  ): number {
    // Se o início e o fim da linha forem o mesmo ponto, calcula a distância simples
    if (lineStart.lat === lineEnd.lat && lineStart.lng === lineEnd.lng) {
      return this.haversineDistance(point, lineStart);
    }

    // Converter para metros usando uma projeção simples local
    const start = this.toMeters(lineStart, lineStart);
    const end = this.toMeters(lineEnd, lineStart);
    const pt = this.toMeters(point, lineStart);

    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const t =
      ((pt.x - start.x) * dx + (pt.y - start.y) * dy) / (dx * dx + dy * dy);
    const tClamped = Math.max(0, Math.min(1, t));

    const closest = {
      x: start.x + tClamped * dx,
      y: start.y + tClamped * dy,
    };

    const distX = pt.x - closest.x;
    const distY = pt.y - closest.y;

    return Math.sqrt(distX * distX + distY * distY);
  }

  /**
   * Converte coordenadas para um sistema de coordenadas em metros baseado numa origem local.
   * (Projeção equiretangular aproximada — funciona bem para áreas pequenas)
   * @param coord Coordenada a ser convertida
   * @param origin Origem da projeção
   * @returns Ponto em metros
   */
  toMeters(coord: Coordinate, origin: Coordinate): { x: number; y: number } {
    const earthRadius = 6378137; // Raio da Terra em metros (WGS84)

    const dLat = ((coord.lat - origin.lat) * Math.PI) / 180;
    const dLon = ((coord.lng - origin.lng) * Math.PI) / 180;

    const x = dLon * earthRadius * Math.cos((origin.lat * Math.PI) / 180);
    const y = dLat * earthRadius;

    return { x, y };
  }

  /**
   * Calcula a distância haversine entre dois pontos em metros.
   * @param x Primeira coordenada
   * @param y Segunda coordenada
   * @returns Distância em metros
   */
  haversineDistance(x: Coordinate, y: Coordinate): number {
    const R = 6371000; // Raio da Terra em metros
    const toRadians = (deg: number): number => deg * (Math.PI / 180);

    const lat1 = toRadians(x.lat);
    const lat2 = toRadians(y.lat);
    const deltaLat = lat2 - lat1;
    const deltaLon = toRadians(y.lng - x.lng);

    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
