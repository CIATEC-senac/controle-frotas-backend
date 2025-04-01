import { Test, TestingModule } from '@nestjs/testing';
import { VeiculoController } from './veiculo.controller';
import { VeiculoService } from './veiculo.service';

describe('VeiculoController', () => {
  let controller: VeiculoController;
  let veiculoServiceMock: Partial<Record<keyof VeiculoService, jest.Mock>>;

  beforeEach(async () => {
    veiculoServiceMock = {
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue(null),
      delete: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VeiculoController],
      providers: [
        {
          provide: VeiculoService,
          useValue: veiculoServiceMock,
        },
      ],
    }).compile();

    controller = module.get<VeiculoController>(VeiculoController);
  });

  it('não defindo', () => {
    expect(controller).toBeDefined();
  });
});
