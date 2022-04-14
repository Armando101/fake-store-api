import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from '../../services/categories/categories.service';
import { ProductsService } from '../../services/products/products.service';
import { DataSetModule } from '@app/data-set';
import { FilterProductsDto } from '../../dto/product.dto';
import { Category } from 'src/models/category.model';
import { Product } from 'src/models/product.model';

describe(`Inspect ${CategoriesController.name} class`, () => {
  let controller: CategoriesController;
  let categoriesService: CategoriesService;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DataSetModule],
      controllers: [CategoriesController],
      providers: [CategoriesService, ProductsService],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    productsService = module.get<ProductsService>(ProductsService);
    controller = module.get<CategoriesController>(CategoriesController);
  });

  it(`creates ${CategoriesController.name} should be defined`, () => {
    expect(controller).toBeDefined();
  });
  it(`Get all categories`, () => {
    const result: Category[] = [
      {
        id: 1,
        name: 'Laptops',
        image: 'HP one station',
        keyLoremSpace: 'random',
      },
    ];
    jest.spyOn(categoriesService, 'getAll').mockReturnValueOnce(result);
    const actual = controller.getAll({});
    expect(actual).toStrictEqual(result);
  });
  it(`Create a new category`, () => {
    const body = { name: 'bears', image: 'Yogi the bear' };
    const result: Category = {
      id: 1,
      name: 'bears',
      image: 'Yogi the bear',
      keyLoremSpace: 'random',
    };
    const mock = jest
      .spyOn(categoriesService, 'create')
      .mockReturnValueOnce(result);
    const mockInput = [body];
    const actual = controller.create(body);
    expect(actual).toStrictEqual(result);
    expect(mock).toHaveBeenCalledWith(...mockInput);
  });
  it(`Fail when create a new category`, () => {
    const body = { name: 'bears', image: 'Yogi the bear' };
    const mock = jest
      .spyOn(categoriesService, 'create')
      .mockImplementationOnce(() => {
        throw new Error('MOCK ERROR');
      });
    const mockInput = [body];
    expect(() => controller.create(body)).toThrow(/MOCK ERROR/gm);
    expect(mock).toHaveBeenCalledWith(...mockInput);
  });
  it(`Get a category with its products`, () => {
    const filter: FilterProductsDto = {
      limit: 1,
      offset: 0,
    } as unknown as FilterProductsDto;
    const result: Product[] = [
      {
        id: 1,
        title: 'The Title',
        price: 310,
        description: 'The Description',
        category: {
          id: 1,
          name: 'Others',
          image: 'animals',
          keyLoremSpace: 'random',
        },
        images: ['image1', 'image2', 'image3'],
      },
    ];
    const mock = jest
      .spyOn(productsService, 'byCategory')
      .mockReturnValueOnce(result);
    const mockInput = [1, filter];
    const actual = controller.getProductsByCategory(1, filter);
    expect(actual).toStrictEqual(result);
    expect(mock).toHaveBeenCalledWith(...mockInput);
  });
});
