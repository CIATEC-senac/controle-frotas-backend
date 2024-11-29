import { Test, TestingModule } from '@nestjs/testing';
import { RotaService } from './rota.service';

describe('RotaService', () => {
  let service: RotaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RotaService],
    }).compile();

    service = module.get<RotaService>(RotaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
