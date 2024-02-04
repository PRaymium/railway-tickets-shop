import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LocomotiveService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.locomotive.findMany();
  }
}
