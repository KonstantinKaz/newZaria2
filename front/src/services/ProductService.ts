import $api from '../http';
import { ICreateProductDto } from '../models/product/CreateProductDto';
import { IProduct } from '../models/product/Product';

export default class ProductService {
  static async getAll(): Promise<IProduct[]> {
    const response = await $api.get('/products');
    return response.data;
  }

  static async create(productData: ICreateProductDto): Promise<IProduct> {
    const response = await $api.post('/products', productData);
    return response.data;
  }

  static async createFormData(formData: FormData): Promise<IProduct> {
    const response = await $api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async update(id: number, productData: Partial<ICreateProductDto>): Promise<IProduct> {
    const response = await $api.put(`/products/${id}`, productData);
    return response.data;
  }

  static async remove(id: number): Promise<void> {
    await $api.delete(`/products/${id}`);
  }

  static async getAllByCategory(categoryId: number): Promise<{ products: IProduct[], total: number }> {
    const response = await $api.get('/products', {
      params: {
        categoryId,
      },
    });
    return response.data;
  }
}