const getAppointmentsForDay = (state, day) => {
  const dayObj = state.days.find(dayObj => dayObj.name === day); //get the right day object in state
  return dayObj ? dayObj.appointments.map(key => state.appointments[key]) : []; //obtain appt keys for current day and return array of appt details
}

const getInterviewersForDay = (state, day) => {
  const dayObj = state.days.find(dayObj => dayObj.name === day); //get the right day object in state
  return dayObj ? dayObj.interviewers.map(key => state.interviewers[key]) : []; //obtain appt keys for current day and return array of appt details
};

const getInterview = (state, interview) => {
  let interviewerId = interview && interview.interviewer; //if interview not null, get interviewer id
  return interview? {...interview, interviewer: state.interviewers[interviewerId]}: null;
};

export { getAppointmentsForDay, getInterviewersForDay, getInterview };

// .then(() => {
  //   webSocket.onmessage = function (event) {
  //     const serverMessage = JSON.parse(event.data);
  //     if (serverMessage.type === "SET_INTERVIEW") {
  //       console.log(serverMessage)
  //       const appointment = {
  //         ...state.appointments[serverMessage.id],
  //         interview: getInterview(state, serverMessage.interview)
  //       };
  //       console.log('appoint', appointment)
  //       const appointments = {
  //         ...state.appointments,
  //         [serverMessage.id]: appointment
  //       };
  //       console.log('before dispatching', appointment)
  //       dispatch({ type: SET_INTERVIEW, value: appointments });
  //     }
  //   }
  // })