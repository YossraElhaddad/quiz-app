import React from 'react';
import Quiz from './components/Quiz';
import StartQuiz from './components/StartQuiz';
import { nanoid } from 'nanoid';


export default function App() {
  
  //to pull questions data from the API
  const [quizQuestions, setQuizQuestions] = React.useState([]);

  //to determine whether quiz is started or not
  const [quizState, setQuizState] = React.useState(false);

  //to determine whether the quiz is submitted yet or not
  const [answers, setAnswers] = React.useState(initializeAnswerState());

  /*An object state that determines the state of the quiz results after submission
  which includes score, whether the quiz is submitted or not,
  and a flag called playedAgain, mainly used as a dependency in useEffect function
  since the questions are reloaded every time the user clicks play again
  */
  const [submitted, setSubmitted] = React.useState({
    score: 0,
    isSubmitted: false,
    playedAgain: false
  });

  //function used to convert html code to normal string (e.g &quot; is decoded to "")
  function decodeHtml(html) {
    const text = document.createElement("textarea");
    text.innerHTML = html;
    return text.value;
  }
  /*function used to shuffles the options (choices) as the correct and incorrect options are initially separated
    when fetched from opentdb API, hence, they need to be combined together then shuffled so that the correct answer
    is not always at the first or the end of the options on every question. */

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


  function getQuestionsAndAnswers(result) {
    //combining and shuffling the options
    const allQuestions = result.map((data) => {
      const { question, incorrect_answers, correct_answer } = data;
      const allAnswers = [...incorrect_answers, correct_answer].map((option) => decodeHtml(option));
      const allShuffledAnswers = shuffleOptions(allAnswers);

      /*get a modified version of data fetched from the API, 
      /which contains only the questions, the choices and the correct answer*/
      return {
        question: decodeHtml(question),
        choices: allShuffledAnswers,
        correctAnswer: decodeHtml(correct_answer)
      };

    });
    return allQuestions;
  }

  React.useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&category=31")
      .then(response => response.json())
      .then(data => {
        const result = data.results;
        const modifiedQuizQuestions = getQuestionsAndAnswers(result);
        return setQuizQuestions(modifiedQuizQuestions);
      })
      .catch(error => console.log(error));
  }, [submitted.playedAgain]);

  //because object properties need to be the same as the name properties of the input
  function initializeAnswerState() {
    let answersObject = {};
    for (let i = 0; i < quizQuestions.length; i++) {
      answersObject[`question-${i + 1}`] = "";
    }
    return answersObject;
  }

  function getCorrectAnswers() {
    const correctAnswers = quizQuestions.map((question) => question.correctAnswer);
    //convert the array to object so the comparison can be more efficient, in order to handle cases like unselected choices
    return { ...correctAnswers };

  }

  //function used to change the quiz state to true to move to the quiz page
  function startQuiz() {
    setQuizState(true);
  }

  //used to handle the dependency in use effect function, to pull new questions from the API
  function playAgain() {
    if (submitted.isSubmitted)
      setSubmitted((prevState) => ({ ...prevState, score: 0, isSubmitted: false, playedAgain: !prevState.playedAgain }));

  }
  //handle radio buttons changes
  function handleChange(event) {
    const { name, value } = event.target;

    setAnswers((prevAnswers) => {
      return {
        ...prevAnswers,
        [name]: value
      }
    })
  }

  function handleSubmit(event) {

    //prevent page loading after submission
    event.preventDefault();

    if (submitted.isSubmitted) 
      playAgain();
  
    else{
      const correctAnswers = getCorrectAnswers();
      const length = Object.keys(correctAnswers).length;
      const selectedAnswers = answers;

      let result = 0;
      for (let i = 0; i < length; i++) {
        //make the comparison between list of selected answers and the correct answers
        if (selectedAnswers[`question-${i + 1}`]) {
          if (selectedAnswers[`question-${i + 1}`] === correctAnswers[`${i}`]) {
            console.log(selectedAnswers[`question-${i + 1}`] === correctAnswers[`${i}`], i);
            result++;
          }
        }
      }
      // set the score and that the answers are submitted
      setSubmitted(prevState => ({ ...prevState, score: result, isSubmitted: true }));
    }
   
  } 

    /*function checkAnswers() {
      const correctAnswers = getCorrectAnswers();
      const length = Object.keys(correctAnswers).length;
      const selectedAnswers = answers;

      let result = 0;
      for (let i = 0; i < length; i++) {
        //make the comparison between list of selected answers and the correct answers
        if (selectedAnswers[`question-${i + 1}`]) {
          if (selectedAnswers[`question-${i + 1}`] === correctAnswers[`${i}`]) {
            console.log(selectedAnswers[`question-${i + 1}`] === correctAnswers[`${i}`], i);
            result++;
          }
        }
      }
      // set the score and that the answers are submitted
      setSubmitted(prevState => ({ ...prevState, score: result, isSubmitted: true }));

    }*/

  const quizElements = quizQuestions.map((quiz, index) =>
  (<Quiz
    key={nanoid()}
    {...quiz}
    options={quiz.choices}
    questionNumber={index + 1}
    answers={answers}
    isSubmitted={submitted.isSubmitted}
    handleChange={handleChange}
  />));

  //rendering the App, if the quiz state is false, then the  first page which is the start quiz page will load
  //else, the quiz form will load
  return (
    <main>
      {
        (quizState) ?
          <form className='quiz-container' onSubmit={handleSubmit}>
            {quizElements}
            <div className='result'>
              <button className='check-button'>{submitted.isSubmitted ? "Play Again" : "Submit Answers"}</button>
              {submitted.isSubmitted && <span>{`You scored ${submitted.score}/${quizElements.length} correct Answers`}</span>}
            </div>
          </form>
          :
          <StartQuiz onStartQuiz={startQuiz} />
      }

    </main>
  );
}