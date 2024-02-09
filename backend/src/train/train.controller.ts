import { Controller, Get } from '@nestjs/common';
import { TrainService } from './train.service';

@Controller('train')
export class TrainController {
  constructor(private trainService: TrainService) {}

  @Get()
  async getAll() {
    return this.trainService.findAll();
  }
}
