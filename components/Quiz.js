import { nanoid } from 'nanoid';
import React from 'react';
import Option from './Option';

export default function Quiz(props) {

    const answers = Object.values(props.answers);

    //functions to be passed down to Option component to render the colors on submittng the quiz
    function isSelected(value) {
        return answers.includes(value);
    }

    function isCorrect(value) {
        if(props.isSubmitted)
      return value === props.correctAnswer;
        
    }

    const optionsElements = props.options.map(
        (option, index) =>
            <Option
                key={nanoid()}
                id={index + 1}
                number={props.questionNumber}
                value={option}
                answers={props.answers}
                isSubmitted={props.isSubmitted}
                isSelected={isSelected}
                isCorrect={isCorrect}
                correctAnswer={props.correctAnswer}
                handleChange={props.handleChange}
            />)

    return (
        <div className='quiz'>
            <h3 className='question'>{props.question}</h3>
            <div className='options'>
                {optionsElements}
            </div>
            <div className='line-break'></div>
        </div>
    );
}