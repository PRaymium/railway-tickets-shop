import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CarriageService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.carriage.findMany();
  }
}
