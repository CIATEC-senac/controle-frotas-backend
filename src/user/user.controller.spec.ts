import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let userServiceMock: Partial<Record<keyof UserService, jest.Mock>>;

  beforeEach(async () => {
    userServiceMock = {
      findAll: jest.fn().mockResolvedValue([]),
      findOneById: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue(null),
      delete: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('não definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('list users', async () => {
      const users: User[] = [{ id: 1, nome: 'Camila' }] as User[];
      userServiceMock.findAll?.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(userServiceMock.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('find', () => {
    it('200', async () => {
      const user: User = { id: 1, nome: 'Camila' } as User;
      userServiceMock.findOneById?.mockResolvedValue(user);

      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.find(1, res);

      expect(userServiceMock.findOneById).toHaveBeenCalledWith(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(user);
    });

    it('404 user nao encontrado', async () => {
      userServiceMock.findOneById?.mockResolvedValue(null);

      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await controller.find(1, res);

      expect(userServiceMock.findOneById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
