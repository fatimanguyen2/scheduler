import { useReducer, useEffect } from 'react';
import axios from 'axios';

const useApplicationData = () => {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const SET_SPOTS = 'SET_SPOTS'

  const reducer = (state, action) => {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.value };
      case SET_APPLICATION_DATA:
        return { ...state, days: action.value[0], appointments: action.value[1], interviewers: action.value[2] };
      case SET_INTERVIEW:
        return { ...state, appointments: action.value };
      case SET_SPOTS:
        return {...state, days: action.value}
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })

  // const setDay = day => setState(prev => ({ ...prev, day }));
  const setDay = day => dispatch({ type: SET_DAY, value: day });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(all => {
      // setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }))
      dispatch({ type: SET_APPLICATION_DATA, value: [all[0].data, all[1].data, all[2].data] })
    })
      .catch(err => {
        console.log(err)
      })
  }, []);

  const updateSpots = initialState => {
    const state = { ...initialState };
    const dayObj = state.days.find(dayObj => dayObj.name === state.day);
    const appointmentsKeys = dayObj.appointments;
    const emptyApt = appointmentsKeys.filter(key => !state.appointments[key].interview)
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
        // setState(prev => ({ ...prev, appointments }));
        dispatch({ type: SET_INTERVIEW, value: appointments })
        // setState(prev => ({ ...prev, days: updateSpots(prev) }))
        // dispatch({type: SET_SPOTS, value: updateSpots(state)})
      })
  }

  function cancelInterview(id) {
    const appointment = { ...state.appointments[id], interview: null };
    const appointments = { ...state.appointments, [id]: appointment };
    return axios.delete(`/api/appointments/${id}`, appointment)
      .then(() => {
        // setState(prev => ({ ...prev, appointments }));
        dispatch({ type: SET_INTERVIEW, value: appointments })
        // setState(prev => ({ ...prev, days: updateSpots(prev) }));
      })
  };
  return { state, setDay, bookInterview, cancelInterview }
}

export default useApplicationData;