import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainToCarriage } from './train_to_carriage.entity';

@Injectable()
export class TrainToCarriageService {
  constructor(
    @InjectRepository(TrainToCarriage)
    private trainToCarriageRepository: Repository<TrainToCarriage>,
  ) {}

  findAll(): Promise<TrainToCarriage[]> {
    return this.trainToCarriageRepository.find();
  }
}
