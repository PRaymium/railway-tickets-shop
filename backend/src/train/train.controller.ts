import { Controller, Get } from '@nestjs/common';
import { TrainService } from './train.service';
import { Train } from './train.entity';

@Controller('train')
export class TrainController {
  constructor(private trainService: TrainService) {}

  @Get()
  getAll(): Promise<Train[]> {
    return this.trainService.findAll();
  }
}
