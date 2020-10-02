import React, { Fragment } from 'react';
import 'components/Appointments/styles.scss';
import Header from 'components/Appointments/Header';
import Show from 'components/Appointments/Show';
import Form from 'components/Appointments/Form';
import Empty from 'components/Appointments/Empty';
import useVisualMode from '../../hooks/useVisualMode';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = 'CREATE';

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    props.bookInterview(props.id, interview)
      .then(() => {transition(SHOW)})
      .catch(err => console.log(err));
  };

  return (
    <Fragment>
      <Header time={props.time} />
      <article className="appointment">
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
          />
        )}
        {mode === CREATE && <Form
          interviewers = {props.interviewers}
          onSave={save}
          onCancel={back}
        />}
      </article>
    </Fragment>
  );
}