import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import { Veiculo } from 'src/veiculo/entities/veiculo.entity'; 
import { Historico } from 'src/historico/entities/historico.entity';

@Entity('rota')
export class Rota {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false, default: 'default_name' }) 
  name: string;

  @Column({ default: true })
  status: boolean;

  @Column({ nullable: false })
  empresa: string;

  @Column({ type: 'float', default: 0 })
  tempoTotal: number;

  @Column()
  capacidade: number;

  @Column({ type: 'float', default: 0 })
  kmTotal: number;

  @Column({ nullable: false })
  destino: string;

  @Column({ nullable: false })
  origem: string;

  @Column('json', { nullable: true })
  waypoints: { latitude: number; longitude: number }[];


  @Column({ type: 'json', nullable: true })
  rotaJson: any;

  @ManyToOne(() => Veiculo, (veiculo) => veiculo.rotas, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'placa' }) 
  veiculo: Veiculo;

  @Column({ nullable: false })
  placa: string;

  
 
}
