import { FindOptionsSelect } from 'typeorm';
import { History } from './entities/history.entity';

export const coordinate = { lat: true, lng: true };

export const completeSelect: FindOptionsSelect<History> = {
  id: true,
  odometerInitial: true,
  odometerFinal: true,
  elapsedDistance: true,
  imgOdometerInitial: true,
  imgOdometerFinal: true,
  pathCoordinates: {
    origin: coordinate,
    destination: coordinate,
    stops: true,
  },
  path: { origin: true, destination: true, stops: true },
  startedAt: true,
  endedAt: true,
  route: {
    id: true,
    path: { origin: true, destination: true, stops: true },
    pathCoordinates: {
      origin: coordinate,
      destination: coordinate,
      stops: true,
    },
    estimatedDistance: true,
    estimatedDuration: true,
  },
  driver: { id: true, name: true, cnh: true, cpf: true },
  approval: {
    approvedBy: { id: true, name: true, cnh: true, cpf: true },
    date: true,
    observation: true,
    status: true,
  },
  vehicle: { id: true, plate: true, model: true, type: true, capacity: true },
};
