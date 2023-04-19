import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './categories.model';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private categoriesRepository: typeof Category,
  ) {}

  async getAvailableCategories() {
    return await this.categoriesRepository.findAll();
  }

  async createCategory(body: {
    category: string;
    icon: string;
    color: string;
  }) {
    const newCategory = {
      category: body.category,
      icon: body.icon,
      color: body.color,
      selectedTimes: 0,
      quizzesCount: 0,
    };
    await this.categoriesRepository.create(newCategory);
    return newCategory;
  }

  async updateQuizzesCount(category: string) {
    const item = await this.categoriesRepository.findOne({
      where: { category },
    });

    return await this.categoriesRepository.update(
      { quizzesCount: item.quizzesCount + 1 },
      { where: { category } },
    );
  }
}
