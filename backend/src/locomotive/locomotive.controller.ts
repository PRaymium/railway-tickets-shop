import { Controller, Get } from '@nestjs/common';
import { LocomotiveService } from './locomotive.service';
import { Locomotive } from './locomotive.entity';

@Controller('locomotive')
export class LocomotiveController {
  constructor(private locomotiveService: LocomotiveService) {}

  @Get()
  getAll(): Promise<Locomotive[]> {
    return this.locomotiveService.findAll();
  }
}
