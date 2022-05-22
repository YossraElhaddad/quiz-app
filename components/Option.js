import React from 'react';

export default function Option(props) {

 /*const selectionStyles={
   backgroundColor: '#D6DBF5',
   border: 'none'
 }*/

  function getCheckingStyles() {
  
    if (props.isSelected(props.value)) {
      if (props.isCorrect(props.value))
        return "correct";
      else
        return "incorrect";
    }
    else if (!props.isSelected(props.value) && props.isCorrect(props.value))
      return "correct";

    return "unselected";
  }

  return (
    <div className='option'>
      <input
        type='radio'
        id={`question-${props.number}-option-${props.id}`}
        name={`question-${props.number}`}
        value={props.value}
        checked={props.answers[`question-${props.number}`] === props.value}
        onChange={props.handleChange}
      />

      <label
        htmlFor={`question-${props.number}-option-${props.id}`}
        className={props.isSubmitted ? `selection ${getCheckingStyles()}` : "selected-unsubmitted"}
      >
        {props.value}</label>
    </div>
  );

}