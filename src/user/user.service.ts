import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { User, UserRole, UserType } from './entities/user.entity';

@Injectable()
export class UserService { //Transforma a classe em um serviço injetavél em outros compónentes do codigo, tal qaul um garçom (injectable +_classe) sendo chmado em varias mesas (outros componentes)
  constructor(
    @InjectRepository(User) //Injeta o TypeOrm para manipular a entidade user.  
    private repository: Repository<User>, //O Repository vai ser responsavel pelo CRUD do User no banco de dados, private repository pois só e acessado dentro da classe UserService.
  ) {}

  findAll(): Promise<User[]> {
    return this.repository.find();
  }

  //Popular o banco de dados com 1000 usuários com valores aleatorios
  async seed() {
    console.log('seed começo');

    const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';  //vao mostrar quais sao os caracteres dessa cost

    const numerais = '0123456789';

    const constroiAleatorio = (dados: string, min: number, max: number) => {    //aqui vai ser onde vamos gerar o dado fake em 'dados:string'
      const lista = dados.split(''); //vai transsformar os caracteres em array, ex: "01234" vai virar "0,1,2,3,"
      const tamanho = Math.floor(Math.random() * (max - min)) + min; //a const tamanho vai fai definir o tamanho da string (por ex o cpf que pode ter so 11 caracter)
      //mathradom pega um numero aleatorio ente 0 e 1: 0.1645645, 0,23455 etc
      //(max - min)) + min onde é max e min de caracteres q pode ter, ex do cpf, é obrigatorio ter 11 caracteres entao tanto o maxe o min sao 11
      //math floor arredonda para abaixo.
      let valor = '';

      for (let i = 0; i < tamanho; i++) {  // cria um loop com base no numeto da const tamanho
        const randomChar = Math.floor(Math.random() * lista.length); //vai criar uma lista
        valor += lista[randomChar]; // vai organizar a lista
      }

      return valor;
    };

    const constroiUsuarioAleatorio = (): User => {
      const user = new User();

      user.matricula = Number(constroiAleatorio(numerais, 5, 5)); // ta determinado qual const para strign e seu min e max
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

    for (let i = 0; i <= 100; i++) {
      await this.create(constroiUsuarioAleatorio()).catch((e) => //aqui cria o usuario fake, atravez do await ele espera a opração esta finalizada para começar a proxima
        console.log('erro ao inserir usuario', i), //menssagem de erro
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
