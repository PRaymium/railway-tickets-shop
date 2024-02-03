import { Controller, Get } from '@nestjs/common';
import { TrainToCarriageService } from './train_to_carriage.service';
import { TrainToCarriage } from './train_to_carriage.entity';

@Controller('train_to_carriage')
export class TrainToCarriageController {
  constructor(private trainToCarriageService: TrainToCarriageService) {}

  @Get()
  getAll(): Promise<TrainToCarriage[]> {
    return this.trainToCarriageService.findAll();
  }
}
