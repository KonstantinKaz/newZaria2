import $api from '../http';
import { ICategory } from '../models/product/ICategory';
import { ICreateCategoryDto } from '../models/product/ICreateCategoryDto';

export default class CategoryService {
  static async getAll(): Promise<ICategory[]> {
    const response = await $api.get("/categories");
    return Array.isArray(response.data) ? response.data : [];
  }

  static async create(categoryData: ICreateCategoryDto): Promise<ICategory> {
    const response = await $api.post('/categories', categoryData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  }
}
