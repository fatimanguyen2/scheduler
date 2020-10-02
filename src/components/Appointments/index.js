import React, { Fragment } from 'react';
import 'components/Appointments/styles.scss';
import Header from 'components/Appointments/Header';
import Show from 'components/Appointments/Show';
import Form from 'components/Appointments/Form';
import Empty from 'components/Appointments/Empty';
import Status from 'components/Appointments/Status';
import Confirm from 'components/Appointments/Confirm';
import useVisualMode from '../../hooks/useVisualMode';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = 'CREATE';
const SAVING = 'SAVING';
const CONFIRM = 'CONFIRM';
const DELETING = 'DELETING';
const EDIT = 'EDIT'

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => { transition(SHOW) })
      .catch(err => console.log(err));
  };

  function deleteAppt(id) {
    if (mode === CONFIRM) {
      transition(DELETING);
      props.delete(props.id)
        .then(() => transition(EMPTY))
        .catch(err => console.log(err));
    } else {
      transition(CONFIRM);
    }
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
            onDelete={deleteAppt}
            onEdit={() => transition(EDIT)}
          />
        )}
        {mode === CREATE && <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />}
        {mode === EDIT && <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />}
        {mode === SAVING && <Status message='Saving' />}
        {mode === DELETING && <Status message='Deleting'/>}
        {mode === CONFIRM && <Confirm message="Delete the appointment?" onCancel={back} onConfirm={deleteAppt}/>}
      </article>
    </Fragment>
  );
}