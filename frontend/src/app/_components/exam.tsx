import React, { useState } from 'react';

// Define the option and question interfaces
interface Option {
    id: number;
    text: string;
    correct: boolean;
}

interface Question {
    id: number;
    question: string;
    options: Option[];
}

// Props for the Exam component
interface ExamProps {
    questions: Question[]; // Changed from 'any' to 'Question[]' for better type safety
    showCorrectAnswer: boolean;
    onComplete: (answer: string) => void;  // Pass the final score as a string
}

const Exam: React.FC<ExamProps> = ({ questions, showCorrectAnswer = true, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionClick = (option: Option) => {
        setSelectedOption(option.id);
        if (option.correct) {
            setScore((prevScore) => prevScore + 1);
        }

        // Move to the next question after a delay to show feedback
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                setSelectedOption(null);
            } else {
                // Pass the final score as a string to the parent
                onComplete((score + (option.correct ? 1 : 0)).toString());
            }
        }, 1000);
    };

    return (
        <div className="flex flex-col justify-center items-center font-sans p-7 bg-gray-50 rounded-md shadow-lg mx-auto" dir="rtl">
            <h2 className="mb-4 text-2xl font-medium text-center text-primary">
                {currentQuestion.question}
            </h2>
            <div className="flex flex-col gap-3 w-full">
                {currentQuestion.options.map((option: Option) => (
                    <button
                        key={option.id}
                        className={`flex justify-between font-bold items-center px-4 py-3 text-md rounded-lg transition-colors
                          ${
                            selectedOption === option.id
                              ? showCorrectAnswer
                                ? option.correct
                                  ? 'bg-green-100 text-green-800 border border-green-300'
                                  : 'bg-red-100 text-red-800 border border-red-300'
                                : 'bg-gray-200 text-gray-800'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        onClick={() => handleOptionClick(option)}
                        disabled={selectedOption !== null} // Disable after selection
                    >
                        {option.text}
                        {selectedOption === option.id && showCorrectAnswer && (
                            <span className={`${option.correct ? 'text-green-500' : 'text-red-500'} ml-2`}>
                                ●
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Exam;