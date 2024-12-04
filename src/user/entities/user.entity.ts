import { Column, Entity, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { Historico } from 'src/historico/entities/historico.entity';

export enum UserRole {
  MOTORISTA = 'motorista',
}

export enum UserType {
  FUNCIONARIO = 'funcionario',
  TERCEIROS = 'terceiros',
}

@Entity('usuario')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  matricula: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 11, unique: true })
  cpf: string;

  @Column({ length: 100, unique: true, nullable: true })
  email: string;

  @Column({ name: 'data_adm' })
  dataAdmissao: Date;

  @Column({ default: true })
  status: boolean;

  @Column({ length: 100 })
  obra: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MOTORISTA,
  })
  cargo: UserRole;

  @Column({ length: 20, unique: true })
  cnh: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.TERCEIROS,
  })
  tipo: UserType;

  @Column({ nullable: true })
  senha: string;

  @OneToMany(() => Historico, (historico) => historico.motorista)
  historicos: Historico[];
}
