import { Test, TestingModule } from '@nestjs/testing';
import { RotaService } from './rota.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Rota } from './entities/rota.entity';
import { Veiculo } from '../veiculo/entities/veiculo.entity';
import { User } from '../user/entities/user.entity';
import { GeoCodeService } from './geocode.service';
import { Repository } from 'typeorm';

describe('RotaService', () => {
  let service: RotaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RotaService,
        {
          provide: getRepositoryToken(Rota),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Veiculo),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: GeoCodeService,
          useValue: {
            getCoordinates: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RotaService>(RotaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
