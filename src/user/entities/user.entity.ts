import { Enterprise } from 'src/enterprise/entities/enterprise.entity';
import { Route } from 'src/route/entities/route.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 0,
  MANAGER = 1,
  DRIVER = 2,
}

export enum UserSource {
  INSOURCED = 0,
  OUTSOURCED = 1,
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  registry: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 11, unique: true })
  cpf: string;

  @Column({ length: 100, unique: true, nullable: true })
  email: string;

  @Column({ type: 'date', nullable: true })
  admittedAt: Date;

  @Column({ default: true })
  status: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.DRIVER })
  role: UserRole;

  @Column({ length: 20, unique: true })
  cnh: string;

  @Column({ type: 'enum', enum: UserSource, default: UserSource.OUTSOURCED })
  source: UserSource;

  @Column({ nullable: true })
  password: string;

  @ManyToOne(() => Enterprise, (enterprise) => enterprise.id)
  enterprise: Enterprise;

  @OneToMany(() => Route, (route) => route.driver)
  routes: Route[];
}
