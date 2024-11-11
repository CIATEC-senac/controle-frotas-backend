import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { User, UserRole, UserType } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  findAll(page: number = 1, perPage: number): Promise<User[]> {
    page = page === 0 ? 1 : page;

    const skip = perPage * (page - 1);

    return this.repository.find({
      order: {
        id: 'ASC',
      },
      take: perPage,
      skip: skip,
    });
  }

  //Popular o banco de dados com 1000 usuários com valores aleatorios
  async seed() {
    console.log('seed começo');

    const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const numerais = '0123456789';

    const constroiAleatorio = (dados: string, min: number, max: number) => {
      const lista = dados.split('');
      const tamanho = Math.floor(Math.random() * (max - min)) + min;

      let valor = '';

      for (let i = 0; i < tamanho; i++) {
        const randomChar = Math.floor(Math.random() * lista.length);
        valor += lista[randomChar];
      }

      return valor;
    };

    const constroiUsuarioAleatorio = (): User => {
      const user = new User();

      user.matricula = Number(constroiAleatorio(numerais, 5, 5));
      user.nome = constroiAleatorio(alfabeto, 5, 10);
      user.cpf = constroiAleatorio(numerais, 11, 11);
      user.email = `${constroiAleatorio(alfabeto, 10, 15)}@gmail.com`;
      user.dataAdmissao = new Date();
      user.status = true;
      user.obra = constroiAleatorio(alfabeto, 1, 100);
      user.cargo = UserRole.MOTORISTA;
      user.cnh = constroiAleatorio(numerais, 11, 11);
      user.tipo = UserType.TERCEIROS;
      user.senha = AuthService.encrypt('senha');

      return user;
    };

    for (let i = 0; i <= 1000; i++) {
      await this.create(constroiUsuarioAleatorio()).catch((e) =>
        console.log('erro ao inserir usuario', i),
      );
    }
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

  update({ senha, ...user }: User) {
    return this.repository.update(
      {
        id: user.id,
      },
      user,
    );
  }
}
