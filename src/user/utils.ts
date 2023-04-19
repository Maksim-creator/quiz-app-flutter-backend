import { CompletedQuiz } from './user.model';
import {
  countBy,
  entries,
  flow,
  forEach,
  head,
  last,
  maxBy,
  partialRight,
  uniqBy,
} from 'lodash';

export const getFavoriteTopic = (completedQuizzes: CompletedQuiz[]) => {
  const array = [];
  for (let i = 0; i < completedQuizzes.length; i++) {
    array.push(completedQuizzes[i].topic);
  }

  return flow(countBy, entries, partialRight(maxBy, last), head)(array);
};

export const getAverageCompletion = (completedQuizzes: CompletedQuiz[]) => {
  return Math.floor(
    completedQuizzes
      .map((item) => item.donePercentage)
      .reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0,
      ) / completedQuizzes.length,
  );
};

export const getQuizWon = (completedQuizzes: CompletedQuiz[]): number => {
  return completedQuizzes.map((item) => item.donePercentage >= 76).length;
};

export const getChartData = (completedQuizzes: CompletedQuiz[]) => {
  const categories: {
    category: string;
    averageTotalQuestions?: number[];
    averageAnsweredQuestions?: number[];
    averageDonePercentage?: number[];
  }[] = [];
  // let donePercentage;

  completedQuizzes.forEach((value) => {
    if (categories.length === 0) {
      categories.push({ category: value.category });
    } else {
      categories.forEach((item) => {
        if (item.category !== value.category) {
          categories.push({ category: value.category });
        }
      });
    }
  });

  categories.forEach((item, index) => {
    const updatedCategory = {
      ...item,
      averageTotalQuestions: [],
      averageAnsweredQuestions: [],
      averageDonePercentage: [],
    };
    completedQuizzes.forEach((value) => {
      if (item.category === value.category) {
        updatedCategory.averageTotalQuestions.push(value.questionsTotal);
        updatedCategory.averageAnsweredQuestions.push(value.questionsAnswered);
        updatedCategory.averageDonePercentage.push(value.donePercentage);
      }
    });

    categories[index] = updatedCategory;
  });

  return uniqBy(
    categories.map((item) => ({
      category: item.category,
      color: Math.floor(Math.random() * 16777215).toString(16),
      averageTotalQuestions: (
        item.averageTotalQuestions.reduce((prev, curr) => prev + curr, 0) /
        item.averageTotalQuestions.length
      ).toFixed(0),
      averageAnsweredQuestions: (
        item.averageAnsweredQuestions.reduce((prev, curr) => prev + curr, 0) /
        item.averageAnsweredQuestions.length
      ).toFixed(0),
      averageDonePercentage: (
        item.averageDonePercentage.reduce((prev, curr) => prev + curr, 0) /
        item.averageDonePercentage.length
      ).toFixed(0),
    })),
    'category',
  );
};

export const getTotalPlayedQuizzes = (completedQuizzes: CompletedQuiz[]) => {
  const totalCompletedTopics = [];

  forEach(completedQuizzes, (item) => {
    !totalCompletedTopics.includes(item.topic) &&
      totalCompletedTopics.push(item.topic);
  });

  return totalCompletedTopics.length;
};
