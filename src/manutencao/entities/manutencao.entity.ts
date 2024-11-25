import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

export enum ManutencaoType {
    CORRETIVA = 'corretiva',
    PREVENTIVA = 'preventiva',
}
@Entity ('manutencao')
export class Manutencao {
    @PrimaryGeneratedColumn()
    id: number;

    @Column ({
        type: 'enum',
        enum: ManutencaoType,
        default: ManutencaoType.CORRETIVA,
    })
    tipo: ManutencaoType;

    @Column ()
    descricao: String;

    @Column ()
    placa: String;

    @Column ()
    data: Date;


    
}