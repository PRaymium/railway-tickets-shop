import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SeatService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.seat.findMany();
  }
}
