import { Test, TestingModule } from '@nestjs/testing';
import { ManutencaoService } from './manutencao.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Manutencao } from './entities/manutencao.entity';
import { Repository } from 'typeorm';

describe('ManutencaoService', () => {
  let service: ManutencaoService;
  let manutencaoRepositoryMock: Partial<
    Record<keyof Repository<Manutencao>, jest.Mock>
  >;

  beforeEach(async () => {
    manutencaoRepositoryMock = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(null),
      delete: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManutencaoService,
        {
          provide: getRepositoryToken(Manutencao),
          useValue: manutencaoRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ManutencaoService>(ManutencaoService);
  });

  it('não definido', () => {
    expect(service).toBeDefined();
  });
});
