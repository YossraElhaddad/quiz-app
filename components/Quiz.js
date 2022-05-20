import { nanoid } from 'nanoid';
import React from 'react';
import Option from './Option';

export default function Quiz(props) {

    //function to replace html code to string (e.g &quot; to "")
    function decodeHtml(html) {
        const text = document.createElement("textarea");
        text.innerHTML = html;
        return text.value;
    }

    /*function shuffleOptions(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }*/


     //const [selectedOption, setSelectedOption] = React.useState([]);
     

    /*React.useEffect(() => {
        //combining all answers (correct and false ones) together 
        const answerOptions = [...props.incorrect_answers, props.correct_answer].map((option) => decodeHtml(option));

        //shuffling the answers
        const shuffledAnswerOptions = shuffleOptions(answerOptions);
        //convert the array of answers into an object called options
        //so that it can have both option value and boolean whether it is selected or not.
        const options = shuffledAnswerOptions.map((option, index) => ({ id: index + 1, value: option, selected: false }));
        setSelectedOption(() => options);
        
    }, []);*/

    /*function selectOption(id) {
        setSelectedOption((oldSelectedOptions) => {
            return oldSelectedOptions.map((option) =>
                (option.id === id ? { ...option, selected: !option.selected } : option)
            );
        });
    }*/

    const optionsElements = props.options.map(
        (option) => 
        <Option
            key={nanoid()}
            number={props.questionNumber}
            checked = {props.checked}
            handleChange = {props.handleChange}
            value = {option}
            //selectOption={selectOption}
            //isCorrect={option.value === decodeHtml(props.correct_answer)}
        />)

    return (
        <div className='quiz'>
            <h3 className='question'>{decodeHtml(props.question)}</h3>
            <div className='options'>
                {optionsElements}
            </div>
            <div className='line-break'></div>
        </div>
    );
}