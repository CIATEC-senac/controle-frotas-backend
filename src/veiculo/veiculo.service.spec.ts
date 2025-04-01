import { Test, TestingModule } from '@nestjs/testing';
import { VeiculoService } from './veiculo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Veiculo } from './entities/veiculo.entity';
import { Repository } from 'typeorm';

describe('VeiculoService', () => {
  let service: VeiculoService;
  let veiculoRepositoryMock: Partial<
    Record<keyof Repository<Veiculo>, jest.Mock>
  >;

  beforeEach(async () => {
    veiculoRepositoryMock = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(null),
      delete: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VeiculoService,
        {
          provide: getRepositoryToken(Veiculo),
          useValue: veiculoRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<VeiculoService>(VeiculoService);
  });

  it('não definido', () => {
    expect(service).toBeDefined();
  });
});
