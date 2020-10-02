// const state = {
//   days: [
//     {
//       id: 1,
//       name: "Monday",
//       appointments: [1, 2, 3],
//       interviewers: [1, 2]
//     },
//     {
//       id: 2,
//       name: "Tuesday",
//       appointments: [4, 5],
//       interviewers: [1, 2]
//     }
//   ],
//   appointments: {
//     "1": { id: 1, time: "12pm", interview: null },
//     "2": { id: 2, time: "1pm", interview: null },
//     "3": {
//       id: 3,
//       time: "2pm",
//       interview: { student: "Archie Cohen", interviewer: 2 }
//     },
//     "4": { id: 4, time: "3pm", interview: null },
//     "5": {
//       id: 5,
//       time: "4pm",
//       interview: { student: "Chad Takahashi", interviewer: 2 }
//     }
//   },
//   interviewers: {
//     "1": {
//       "id": 1,
//       "name": "Sylvia Palmer",
//       "avatar": "https://i.imgur.com/LpaY82x.png"
//     },
//     "2": {
//       id: 2,
//       name: "Tori Malcolm",
//       avatar: "https://i.imgur.com/Nmx0Qxo.png"
//     }
//   }
// };

function getAppointmentsForDay(state, day) {
  let validDay = state.days.find(dayObj => dayObj.name === day)
  let aptArray;


  
  if (!validDay) {
    return [];
  }
  state.days.forEach(dayObj => {
    if (dayObj.name === day) {
      aptArray = dayObj.appointments;
    }
  });
  
  let dailyAptArr = [];
  for (const aptId of aptArray) {
    for (const key in state.appointments) {
      if (state.appointments[key].id === aptId) {
        dailyAptArr.push(state.appointments[key]);
      }
    }
  }
  return dailyAptArr;
};

// export const getAppointmentsForDay = (state, dayInput) => {
//   const { days, appointments } = state;
//   const appointmentsForDay = [];
//   // Loop through days and add appointment to results if day matches input day
//   days.forEach(day => {
//    if (day.name === dayInput) {
//     day.appointments.forEach(app => {
//      appointmentsForDay.push(appointments[app]);
//     });
//    }
//   });
//   return appointmentsForDay;
//  };

// export const getAppointmentsForDay = (state, day) => {
//   if (state.days.length === 0) return [];
//   const currentDay = state.days.filter(obj => obj.name === day);
//   return currentDay.length === 0
//     ? []
//     : currentDay[0].appointments.map(appoId => state.appointments[appoId]);
// };

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
export { getAppointmentsForDay, getInterviewersForDay, getInterview };