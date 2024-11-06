import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';  // Import axios
import { FirstExam, FirstExamDocument } from './first-exam.schema';
import { CreateFirstExamDto } from './dto/create-first-exam.dto';
import { UpdateFirstExamDto } from './dto/update-first-exam.dto';

@Injectable()
export class FirstExamService {
  constructor(
    @InjectModel('First Exam') private firstExamModel: Model<FirstExamDocument>,
  ) {}

  // Fetch the first question from the 'start-exam' API
  async fetchFirstQuestion(levels: { [key: string]: number }, topic: string) {
    try {
      const response = await axios.post('http://www.maeenmodelserver.site/start-exam', {
        levels,
        topic,
      });

      return response.data;  // Assuming this returns the question for the first exam
    } catch (error) {
      throw new Error('Error fetching the first question');
    }
  }

  // Fetch the next question from the 'nextQuestion' API
  async fetchNextQuestion(levels: { [key: string]: number }, topic: string, newTopic: string, time: number, userActivity: number, answer: boolean) {
    try {
      const response = await axios.post('http://www.maeenmodelserver.site/nextQuestion', {
        levels,
        topic,
        newTopic,
        time,
        userActivity,
        answer,
      });

      return response.data;  // Assuming this returns the next question
    } catch (error) {
      throw new Error('Error fetching the next question');
    }
  }

  // Create a new first exam, interacting with the APIs to get questions
  async create(createFirstExamDto: CreateFirstExamDto): Promise<FirstExam> {
    const { levels, topic: initialTopic } = createFirstExamDto;

    let allQuestions = [];

    // Fetch the first question
    let question = await this.fetchFirstQuestion(levels, initialTopic);
    allQuestions.push(question);
    const topic = initialTopic; // Define topic here to use later in the loop
    allQuestions.push(question);

    // Loop to fetch subsequent questions, 5 questions in total
    for (let i = 0; i < 4; i++) {
      const currentLevels = levels;  // Use updated levels as per your logic
      const newTopic = question.topic;  // Use the new topic after each question
      const time = 4;  // You can calculate the time dynamically if needed
      const userActivity = 5;  // User activity, adjust as per your logic
      const answer = true;  // Adjust this as per user response

      question = await this.fetchNextQuestion(currentLevels, topic, newTopic, time, userActivity, answer);
      allQuestions.push(question);
    }

    // Save the questions in the database
    const createdFirstExam = new this.firstExamModel({
      userId: createFirstExamDto.userId,
      questions: allQuestions,  // Store all fetched questions
    });

    return createdFirstExam.save();
  }

  // Get all first exams
  async findAll(): Promise<FirstExam[]> {
    return this.firstExamModel.find().exec();
  }

  // Get a specific first exam by ID
  async findOne(id: string): Promise<FirstExam> {
    return this.firstExamModel.findById(id).exec();
  }

  // Update an existing first exam
  async update(id: string, updateFirstExamDto: UpdateFirstExamDto): Promise<FirstExam> {
    return this.firstExamModel.findByIdAndUpdate(id, updateFirstExamDto, { new: true }).exec();
  }

  // Remove a first exam by ID
  async remove(id: string): Promise<FirstExam> {
    return this.firstExamModel.findByIdAndDelete(id).exec();
  }
}
