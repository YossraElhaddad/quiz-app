import React from 'react';
import Quiz from './components/Quiz';
import StartQuiz from './components/StartQuiz';
import { nanoid } from 'nanoid';


export default function App() {

  const [quizQuestions, setQuizQuestions] = React.useState([]);
  //to determine whether quiz is started or not
  const [quizState, setQuizState] = React.useState(false);
  //to determine whether the quiz is submitted yet or not

  React.useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&category=31")
      .then(response => response.json())
      .then(data => setQuizQuestions(data.results))
      .catch(error => console.log(error));

  }, []);

  //because object properties need to be the same as the name properties of the input
  function initializeAnswerState(){
    let answersObject = {};
    for(let i=0; i< quizQuestions.length; i++){
       answersObject[`${i+1}-question`] = "";
    }
    return answersObject;
  }
  const [answers, setAnswers] = React.useState(initializeAnswerState());
  const [score, setScore] = React.useState(0);

  function decodeHtml(html) {
    const text = document.createElement("textarea");
    text.innerHTML = html;
    return text.value;
}

function shuffleOptions(array) {
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
}

function getAllAnswers(){
  const allShuffledAnswers = quizQuestions.map((quiz) =>{

    const allAnswers = [...quiz.incorrect_answers, quiz.correct_answer].map((option) => decodeHtml(option));
    return shuffleOptions(allAnswers);
  } )
//const allAnswers = [...props.incorrect_answers, props.correct_answer].map((option) => decodeHtml(option));
  return allShuffledAnswers;
}

  function getCorrectAnswers(){
    return quizQuestions.map((question) => decodeHtml(question.correct_answer));
  }

  function startQuiz() {
    setQuizState(true);
  }

  function handleChange(event){
    event.stopPropagation();
    const {name, value} = event.target;

    setAnswers((prevAnswers)=>{
      return {
        ...prevAnswers,
        [name]: value
      }
    })
  }

  function checkAnswers(event) {
     event.preventDefault();
     const correctAnswers = getCorrectAnswers();
     console.log(correctAnswers);
     const selectedAnswers = Object.values(answers);
     console.log(selectedAnswers);
 
     let result = 0;
     for(let i=0; i<correctAnswers.length; i++){

        if(selectedAnswers[i]){
          if(selectedAnswers[i] === correctAnswers[i]){
            console.log(selectedAnswers[i] === correctAnswers[i], i);
            setScore(prevScore => prevScore + 1);
            result++;
          }
          
        }
       
     }
     setScore(result);
     console.log(`You scored ${score}/${correctAnswers.length} correct Answers`);
  }

  const quizElements = quizQuestions.map((quiz, index) =>
  (<Quiz
    key={nanoid()}
    {...quiz}
    options={getAllAnswers().at(index)}
    questionNumber={index + 1}
    checked={answers[`${index+1}-question`] === decodeHtml(quiz.correct_answer)}
    handleChange={handleChange}
  />));

  return (
    <main>
      {
        quizState ?
          <form className='quiz-container' onSubmit={checkAnswers}>
            {quizElements}
             <button className='check-button'>Check Answers</button>
          </form>
          :
          <StartQuiz onStartQuiz={startQuiz} />
      }

     

    </main>
  );
}