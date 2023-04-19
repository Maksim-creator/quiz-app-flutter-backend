import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}
  @Get()
  getCategories() {
    return this.categoriesService.getAvailableCategories();
  }
  @Post()
  createCategory(
    @Body() body: { category: string; icon: string; color: string },
  ) {
    return this.categoriesService.createCategory(body);
  }

  @Post()
  updateQuizzesCount(@Body() body: { category: string }) {
    return this.categoriesService.updateQuizzesCount(body.category);
  }
}
