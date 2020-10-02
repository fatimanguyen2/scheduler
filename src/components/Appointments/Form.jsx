import React, { useState } from 'react';
import Button from "components/Button";
import InterviewerList from 'components/InterviewerList';

export default function Form(props) {
  const [name, setName] = useState(props.name || '');
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  console.log(name)
  const reset = () => {
    setName('');
    setInterviewer(null);
  };
  const cancel = () => {
    reset();
    props.onCancel();
  };

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit = {event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name={name}
            value={name}
            type="text"
            placeholder={props.name ? props.name : "Enter Student Name"}
            onChange={event => setName(event.target.value)}
          />
        </form>
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={() => props.onSave(name, interviewer)}>Save</Button>
        </section>
      </section>
    </main>
  );
}