import { Veiculo } from "src/veiculo/entities/veiculo.entity";
import { Column, Entity, PrimaryGeneratedColumn,BeforeInsert, BeforeUpdate, OneToMany, ManyToMany } from "typeorm";


@Entity ('rota')
export class Rota {
    @PrimaryGeneratedColumn ()
    id: number;

    @Column({ default: true })
    status: boolean;

    @Column()
    empresa: string;

    @Column ()
    tempoTotal: number;

    @Column ()
    capacidade: number;

    @Column ()
    kmTotal: number; 

    @Column ()
    destino: string;

    @Column ()
    origem: string; 

    @Column ('text', { array: true, nullable: true })
    waypoints: string []; 

    @Column({ type: 'json', nullable: true })
    rotaJson: any; 

    @ManyToMany (()=> Veiculo, (veiculo)=> veiculo.placa)
    veiculos: Veiculo [];

    
  }


