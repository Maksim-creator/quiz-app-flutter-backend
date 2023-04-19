import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface RecentQuiz {
  topic: string;
  icon: string;
  donePercentage: number;
  id: string;
}

interface UserAttr {
  email: string;
  completedQuizzes: CompletedQuiz[];
  recentQuiz: RecentQuiz;
}

export interface CompletedQuiz {
  category: string;
  topic: string;
  donePercentage: number;
  questionsTotal: number;
  questionsAnswered: number;
}

@Table({ tableName: 'user' })
export class UserData extends Model<UserData, UserAttr> {
  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.JSON })
  completedQuizzes: CompletedQuiz[];

  @Column({ type: DataType.JSON })
  recentQuiz: RecentQuiz;
}
