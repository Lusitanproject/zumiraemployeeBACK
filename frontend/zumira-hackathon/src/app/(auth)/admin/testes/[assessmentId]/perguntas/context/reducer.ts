import { v4 } from "uuid";
import { ManageQuestion, ManageQuestionChoice } from "../definitions";
import { ManageQuestionAction, ManageQuestionState } from "./types";

export function reducer(state: ManageQuestionState, action: ManageQuestionAction): ManageQuestionState {
  switch (action.type) {
    case "ADD-QUESTION": {
      const empty: ManageQuestion = {
        key: v4(),
        assessmentQuestionChoices: [
          {
            key: v4(),
            index: 0,
            label: "",
            value: 0,
          },
        ],
        description: "",
        index: state.questions.length,
        psychologicalDimensionId: "",
      };
      return { questions: [...state.questions, empty] };
    }
    case "REMOVE-QUESTION": {
      const questions = state.questions.filter((item) => item.key !== action.payload);
      return { questions };
    }
    case "MOVE-QUESTION-UP": {
      const item = state.questions.find((item) => item.key === action.payload);

      if (!item) return state;
      if (item.index === 0) return state;

      const itemIndex = item.index;

      const questions = state.questions.map((item) => {
        if (item.key === action.payload) {
          return { ...item, index: itemIndex - 1 };
        }

        if (item.index === itemIndex - 1 && item.key !== action.payload) {
          return { ...item, index: itemIndex };
        }

        return item;
      });

      return { questions };
    }

    case "MOVE-QUESTION-DOWN": {
      const item = state.questions.find((item) => item.key === action.payload);

      if (!item) return state;
      if (item.index >= state.questions.length - 1) return state;

      const itemIndex = item.index;

      const questions = state.questions.map((item) => {
        if (item.key === action.payload) {
          return { ...item, index: itemIndex + 1 };
        }

        if (item.index === itemIndex + 1 && item.key !== action.payload) {
          return { ...item, index: itemIndex };
        }

        return item;
      });

      return { questions };
    }

    case "SET-DESCRIPTION": {
      const questions = state.questions.map((question) => {
        if (question.key === action.payload.key) {
          return { ...question, description: action.payload.value };
        }
        return question;
      });

      return { questions };
    }

    case "SET-DIMENSION": {
      const questions = state.questions.map((question) => {
        if (question.key === action.payload.key) {
          return { ...question, psychologicalDimensionId: action.payload.value };
        }
        return question;
      });

      return { questions };
    }

    case "DUPLICATE": {
      const item = state.questions.find((item) => item.key === action.payload);
      if (!item) return state;

      const empty: ManageQuestion = {
        key: v4(),
        assessmentQuestionChoices: item.assessmentQuestionChoices.map((choice) => ({
          ...choice,
          id: undefined,
          key: v4(),
        })),
        description: item.description,
        index: state.questions.length,
        psychologicalDimensionId: item.psychologicalDimensionId,
      };
      return { questions: [...state.questions, empty] };
    }

    case "ADD-CHOICE": {
      const questions = [...state.questions];

      const question = questions.find((item) => item.key === action.payload.questionKey);
      if (!question) {
        return { questions };
      }

      // Descobrir a ordem dos valores para escolher o próximo de forma conveniente
      let newValue;
      if (question.assessmentQuestionChoices.length > 1) {
        const lastValue = question.assessmentQuestionChoices[question.assessmentQuestionChoices.length - 1].value;
        const secondLastValue = question.assessmentQuestionChoices[question.assessmentQuestionChoices.length - 2].value;
        if (lastValue > secondLastValue) {
          newValue = lastValue + 1;
        } else {
          newValue = lastValue - 1;
        }
      } else if (question.assessmentQuestionChoices.length === 1) {
        newValue = question.assessmentQuestionChoices[0].value + 1;
      } else {
        newValue = 1;
      }

      const empty: ManageQuestionChoice = {
        key: v4(),
        index: question.assessmentQuestionChoices.length,
        label: "",
        value: newValue,
      };

      question.assessmentQuestionChoices = [...question.assessmentQuestionChoices, empty];

      return { questions };
    }

    case "REMOVE-CHOICE": {
      const question = state.questions.find((item) => item.key === action.payload.questionKey);
      if (!question) {
        return { questions: state.questions };
      }

      question.assessmentQuestionChoices = question.assessmentQuestionChoices.filter(
        (c) => c.key !== action.payload.choiceKey,
      );

      return { questions: state.questions };
    }

    case "SET-CHOICE-LABEL": {
      const questions = state.questions.map((question) => {
        if (question.key === action.payload.questionKey) {
          return {
            ...question,
            assessmentQuestionChoices: question.assessmentQuestionChoices.map((choice) => {
              if (choice.key === action.payload.choiceKey) {
                return { ...choice, label: action.payload.value };
              }
              return choice;
            }),
          };
        }
        return question;
      });

      return { questions };
    }

    case "SET-CHOICE-VALUE": {
      const questions = state.questions.map((question) => {
        if (question.key === action.payload.questionKey) {
          return {
            ...question,
            assessmentQuestionChoices: question.assessmentQuestionChoices.map((choice) => {
              if (choice.key === action.payload.choiceKey) {
                return { ...choice, value: action.payload.value };
              }
              return choice;
            }),
          };
        }
        return question;
      });

      return { questions };
    }
  }
}
