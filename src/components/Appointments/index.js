import React, { Fragment, useEffect } from 'react';
import 'components/Appointments/styles.scss';
import Header from 'components/Appointments/Header';
import Show from 'components/Appointments/Show';
import Form from 'components/Appointments/Form';
import Empty from 'components/Appointments/Empty';
import Status from 'components/Appointments/Status';
import Confirm from 'components/Appointments/Confirm';
import Error from 'components/Appointments/Error';
import useVisualMode from '../../hooks/useVisualMode';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = 'CREATE';
const SAVING = 'SAVING';
const CONFIRM = 'CONFIRM';
const DELETING = 'DELETING';
const EDIT = 'EDIT'
const ERROR_SAVE = 'ERROR_SAVE';
const ERROR_DELETE = 'ERROR_DELETE';

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => { transition(SHOW) })
      .catch(err => transition(ERROR_SAVE, true));
  };

  const deleteAppt = () => {
    if (mode === CONFIRM) {
      transition(DELETING, true);
      props.delete(props.id)
        .then(() => transition(EMPTY))
        .catch(err => transition(ERROR_DELETE, true));
    } else {
      transition(CONFIRM);
    }
  };

  useEffect(() => {
    if (mode === EMPTY  && props.interview) {
      transition(SHOW);
    }

    if(mode === SHOW && !props.interview) {
      transition(EMPTY);
    }
  }, [props.interview, transition, mode])


  return (
    <Fragment>
      <Header time={props.time} />
      <article className="appointment" data-testid="appointment">
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && props.interview && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onDelete={deleteAppt}
            onEdit={() => transition(EDIT)}
          />
        )}
        {mode === CREATE &&
          <Form
            interviewers={props.interviewers}
            onSave={save}
            onCancel={back}
          />}
        {mode === EDIT &&
          <Form
            name={props.interview.student}
            interviewer={props.interview.interviewer && props.interview.interviewer.id}
            interviewers={props.interviewers}
            onSave={save}
            onCancel={back}
          />}
        {mode === SAVING && <Status message='Saving' />}
        {mode === ERROR_SAVE && <Error message='Sorry, we could not save your appointment. Please try again later.' onClose={back} />}
        {mode === DELETING && <Status message='Deleting' />}
        {mode === ERROR_DELETE && <Error message='Sorry, we could not delete your appointment. Please try again later.' onClose={back} />}
        {mode === CONFIRM && <Confirm message="Are you sure you would like to delete?" onCancel={back} onConfirm={deleteAppt} />}
      </article>
    </Fragment>
  );
}