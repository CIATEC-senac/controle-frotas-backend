import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  //Transforma a classe em um serviço injetavél em outros compónentes do codigo, tal qaul um garçom (injectable +_classe) sendo chmado em varias mesas (outros componentes)
  constructor(
    @InjectRepository(User) //Injeta o TypeOrm para manipular a entidade user.
    private repository: Repository<User>, //O Repository vai ser responsavel pelo CRUD do User no banco de dados, private repository pois só e acessado dentro da classe UserService.
  ) {}

  findAll(): Promise<User[]> {
    return this.repository.find({
      select: [
        'id',
        'registration',
        'name',
        'cpf',
        'email',
        'admittedAt',
        'status',
        'role',
        'cnh',
        'source',
      ],
      where: { status: true },
    });
  }

  findOne(cpf: string): Promise<User | null> {
    return this.repository.findOneBy({ cpf });
  }

  findOneById(id: number): Promise<User | null> {
    return this.repository.findOne({
      select: {
        id: true,
        registration: true,
        name: true,
        cpf: true,
        cnh: true,
        email: true,
        admittedAt: true,
        status: true,
        role: true,
      },
      where: { id },
    });
  }

  async delete(id: number): Promise<void> {
    await this.repository.update({ id: id }, { status: false });
  }

  create(user: User): Promise<User> {
    return this.repository.save(user);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update({ password, ...user }: User) {
    return this.repository.update({ id: user.id }, user);
  }
}
