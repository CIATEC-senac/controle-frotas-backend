import { Veiculo } from 'src/veiculo/entities/veiculo.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum ManutencaoType {
  CORRETIVA = 'corretiva',
  PREVENTIVA = 'preventiva',
  PREDITIVA = 'preditiva',
  PROGRAMADA = 'programada',
}

@Entity('manutencao')
export class Manutencao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ManutencaoType,
    default: ManutencaoType.CORRETIVA,
  })
  tipo: ManutencaoType;

  @Column()
  descricao: string;

  @Column()
  data: Date;

  @ManyToMany(() => Veiculo, (veiculo) => veiculo.id)
  veiculos: Veiculo[];
}
