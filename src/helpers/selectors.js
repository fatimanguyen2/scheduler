const getAppointmentsForDay = (state, day) => {
  const dayObj = state.days.find(dayObj => dayObj.name === day); //get the right day object in state
  return dayObj ? dayObj.appointments.map(key => state.appointments[key]) : []; //obtain appt keys for current day and return array of appt details
};

const getInterviewersForDay = (state, day) => {
  const dayObj = state.days.find(dayObj => dayObj.name === day); //get the right day object in state
  return dayObj ? dayObj.interviewers.map(key => state.interviewers[key]) : []; //obtain appt keys for current day and return array of appt details
};

const getInterview = (state, interview) => {
  let interviewerId = interview && interview.interviewer; //if interview not null, get interviewer id
  return interview? {...interview, interviewer: state.interviewers[interviewerId]}: null;
};

export { getAppointmentsForDay, getInterviewersForDay, getInterview };