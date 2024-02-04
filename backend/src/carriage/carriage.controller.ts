import { Controller, Get } from '@nestjs/common';
import { CarriageService } from './carriage.service';

@Controller('carriage')
export class CarriageController {
  constructor(private carriageService: CarriageService) {}

  @Get()
  getAll() {
    return this.carriageService.findAll();
  }
}
