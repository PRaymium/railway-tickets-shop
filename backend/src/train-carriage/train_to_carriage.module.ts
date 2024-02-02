import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainToCarriage } from './train_to_carriage.entity';
import { TrainToCarriageController } from './train_to_carriage.controller';
import { TrainToCarriageService } from './train_to_carriage.service';

@Module({
  imports: [TypeOrmModule.forFeature([TrainToCarriage])],
  controllers: [TrainToCarriageController],
  providers: [TrainToCarriageService],
})
export class TrainToCarriageModule {}
