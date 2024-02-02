import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carriage } from './carriage.entity';
import { CarriageService } from './carriage.service';
import { CarriageController } from './carriage.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Carriage])],
  providers: [CarriageService],
  controllers: [CarriageController],
})
export class CarriageModule {}
