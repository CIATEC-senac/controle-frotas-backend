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
      select: ['id', 'name', 'admittedAt', 'role', 'routes'],
    });
  }

  findOne(cpf: string): Promise<User | null> {
    return this.repository.findOneBy({ cpf });
  }

  findOneById(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  create(user: User): Promise<User> {
    return this.repository.save(user);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update({ password, ...user }: User) {
    return this.repository.update({ id: user.id }, user);
  }
}
