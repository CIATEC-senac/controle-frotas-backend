import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Veiculo } from 'src/veiculo/entities/veiculo.entity'; 

@Entity('rota')
export class Rota {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false, default: 'default_name' }) 
  name: string;

  @Column({ default: true })
  status: boolean;

  @Column({ type: 'float', default: 0 })
  tempoTotal: number;

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

  @Column({ nullable: false })
  capacidade: number;

  @Column({ nullable: false })
  empresa: string;

  @ManyToOne(() => Veiculo, (veiculo) => veiculo.rotas, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'placa' }) 
  veiculo: Veiculo;

  @Column({ nullable: false })
  placa: string;

  @Column({ type: 'timestamp', nullable: true })
  horaInicial: Date;

  @Column({ type: 'timestamp', nullable: true })
  horaFinal: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async CapacidadeEmpresa() {
    if (this.veiculo) {
      this.capacidade = this.veiculo.capacidade;
      this.empresa = this.veiculo.empresa;
    }
  }
}
