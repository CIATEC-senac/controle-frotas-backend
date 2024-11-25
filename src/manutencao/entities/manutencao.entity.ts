import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Veiculo } from 'src/veiculo/entities/veiculo.entity';

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

     
  @ManyToOne(() => Veiculo, veiculo => veiculo.manutencoes, {
    eager: true, 
    nullable: false, 
  })
  veiculo: Veiculo; 
  }
  