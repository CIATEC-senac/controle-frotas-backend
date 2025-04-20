import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { User, UserRole, UserSource } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  //Transforma a classe em um serviço injetavél em outros compónentes do codigo, tal qaul um garçom (injectable +_classe) sendo chmado em varias mesas (outros componentes)
  constructor(
    @InjectRepository(User) //Injeta o TypeOrm para manipular a entidade user.
    private repository: Repository<User>, //O Repository vai ser responsavel pelo CRUD do User no banco de dados, private repository pois só e acessado dentro da classe UserService.
  ) {}

  // Busca todos os usuários
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
      order: { name: 'ASC' },
    });
  }

  // Busca um usuário por CPF
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

  // Exlui um usuário pelo id e atualiza o status pra false
  async delete(id: number): Promise<void> {
    await this.repository.update({ id: id }, { status: false });
  }

  // Cria um novo usuário
  create(user: User): Promise<User> {
    return this.repository.save(user);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update({ password, ...user }: User) {
    return this.repository.update({ id: user.id }, user);
  }

  // Cria um usuário padrão para acessar o sistema
  async createAdmin() {
    const existingAdmin = await this.repository.findOne({
      where: { cpf: '11111111111' },
    });

    if (!existingAdmin) {
      this.logger.debug('Creating admin');

      const admin = plainToClass(User, {
        admittedAt: new Date(),
        cnh: '',
        cpf: '11111111111',
        email: 'admin@frotas',
        enterprise: null,
        name: 'Admin',
        password: AuthService.encrypt('admin'),
        registration: 0,
        role: UserRole.ADMIN,
        source: UserSource.INSOURCED,
        status: true,
      });

      await this.create(admin)
        .then(() => this.logger.debug('Admin successfully created'))
        .catch((e) =>
          this.logger.error(`Could not create admin. Error: ${e.message}`),
        );
    }
  }
}
