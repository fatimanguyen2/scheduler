const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

// Add/remove daily remaining spots if book/delete an appointment
const updateSpots = initialState => {
  const state = { ...initialState };
  const dayObj = state.days.find(dayObj => dayObj.name === state.day);
  const appointmentsKeys = dayObj.appointments;
  const emptyApt = appointmentsKeys.filter(key => !state.appointments[key].interview)
  dayObj.spots = emptyApt.length;
  return state.days
}

// reducer to be used when dispatch from useReducer hook is called
const reducer = (state, action) => {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.value };
    case SET_APPLICATION_DATA:
      return { ...state, days: action.value[0], appointments: action.value[1], interviewers: action.value[2] };
    case SET_INTERVIEW:
      return { ...state, appointments: action.value, days: updateSpots(state) };
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
};

export {
  reducer,
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
}