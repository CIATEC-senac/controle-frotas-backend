import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn,  OneToMany } from 'typeorm';
import { Manutencao } from 'src/manutencao/entities/manutencao.entity';
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

  @PrimaryColumn({ length: 7 })
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

  @OneToMany(() => Manutencao, manutencao => manutencao.veiculo)
  manutencoes: Manutencao[];
}
