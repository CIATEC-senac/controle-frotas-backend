import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Veiculo, VeiculoType } from './entities/veiculo.entity';

@Injectable()
export class VeiculoService {
  constructor(
    @InjectRepository(Veiculo)
    private repository: Repository<Veiculo>,
  ) {}

  async seed() {
    console.log('seed start');

    const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numerais = '0123456789';

    const constroiVeiculos = (dados: string, min: number, max: number) => {
      const lista = dados.split('');
      const tamnho = Math.floor(Math.random() * (max - min)) + min;
      let valor = '';

      for (let i = 0; i < tamnho; i++) {
        const randomChar = Math.floor(Math.random() * lista.length);
        valor += lista[randomChar];
      }

      return valor;
    };

    const placaAleatoria = (): string => {
      const parte1 = constroiVeiculos(alfabeto, 3, 3);
      const parte2 = constroiVeiculos(numerais, 1, 1);
      const parte3 = constroiVeiculos(alfabeto, 1, 1);
      const parte4 = constroiVeiculos(numerais, 2, 2);

      return `${parte1}${parte2}${parte3}${parte4}`;
    };

    const constroiVeiculosAleatorio = (): Veiculo => {
      const veiculo = new Veiculo();

      veiculo.empresa = String(constroiVeiculos(alfabeto, 10, 15));
      veiculo.capacidade = Number(constroiVeiculos(numerais, 1, 3));
      veiculo.ano = Number(constroiVeiculos(numerais, 4, 4));
      veiculo.obra = constroiVeiculos(alfabeto, 1, 100);
      veiculo.status = true;
      veiculo.modelo = VeiculoType.BUS;
      veiculo.placa = placaAleatoria();
      veiculo.id = Number(constroiVeiculos(numerais, 10, 10));

      return veiculo;
    };

    for (let i = 0; i <= 100; i++) {
      await this.create(constroiVeiculosAleatorio()).catch(() =>
        console.log('erro ao inserir veiculo', i),
      );
    }
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  findAll(): Promise<Veiculo[]> {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    return this.repository
      .find({
        select: {
          manutencoes: {
            id: true,
            data: true,
          },
        },
        relations: {
          manutencoes: true,
        },
      })
      .then((veiculos) => {
        return veiculos.map((veiculo) => {
          veiculo.status = veiculo.manutencoes?.some((manutencao) => {
            return manutencao.data.getTime() >= today.getTime();
          });

          return veiculo;
        });
      });
  }

  findOne(placa: string): Promise<Veiculo | null> {
    return this.repository.findOneBy({ placa });
  }

  async findOneBy(id: number): Promise<Veiculo | undefined> {
    return this.repository.findOne({
      where: { id },
      relations: {
        manutencoes: true,
      },
    });
  }

  create(veiculo: Veiculo): Promise<InsertResult> {
    return this.repository.insert(veiculo);
  }

  update(veiculo: Veiculo) {
    return this.repository.update(
      {
        id: veiculo.id,
      },
      veiculo,
    );
  }
}
