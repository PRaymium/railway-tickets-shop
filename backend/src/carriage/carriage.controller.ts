import { Controller, Get } from '@nestjs/common';
import { CarriageService } from './carriage.service';

@Controller('carriage')
export class CarriageController {
  constructor(private carriageService: CarriageService) {}

  @Get()
  async getAll() {
    return this.carriageService.findAll();
  }

  @Get('withFreePlacesInfo')
  async getWithFreePlacesInfo() {
    return this.carriageService.findManyWithFreePlacesInfoByTrainId(1);
  }
}
