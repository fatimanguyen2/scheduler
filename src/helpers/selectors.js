const getAppointmentsForDay = (state, day) => {
  const dayObj = state.days.find(dayObj => dayObj.name === day); //get the right day object in state
  return dayObj ? dayObj.appointments.map(key => state.appointments[key]) : []; //obtain appt keys for current day and return array of appt details
}

const getInterviewersForDay = (state, day) => {
  const dayObj = state.days.find(dayObj => dayObj.name === day); //get the right day object in state
  return dayObj ? dayObj.interviewers.map(key => state.interviewers[key]) : []; //obtain appt keys for current day and return array of appt details
};

function getInterview(state, interview) {
  let aptObj = { ...interview };
  let interviewerId = interview && interview.interviewer;

  if (!interview) {
    return null;
  }

  for (const interviewerObj in state.interviewers) {
    if (Number(interviewerObj) === interviewerId) {
      aptObj.interviewer = state.interviewers[interviewerObj];
    }
  }
  return aptObj;
};

// const getInterview = (state, appointment) => {
//   const aptWithInterviewerDetails = !appointment? null : {... interview}
// };
export { getAppointmentsForDay, getInterviewersForDay, getInterview };