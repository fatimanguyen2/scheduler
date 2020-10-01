function getAppointmentsForDay(state, day) {
  let dailyAptArr = [];
  let validDay = false;
  let aptArray;
  // check if day exists in days arr
  for (const dayObj of state.days) {
    if (dayObj.name === day) {
      validDay = true;
      aptArray = dayObj.appointments;
    }
  }
  // if day is not valid, return empty arr
  if (!validDay) {
    return [];
  }
  for (const aptId of aptArray) {
    for (const key in state.appointments) {
      if (state.appointments[key].id === aptId) {
        dailyAptArr.push(state.appointments[key]);
      }
    }
  }
  return dailyAptArr;
};

function getInterviewersForDay(state, day) {
  let dailyInterviewerArr = [];
  let validDay = false;
  let interviewersArray;
  // check if day exists in days arr
  for (const dayObj of state.days) {
    if (dayObj.name === day) {
      validDay = true;
      interviewersArray = dayObj.interviewers;
    }
  }
  // if day is not valid, return empty arr
  if (!validDay) {
    return [];
  }
  for (const id of interviewersArray) {
    for (const key in state.interviewers) {
      if (state.interviewers[key].id === id) {
        dailyInterviewerArr.push(state.interviewers[key]);
      }
    }
  }
  return dailyInterviewerArr;
};

function getInterview(state, interview) {
  let aptObj = {...interview};
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
export {getAppointmentsForDay, getInterviewersForDay, getInterview};