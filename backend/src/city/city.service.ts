import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CityService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.city.findMany();
  }
}
