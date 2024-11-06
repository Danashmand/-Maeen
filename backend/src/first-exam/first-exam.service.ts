import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateFirstExamDto } from './dto/create-first-exam.dto';
import { UpdateFirstExamDto } from './dto/update-first-exam.dto';

@Injectable()
export class FirstExamService {
  private readonly baseUrl = 'http://www.maeenmodelserver.site';

  // Function to get the first question
  private async getFirstQuestion(levels: object, topic: string) {
    const response = await axios.post(`${this.baseUrl}/start-exam`, {
      levels,
      topic,
    });
    return response.data;
  }

  // Function to get the next question
  private async getNextQuestion(levels: object, topic: string, newTopic: string, time: number, userActivity: number, answer: boolean) {
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

    // Step 1: Get the first question
    let firstQuestion = await this.getFirstQuestion(levels, topic);
    questions.push(firstQuestion.question);

    // Step 2: Get the next four questions
    let currentLevels = firstQuestion.levels; // Updated levels after the first question
    let currentTopic = firstQuestion.topic;
    let newTopic = currentTopic;
    let time = 4; // Example static time, adjust as needed
    let userActivity = 5; // Example static user activity, adjust as needed
    let answer = true; // Example answer, this should be dynamic

    for (let i = 1; i < 5; i++) {
      let nextQuestion = await this.getNextQuestion(currentLevels, currentTopic, newTopic, time, userActivity, answer);
      questions.push(nextQuestion.question);

      // Update levels and topics after each question
      currentLevels = nextQuestion.levels;
      currentTopic = nextQuestion.topic;
      newTopic = currentTopic; // Assuming newTopic is updated based on the question
    }

    // Step 3: Save the exam with all 5 questions
    return {
      userId: createFirstExamDto.userId,
      levels,
      topic,
      questions,
    };
  }

  // Other CRUD functions (findAll, findOne, update, remove) can be kept as is.
  findAll() {
    return `This action returns all firstExam`;
  }

  findOne(id: number) {
    return `This action returns a #${id} firstExam`;
  }

  update(id: number, updateFirstExamDto: UpdateFirstExamDto) {
    return `This action updates a #${id} firstExam`;
  }

  remove(id: number) {
    return `This action removes a #${id} firstExam`;
  }
}
