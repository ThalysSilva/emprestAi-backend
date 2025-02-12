import { OmitDefaultData } from '@/utils/types';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Installment } from '@/@entities/loan';
import { InstallmentRepository } from '@/repositories/instalmentRepository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaInstallmentRepository implements InstallmentRepository {
  constructor(private prisma: PrismaService) {}

  setTransactionContext(context: Prisma.TransactionClient): void {
    this.prisma = context as PrismaService;
  }

  removeTransactionContext(): void {
    this.prisma = new PrismaService();
  }

  async createInstallment(
    data: OmitDefaultData<Installment>,
  ): Promise<Installment> {
    const installment = await this.prisma.installment.create({ data });

    return installment as Installment;
  }

  async createInstallments(
    data: OmitDefaultData<Installment>[],
  ): Promise<Prisma.BatchPayload> {
    const qtyCreated = await this.prisma.installment.createMany({ data });

    return qtyCreated;
  }

  async getInstallmentById(id: string): Promise<Installment> {
    const installment = await this.prisma.installment.findUnique({
      where: { id },
    });

    return installment as Installment;
  }

  async getInstallmentsByLoanId(loanId: string): Promise<Installment[]> {
    const installments = await this.prisma.installment.findMany({
      where: { loanId },
      orderBy: { dueDate: 'asc' },
    });

    return installments as Installment[];
  }

  async updateInstallment(
    id: string,
    data: OmitDefaultData<Installment>,
  ): Promise<Installment> {
    const updatedInstallment = await this.prisma.installment.update({
      where: { id },
      data,
    });

    return updatedInstallment as Installment;
  }

  async deleteInstallment(id: string): Promise<void> {
    await this.prisma.installment.delete({ where: { id } });
  }

  async getAllInstallments(): Promise<Installment[]> {
    const installments = await this.prisma.installment.findMany();

    return installments as Installment[];
  }
}
