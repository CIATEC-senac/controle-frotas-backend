import { Manutencao } from 'src/manutencao/entities/manutencao.entity';
import { Rota } from 'src/rota/entities/rota.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum VeiculoType {
  CAR = 'carro',
  VAN = 'van',
  BUS = 'onibus',
  MINIBUS = 'minionibus',
}

@Entity('veiculo')
export class Veiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 7, unique: true })
  placa: string;

  @Column({
    type: 'enum',
    enum: VeiculoType,
    default: VeiculoType.BUS,
  })
  modelo: VeiculoType;

  @Column({ length: 100 })
  empresa: string;

  @Column({ default: true })
  status: boolean;

  @Column()
  capacidade: number;

  @Column()
  ano: number;

  @Column({ length: 100 })
  obra: string;

  @ManyToMany(() => Manutencao, (manutencao) => manutencao.veiculos)
  manutencoes: Manutencao[];

  @OneToMany(() => Rota, (rota) => rota.veiculo)
  rotas: Rota[];
}
