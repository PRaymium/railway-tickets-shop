import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carriage } from './carriage.entity';

@Injectable()
export class CarriageService {
  constructor(
    @InjectRepository(Carriage)
    private carriageRepository: Repository<Carriage>,
  ) {}

  findAll(): Promise<Carriage[]> {
    return this.carriageRepository.find();
  }
}
