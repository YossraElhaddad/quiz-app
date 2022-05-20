import React from 'react';

export default function Option(props){
   
    const styles = {
      backgroundColor: props.selected ? "#D6DBF5" : "#F5F7FB"
    }

    return(
      <label
      className='option'
      htmlFor={`question-${props.number}-option-${props.id}`}
      style={styles}
      >
      <input type='radio'
      id={`question-${props.number}-option-${props.id}`}
      name={`question-${props.number}`}
      value={props.value}
      onChange={props.handleChange}
      />
       {props.value}
     </label>
    );

    /*return(
     <div
     className='option'
     style={styles}
     onClick={()=>{props.selectOption(props.id)}}
     >
     {props.value}
     </div>
    );*/
}