import { Test, TestingModule } from '@nestjs/testing';

import { ProductsService } from './products.service';
import { CategoriesService } from '../categories/categories.service';
import { FilterProductsDto } from '../../dto/product.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, CategoriesService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Test the service getAll', () => {
    it('should return all the products', () => {
      const filters = new FilterProductsDto();
      const productsAll = service.getAll(filters);

      const newFilters = new FilterProductsDto();
      const productsFiltered = service.getAll(newFilters);

      expect(productsFiltered).toStrictEqual(productsAll);
    });

    it('should return the products with the filter price', () => {
      const filters = new FilterProductsDto();
      const productsAll = service.getAll(filters);

      const newFilters = new FilterProductsDto();
      newFilters.price = 10;
      const productsFiltered = service.getAll(newFilters);

      const result = productsAll.filter(
        (item) => item.price === newFilters.price,
      );

      expect(productsFiltered).toStrictEqual(result);
    });

    it('should return the products with the filters price_min and price_max', () => {
      const filters = new FilterProductsDto();
      const productsAll = service.getAll(filters);

      const newFilters = new FilterProductsDto();
      newFilters.price_min = 200;
      newFilters.price_max = 400;
      const productsFiltered = service.getAll(newFilters);

      const result = productsAll.filter(
        (item) =>
          item.price >= newFilters.price_min &&
          item.price <= newFilters.price_max,
      );

      expect(productsFiltered).toStrictEqual(result);
    });

    it('should return the products with the filters limit and offset', () => {
      const filters = new FilterProductsDto();
      const productsAll = service.getAll(filters);

      const newFilters = new FilterProductsDto();
      newFilters.limit = 20;
      newFilters.offset = 10;
      const productsFiltered = service.getAll(newFilters);

      const end = newFilters.offset + newFilters.limit;
      const result = productsAll.slice(newFilters.offset, end);

      expect(productsFiltered).toStrictEqual(result);
    });

    it('should delete product', () => {
      const idProductDelete = 1;
      const expectedData = { rta: true };

      const result = service.delete(idProductDelete);
      expect(result).toEqual(expectedData);
    });

    it('should throw product not found error', () => {
      const idProductDelete = 0;
      const messageException = 'Product not found';
      const exceptionExpected = new NotFoundException(messageException);
      const deleteMethod = () => service.delete(idProductDelete);

      expect(deleteMethod).toThrow(exceptionExpected);
    });
  });
});
