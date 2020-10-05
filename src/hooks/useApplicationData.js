import { useReducer, useEffect } from 'react';
import axios from 'axios';
import { getInterview } from '../helpers/selectors';

const useApplicationData = () => {
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

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })

  // Set the selected day 
  const setDay = day => dispatch({ type: SET_DAY, value: day });

  // API calls to populate page and connect to WebSocket
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
      // Promise.resolve(webSocket)
    ]).then(all => {
      dispatch({ type: SET_APPLICATION_DATA, value: [all[0].data, all[1].data, all[2].data] })
      // console.log('in use eggect', state) HWTA????????????????????????????????????????????????????????????????????????????????
    })
      .catch(err => {
        console.log(err)
      })
  }, []);
  // console.log('outside use effect', state) HWTA????????????????????????????????????????????????????????????????????????????????
  
  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    webSocket.onopen = function () {
      webSocket.onmessage = function (event) {
        const serverMessage = JSON.parse(event.data);
        if (serverMessage.type === "SET_INTERVIEW" && Object.keys(state.appointments).length) {
          const appointment = {
            ...state.appointments[serverMessage.id],
            interview: getInterview(state, serverMessage.interview)
          };
          const appointments = {
            ...state.appointments,
            [serverMessage.id]: appointment
          };
          dispatch({ type: SET_INTERVIEW, value: appointments });
        }
      }
    }
  }, [state])

  const bookInterview = (id, interview) => {
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
        dispatch({ type: SET_INTERVIEW, value: appointments })
      })
  }

  const cancelInterview = id => {
    const appointment = { ...state.appointments[id], interview: null };
    const appointments = { ...state.appointments, [id]: appointment };
    return axios.delete(`/api/appointments/${id}`, appointment)
      .then(() => {
        dispatch({ type: SET_INTERVIEW, value: appointments })
      })
  };

  return { state, setDay, bookInterview, cancelInterview }
}

export default useApplicationData;