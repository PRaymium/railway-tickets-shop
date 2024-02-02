import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Locomotive } from './locomotive.entity';

@Injectable()
export class LocomotiveService {
  constructor(
    @InjectRepository(Locomotive)
    private locomotiveRepository: Repository<Locomotive>,
  ) {}

  findAll(): Promise<Locomotive[]> {
    return this.locomotiveRepository.find();
  }
}
