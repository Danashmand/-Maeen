import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateFirstExamDto } from './dto/create-first-exam.dto';

@Injectable()
export class FirstExamService {
  private readonly baseUrl = 'http://www.maeenmodelserver.site';

  // Function to get the first question
   async getFirstQuestion(levels: object, topic: string) {
    const response = await axios.post(`${this.baseUrl}/start-exam`, {
      levels,
      topic,
    });
    return response.data;
  }

  // Function to get the next question
   async getNextQuestion(levels: object, topic: string, newTopic: string, time: number, userActivity: number, answer: boolean) {
    const response = await axios.post(`${this.baseUrl}/nextQuestion`, {
      levels,
      topic,
      newTopic,
      time,
      userActivity,
      answer,
    });
    return response.data;
  }

  // Main function to start the exam
  async create(createFirstExamDto: CreateFirstExamDto) {
    const { levels, topic } = createFirstExamDto;
    const questions: string[] = [];

    // Get first question
    let firstQuestion = await this.getFirstQuestion(levels, topic);
    questions.push(firstQuestion.question);

    let currentLevels = firstQuestion.levels;
    let currentTopic = firstQuestion.topic;
    let newTopic = currentTopic;

    // Get next questions
    for (let i = 1; i < 5; i++) {
      let nextQuestion = await this.getNextQuestion(currentLevels, currentTopic, newTopic, 4, 5, true);
      questions.push(nextQuestion.question);
      currentLevels = nextQuestion.levels;
      currentTopic = nextQuestion.topic;
    }

    return {
      userId: createFirstExamDto.userId,
      questions,
    };
  }
}
