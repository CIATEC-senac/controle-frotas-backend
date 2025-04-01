import { Test, TestingModule } from '@nestjs/testing';
import { ManutencaoController } from './manutencao.controller';
import { ManutencaoService } from './manutencao.service';

describe('ManutencaoController', () => {
  let controller: ManutencaoController;
  let service: ManutencaoService;

  beforeEach(async () => {
    const serviceMock = {
      findAll: jest.fn().mockResolvedValue([]),
      findOneById: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue(null),
      delete: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManutencaoController],
      providers: [
        {
          provide: ManutencaoService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<ManutencaoController>(ManutencaoController);
    service = module.get<ManutencaoService>(ManutencaoService);
  });
});
