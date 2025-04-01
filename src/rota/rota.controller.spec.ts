import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { RotaController } from './rota.controller';
import { RotaService } from './rota.service';
import { RotaDTO } from './dtos/rota.dto';
import { Veiculo } from 'src/veiculo/entities/veiculo.entity';
import { User } from 'src/user/entities/user.entity';

describe('RotaController', () => {
  let controller: RotaController;
  let service: RotaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RotaController],
      providers: [
        {
          provide: RotaService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RotaController>(RotaController);
    service = module.get<RotaService>(RotaService);
  });

  describe('find', () => {
    it('should return the route with status 200', async () => {
      const dto = new RotaDTO();
      dto.id = 1;
      dto.trajeto = {
        paradas: ['Campinas', 'São José dos Campos'],
        origem: 'São Paulo',
        destino: 'Rio de Janeiro',
      };
      dto.tempoTotal = 3000;
      dto.kmTotal = 450;
      dto.veiculo = 1;
      dto.motorista = 2;

      const entity = {
        ...dto,
        veiculo: { id: dto.veiculo } as Veiculo,
        motorista: { id: dto.motorista } as User,
      };

      (service.findOneById as jest.Mock).mockResolvedValue(entity);

      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.find(1, res);

      expect(service.findOneById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(entity);
    });

    it('should return status 404 if route is not found', async () => {
      (service.findOneById as jest.Mock).mockResolvedValue(null);

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await controller.find(1, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
