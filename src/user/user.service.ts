import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}
  

  findAll(): Promise<User[]> {
    return this.repository.find();
  }


  async seed() {
    console.log('seed começo');
    const users = [
      { name: 'João Silva', cpf: '12345678900', email: 'joao@blavbla.com' },
      
    ];
  }

  findOne(cpf: string): Promise<User | null> {
    return this.repository.findOneBy({ cpf });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  create(user: User): Promise<InsertResult> {
    return this.repository.insert(user);
  }

  update(user: User) {
    return this.repository.update(
      {
        id: user.id,
      },
      user,
    );
  }

}




