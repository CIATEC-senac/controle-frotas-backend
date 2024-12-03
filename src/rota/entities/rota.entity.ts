import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Veiculo } from 'src/veiculo/entities/veiculo.entity'; // Importando a entidade Veiculo

@Entity('rota')
export class Rota {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  status: boolean;

  @Column()
  empresa: string;

  @Column()
  tempoTotal: number;

  @Column()
  capacidade: number;

  @Column()
  kmTotal: number;

  @Column()
  destino: string;

  @Column()
  origem: string;

  @Column('text', { array: true, nullable: true })
  waypoints: string[];

  @Column({ type: 'json', nullable: true })
  rotaJson: any;

  @ManyToOne(() => Veiculo, (veiculo) => veiculo.rotas)
  @JoinColumn({ name: 'placa' }) 
  veiculo: Veiculo;

  @Column({ nullable: false })
  placa: string;
}
