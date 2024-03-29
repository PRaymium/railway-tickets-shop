import { Controller, Get } from '@nestjs/common';
import { LocomotiveService } from './locomotive.service';

@Controller('locomotive')
export class LocomotiveController {
  constructor(private locomotiveService: LocomotiveService) {}

  @Get()
  async getAll() {
    return this.locomotiveService.findAll();
  }
}
