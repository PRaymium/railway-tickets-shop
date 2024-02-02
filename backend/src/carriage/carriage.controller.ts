import { Controller, Get } from '@nestjs/common';
import { CarriageService } from './carriage.service';
import { Carriage } from './carriage.entity';

@Controller('carriage')
export class CarriageController {
  constructor(private carriageService: CarriageService) {}

  @Get()
  getAll(): Promise<Carriage[]> {
    return this.carriageService.findAll();
  }
}
