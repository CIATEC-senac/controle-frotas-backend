import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

export enum VeiculoType {
  CAR = 'Carro',
  VAN = 'Van',
  BUS = 'Ônibus',
  MINIBUS = 'MiniOnibus',
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
}
