import React from 'react';
import PropTypes from 'prop-types';
import './InterviewerList.scss';
import InterviewerListItem from 'components/InterviewerListItem'

InterviewList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

// export default function InterviewerList(props) {
//   const interviewers = props.interviewers.map(interviewer => {
//     return <InterviewerListItem
//       key={interviewer.id}
//       name={interviewer.name}
//       avatar={interviewer.avatar}
//       selected={props.value === interviewer.id}
//       setInterviewer={() => props.onChange(interviewer.id)} />
//   });
//   return (
//     <section className="interviewers">
//       <h4 className="interviewers__header text--light">Interviewer</h4>
//       <ul className="interviewers__list">{interviewers}</ul>
//     </section>)
// };
export default function InterviewList(props) {
  const interviewers = props.interviewers.map(interviewer => {
    return <InterviewerListItem
      key={interviewer.id}
      name={interviewer.name}
      avatar={interviewer.avatar}
      selected={props.value === interviewer.id}
      setInterviewer={() => props.onChange(interviewer.id)} />
  });
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewers}</ul>
    </section>)
};