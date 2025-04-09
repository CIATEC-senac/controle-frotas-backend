import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { RouteDTO } from './dtos/route.dto';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';

describe('RotaController', () => {
  let controller: RouteController;
  let service: RouteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RouteController],
      providers: [
        {
          provide: RouteService,
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

    controller = module.get<RouteController>(RouteController);
    service = module.get<RouteService>(RouteService);
  });

  // Teste para o método de criação
  describe('create', () => {
    it('should create a new route and return status 201', async () => {
      // Criando um DTO com dados fictícios
      const dto = new RouteDTO();
      dto.id = 1;

      dto.trajeto = {
        stops: ['Campinas', 'São José dos Campos'],
        origin: 'São Paulo',
        destination: 'Rio de Janeiro',
      };

      dto.estimatedDuration = 3000;
      dto.estimatedDistance = 450;

      // Chamando o método `toEntity` para criar a instância de Rota
      const entity = dto.toEntity();

      // O resultado esperado que será retornado pelo mock
      const result = { id: 1, ...dto };

      // Mock do serviço para retornar o resultado esperado
      (service.create as jest.Mock).mockResolvedValue(result);

      // Simulando a resposta da requisição
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      // Chamando o controlador
      await controller.create(dto, res);

      // Verificando se o serviço foi chamado com a entidade
      expect(service.create).toHaveBeenCalledWith(entity);

      // Verificando se o status foi configurado corretamente
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);

      // Verificando se o JSON da resposta foi chamado com o resultado esperado
      expect(res.json).toHaveBeenCalledWith(result);
    });
  });

  // Teste para o método de obtenção de rota por ID
  describe('find', () => {
    it('should return the route with status 200', async () => {
      const dto = new RouteDTO();
      dto.id = 1;

      dto.trajeto = {
        stops: ['Campinas', 'São José dos Campos'],
        origin: 'São Paulo',
        destination: 'Rio de Janeiro',
      };

      dto.estimatedDuration = 3000;
      dto.estimatedDistance = 450;

      const rota = dto.toEntity();

      // Mock para o serviço de buscar a rota por ID
      (service.findOneById as jest.Mock).mockResolvedValue(rota);

      // Simulando a resposta da requisição
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      // Chamando o método do controlador
      await controller.find(1, res);

      // Verificando se o método foi chamado corretamente
      expect(service.findOneById).toHaveBeenCalledWith(1);

      // Verificando se a resposta foi enviada com a rota encontrada
      expect(res.send).toHaveBeenCalledWith(rota);

      // Verificando se o status 200 foi retornado
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should return status 404 if route is not found', async () => {
      // Mock do serviço retornando null (rota não encontrada)
      (service.findOneById as jest.Mock).mockResolvedValue(null);

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      // Chamando o método do controlador
      await controller.find(1, res);

      // Verificando se o status 404 foi retornado
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);

      // Verificando se nada foi enviado no corpo da resposta
      expect(res.send).toHaveBeenCalled();
    });
  });

  // Teste para o método de atualização
  describe('update', () => {
    it('should update a route and return status 200', async () => {
      const dto = new RouteDTO();
      dto.id = 1;

      dto.trajeto = {
        stops: ['Campinas', 'São José dos Campos'],
        origin: 'São Paulo',
        destination: 'Rio de Janeiro',
      };

      dto.estimatedDuration = 3000;
      dto.estimatedDistance = 450;

      const entity = dto.toEntity();

      const result = { id: 1, ...dto };

      // Mock para o serviço de atualização
      (service.update as jest.Mock).mockResolvedValue(result);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      // Chamando o controlador de update
      await controller.update(dto, res);

      // Verificando se o método de update foi chamado corretamente
      expect(service.update).toHaveBeenCalledWith(entity);

      // Verificando se o status 200 foi retornado
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);

      // Verificando se o JSON da resposta foi enviado corretamente
      expect(res.json).toHaveBeenCalledWith(result);
    });
  });

  // Teste para o método de exclusão
  describe('delete', () => {
    it('should delete a route and return status 200', async () => {
      const dto = new RouteDTO();
      dto.id = 1;

      // Mock para o serviço de deleção
      (service.delete as jest.Mock).mockResolvedValue(undefined);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      // Chamando o método de deletar
      await controller.delete(1, res);

      // Verificando se o método de delete foi chamado
      expect(service.delete).toHaveBeenCalledWith(1);

      // Verificando se o status 200 foi retornado
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });
});
