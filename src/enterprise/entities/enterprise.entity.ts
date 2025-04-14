import { User } from 'src/user/entities/user.entity';
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('enterprise')
export class Enterprise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.enterprise)
  vehicles: Vehicle[];

  @OneToMany(() => User, (user) => user.enterprise)
  users: User[];
}
