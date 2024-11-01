import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  MOTORISTA = 'motorista',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  matricula: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 11, unique: true })
  cpf: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column()
  dataAdmissao: Date;

  @Column({ default: true })
  status: boolean;

  @Column({ length: 100 })
  obra: string;

  @Column()
  funcao: number;

  @Column({ length: 20, unique: true })
  cnh: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MOTORISTA,
  })
  tipo: UserRole;

  @Column({ nullable: true })
  senha: string;
}
