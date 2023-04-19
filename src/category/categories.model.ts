import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface CategoryCreationAttr {
  category: string;
  icon: string;
}

@Table({ tableName: 'categories' })
export class Category extends Model<Category, CategoryCreationAttr> {
  @Column({ type: DataType.STRING })
  category: string;

  @Column({ type: DataType.STRING })
  icon: string;

  @Column({ type: DataType.INTEGER })
  selectedTimes: number;

  @Column({ type: DataType.INTEGER })
  quizzesCount: number;

  @Column({ type: DataType.STRING })
  color: string;
}
