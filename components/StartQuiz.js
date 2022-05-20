import React from 'react';

export default function StartQuiz(props){
    return(
     <div className='start-quiz'>
        <h2>Quizzical</h2>
        <p className='description'>This is a small quiz in Japanese Anime and Manga. Saa hajimeyou! :D</p>
        <button className='start-button' onClick={props.onStartQuiz}>Start Quiz</button>
     </div>
    );
}