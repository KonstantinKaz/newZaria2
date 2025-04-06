import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    searchTerm?: string,
    categoryId?: number,
    offset?: number,
    limit?: number,
  ) {
    const where: any = {};

    if (searchTerm) {
      where.title = {
        contains: searchTerm,
        mode: 'insensitive',
      };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: offset || 0,
        take: limit || 9,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
    };
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async create(createProductDto: CreateProductDto, file?: Express.Multer.File) {
    let imagesArray: string[] = [];

    if (file) {
      const ext = path.extname(file.originalname);
      const fileName = `${Date.now()}${ext}`;
      const filePath = path.join(__dirname, '../../../uploads', fileName);

      fs.writeFileSync(filePath, file.buffer);

      imagesArray.push(`/uploads/${fileName}`);
    }

    if (createProductDto.images && createProductDto.images.length > 0) {
      imagesArray = [...imagesArray, ...createProductDto.images];
    }

    return this.prisma.product.create({
      data: {
        title: createProductDto.title,
        price: createProductDto.price,
        description: createProductDto.description,
        quantity: createProductDto.quantity,
        rating: 0,
        images: imagesArray,
        category: {
          connect: { id: createProductDto.categoryId },
        },
      },
      include: {
        category: true,
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.product.delete({
      where: { id },
    });
    return true;
  }
}
