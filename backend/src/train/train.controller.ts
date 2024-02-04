import { Controller, Get } from '@nestjs/common';
import { TrainService } from './train.service';

@Controller('train')
export class TrainController {
  constructor(private trainService: TrainService) {}

  @Get()
  getAll() {
    return this.trainService.findAll();
  }
}
