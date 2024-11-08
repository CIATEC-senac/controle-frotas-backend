import {Column, Entity, PrimaryColumn} from 'typeorm';
 

export enum VeiculoType {
    CAR = 'Carro',
    VAN = 'Van',
    BUS = 'Ônibus',
    MINIBUS = 'MiniOnibus',
  }
  

@Entity ('Veiculo')
export class Veiculo {
    @PrimaryColumn({ length: 7 }) 
    placa: string;

    @Column ({
        type: 'enum',
        enum: VeiculoType,
        default: VeiculoType.BUS,
    })
    modelo: VeiculoType;

    @Column ({length: 100})
    empresa: string;

    @Column ({default: true})
    status: boolean;

    @Column ({length: 3})
    capacidade: Number;

    @Column ({length: 4})
    ano: Number;

    @Column({ length: 100 })
    obra: string;

    
}