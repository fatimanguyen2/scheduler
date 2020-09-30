import React, { Fragment }from 'react';
import 'components/Appointments/styles.scss';
import Header from 'components/Appointments/Header';
import Show from 'components/Appointments/Show';
import Empty from 'components/Appointments/Empty';

export default function Appointment(props) {
  return (
    <Fragment>
      <Header time={props.time}/>
      <article className="appointment">
        {props.interview? <Show 
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        /> :
         <Empty/>}
      </article>
    </Fragment>
  );
}