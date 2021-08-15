import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";

import { questionWizardTheme } from "../../constants/questionWizard.constants";
import { FinishButton } from "./buttons/FinishButton";
import { NextButton } from "./buttons/NextButton";
import { PreviousButton } from "./buttons/PreviousButton";
import { QuestionOptionCard } from "./QuestionOptionCard";
import { IQuestion } from "./questionWizard.types";

interface IProps {
  questions: IQuestion[];
  onChange?: (questions: IQuestion[]) => void;
  onFinish?: (questions: IQuestion[]) => void;
}

export const QuestionWizard: React.FC<IProps> = ({
  questions,
  onChange,
  onFinish,
}) => {
  const [questionsIndex, setQuestionsIndex] = useState<number>(0);
  const [totalQuestions] = useState<number>(questions.length);
  const [currentQuestion, setCurrentQuestion] = useState(
    questions[questionsIndex]
  );
  const [isPreviousDisabled, setIsPreviousDisabled] = useState(
    questionsIndex === 0
  );
  const [isLastStep, setIsLastStep] = useState(
    questionsIndex === totalQuestions - 1
  );
  const [isCurrentStepDisabled, setCurrentStepDisabled] = useState(
    !questions[questionsIndex].options.some((option) => option.isSelected)
  );
  const [isOneStepBeforeFinishing, setIsOneStepBeforeFinishing] = useState(
    questionsIndex === totalQuestions - 2
  );

  useEffect(() => {
    setCurrentQuestion(questions[questionsIndex]);

    onChange && onChange(questions);

    setIsPreviousDisabled(questionsIndex === 0);
    setIsLastStep(questionsIndex === totalQuestions - 1);
    setCurrentStepDisabled(
      !questions[questionsIndex].options.some((option) => option.isSelected)
    );
    setIsOneStepBeforeFinishing(questionsIndex === totalQuestions - 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsIndex, currentQuestion]);

  const onToggleOptionSelected = (targetIndex: number) => {
    const updatedOptions = currentQuestion.options.map((option, i) => {
      if (targetIndex === i) {
        option.isSelected = !option.isSelected;
      } else {
        option.isSelected = false; // all the others are deselected
      }

      return option;
    });

    setCurrentQuestion({
      ...currentQuestion,
      options: updatedOptions,
    });
  };

  const onRenderOptions = () =>
    currentQuestion.options.map((option, i) => (
      <QuestionOptionCard
        key={`${option.label}_${i}`}
        onClick={() => {
          onToggleOptionSelected(i);
        }}
        isSelected={option.isSelected}
        imageUrl={option.imageUrl}
        label={option.label}
      />
    ));

  const onNextClick = () => {
    if (!isCurrentStepDisabled) {
      !isLastStep && setQuestionsIndex((prev) => prev + 1);
    }
  };

  const onPreviousClick = () => {
    if (!isCurrentStepDisabled) {
      !isPreviousDisabled && setQuestionsIndex((prev) => prev - 1);
    }
  };

  const onFinishClick = () => {
    if (!isCurrentStepDisabled) {
      onFinish && onFinish(questions);
    }
  };

  return (
    <Container>
      <Header>
        <QuestionLabel>
          Question {questionsIndex + 1}/{totalQuestions}
        </QuestionLabel>
        <QuestionTitle>{currentQuestion.title}</QuestionTitle>
      </Header>
      <Body>{onRenderOptions()}</Body>
      <Footer>
        <PreviousButton
          onClick={onPreviousClick}
          isDisabled={isPreviousDisabled}
        />

        {isOneStepBeforeFinishing && (
          <NextButton
            onClick={onNextClick}
            isDisabled={isCurrentStepDisabled}
          />
        )}
        {isLastStep && (
          <FinishButton
            onClick={onFinishClick}
            isDisabled={isCurrentStepDisabled}
          />
        )}
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  font-family: "Open Sans", sans-serif;
  width: 100%;
  max-width: 600px;
`;

const Header = styled.div`
  height: 30%;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const Body = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  width: 100%;
`;

const QuestionLabel = styled.div`
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
  color: ${questionWizardTheme.mediumGray};
`;

const QuestionTitle = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  color: ${questionWizardTheme.darkGray};
`;
