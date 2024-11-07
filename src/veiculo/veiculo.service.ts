import { Injectable } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Veiculo } from './entities/veiculo.entity';

@Injectable()
export class VeiculoService {
    constructor (
        @InjectRepository (Veiculo)
        private repository: Repository<Veiculo>,
    ){}

    async delete(placa: string): Promise<void> {
        await this.repository.delete({ placa });
    }
    
    findAll(): Promise<Veiculo []> {
        return this,this.repository.find();
    }

    findOne(placa: string): Promise<Veiculo | null>{
        return this.repository.findOneBy({placa});
    }

    create(veiculo: Veiculo): Promise<InsertResult>{
        return this.repository. insert (veiculo);
    }

    update (veiculo: Veiculo){
        return this.repository. update(
            {
                placa: veiculo.placa,
            },
            veiculo,
        );
    }

 


}
