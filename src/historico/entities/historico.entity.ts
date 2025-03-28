import { Rota } from 'src/rota/entities/rota.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type Coordenada = {
  latitude: number;
  longitude: number;
};

@Entity('historico')
export class Historico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  odometroIncial: number;

  @Column({ type: 'int' })
  odometroFinal: number;

  @Column({ type: 'varchar', length: 250 })
  observacao: string;

  @Column({ type: 'boolean' })
  status: boolean;

  @Column({ type: 'decimal' })
  kmConcluido: number;

  @Column({ type: 'varchar', nullable: true })
  odometroInicialImg: string;

  @Column({ type: 'varchar', nullable: true })
  odometroFinalImg: string;

  @Column('json', { nullable: true })
  trajetoCoordenadas: {
    origem: Coordenada;
    destino: Coordenada;
    paradas: Coordenada[];
  };

  @Column('json', { nullable: false })
  trajeto: {
    origem: string;
    destino: string;
    paradas: string[];
  };

  @CreateDateColumn({ type: 'timestamp' })
  data: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  StatusAtualização: Date;

  @ManyToOne(() => Rota, (rota) => rota.id, { nullable: true })
  rota: Rota;
}
