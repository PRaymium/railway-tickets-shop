import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Train } from './train.entity';

@Injectable()
export class TrainService {
  constructor(
    @InjectRepository(Train)
    private trainRepository: Repository<Train>,
  ) {}

  findAll(): Promise<Train[]> {
    return this.trainRepository.find();
  }
}
