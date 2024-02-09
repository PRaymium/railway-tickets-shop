import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LocomotiveService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.locomotive.findMany();
  }
}
