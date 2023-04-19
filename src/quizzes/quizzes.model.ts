import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface QuizzesCreationAttr {
  id: string;
  topic: string;
  icon: string;
  category: string;
  questions: Question[];
  selectedTimes: number;
  author: string;
}

export interface Question {
  id: string;
  question: string;
  description?: string;
  answers: Answers;
  multipleCorrectAnswers: boolean;
  correctAnswers: CorrectAnswers;
  explanation?: string;
  tip?: string;

  type: string;
  category: string;
  difficulty: string;
}

interface Answers {
  a: string;
  b: string;
  c?: string;
  d?: string;
}

interface CorrectAnswers {
  a: boolean;
  b: boolean;
  c?: boolean;
  d?: boolean;
}

@Table({ tableName: 'quizzes' })
export class Quiz extends Model<Quiz, QuizzesCreationAttr> {
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @Column({ type: DataType.STRING })
  category: string;

  @Column({ type: DataType.STRING })
  topic: string;

  @Column({ type: DataType.STRING })
  icon: string;

  @Column({ type: DataType.INTEGER })
  selectedTimes: number;

  @Column({ type: DataType.JSON })
  questions: Question[];

  @Column({ type: DataType.STRING })
  author: string;

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.STRING })
  tipLink: string;
}
