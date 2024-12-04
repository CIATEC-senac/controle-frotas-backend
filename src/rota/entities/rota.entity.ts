import { User } from 'src/user/entities/user.entity';
import { Veiculo } from 'src/veiculo/entities/veiculo.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

type Coordenadas = {
  lat: number;
  lng: number;
};

@Entity('rota')
export class Rota {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  tempoTotal: number;

  @Column({ type: 'float', default: 0 })
  kmTotal: number;

  @Column('json', { nullable: false })
  trajeto: {
    origem: string;
    destino: string;
    paradas: string[];
  };

  @Column('json', { nullable: true })
  trajetoCoordenadas: {
    origem: Coordenadas;
    destino: Coordenadas;
    paradas: Coordenadas[];
  };

  @ManyToOne(() => Veiculo)
  @JoinColumn()
  veiculo: Veiculo;

  @ManyToOne(() => User)
  @JoinColumn()
  motorista?: User;
}
