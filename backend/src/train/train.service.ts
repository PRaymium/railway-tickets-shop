import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TrainService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.train.findMany();
  }
}
