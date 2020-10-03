import { useState } from 'react';
import axios from 'axios';

function useApplicationData() {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })
  const setDay = day => setState({ ...state, day });

  function updateSpots(initialState) {
    const state = {...initialState};
    const dayObj = state.days.find(dayObj => dayObj.name === state.day);
    const appointmentsKeys = dayObj.appointments;
    const emptyApt = appointmentsKeys.filter( key => !state.appointments[key].interview )
    dayObj.spots = emptyApt.length;
    return state.days
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, appointment)
    .then(() => {
      setState(prev => ({ ...prev, appointments }));
      setState(prev => ({...prev, days: updateSpots(prev)}))
      })
  }

  function cancelInterview(id) {
    const appointment = { ...state.appointments[id], interview: null };
    const appointments = { ...state.appointments, [id]: appointment };
    return axios.delete(`/api/appointments/${id}`, appointment)
      .then(() => {
        setState(prev => ({ ...prev, appointments }));
        setState(prev => ({...prev, days: updateSpots(prev)}));
      })
  };
  return { state, setState, setDay, bookInterview, cancelInterview }
}

export default useApplicationData;