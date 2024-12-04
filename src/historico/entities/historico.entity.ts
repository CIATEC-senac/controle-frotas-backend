import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Rota } from 'src/rota/entities/rota.entity';
import { User } from 'src/user/entities/user.entity';

// Definir o enum para os status
export enum StatusHistorico {
  EM_ANALISE = 'em_analise',
  APROVADO = 'aprovado',
  REPROVADO = 'reprovado',
}

@Entity('historico')
export class Historico {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, onDelete: 'SET NULL' }) 
  @JoinColumn({ name: 'motoristaId' }) 
  motorista: User; 

  @Column({ nullable: true })
  motoristaNome: string; 

  @Column()
  kmInicial: number;

  @Column()
  kmFinal: number;

  @Column({ type: 'timestamp' })
  horaInicio: Date;

  @Column({ type: 'timestamp' })
  horaFinal: Date;

  @Column()
  fotoInicio: string;

  @Column()
  fotoFinal: string;

  @Column()
  origem: string;

  @Column()
  destino: string;

  @Column({ type: 'json', nullable: true, select: false }) 
  waypoints: string[];

  @ManyToOne(() => Rota, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rotaId' })
  rota: Rota;

  @Column({
    type: 'enum',
    enum: StatusHistorico,
    default: StatusHistorico.EM_ANALISE, 
  })
  status: StatusHistorico;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ nullable: true })
  capacidade: number;

  @Column({ nullable: true })
  placa: string;

  @Column({ nullable: true })
  empresa: string;

  @Column({ nullable: true })
  tempoTotal: number;

  @Column({ nullable: true })
  kmTotal: number;

  @Column({ nullable: true, type: 'boolean', default: false }) 
  paradaNaoProgramada: boolean; 

  @Column({ nullable: true, type: 'text', select: false }) 
  descricaoParadaNaoProgramada: string; 
}

