import { useReducer, useEffect } from 'react';
import axios from 'axios';
import { getInterview } from '../helpers/selectors';
import {
  reducer,
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

const useApplicationData = () => {
  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  // Set the selected day 
  const setDay = day => dispatch({ type: SET_DAY, value: day });

  // API calls to populate page
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers'),
    ]).then(all => {
      dispatch({ type: SET_APPLICATION_DATA, value: all.map(apiData => apiData.data) });
    })
      .catch(err => {
        console.log(err)
      });
  }, []);

  // Use webSockets
  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    webSocket.onopen = () => {
      webSocket.onmessage = function (event) {
        const serverMessage = JSON.parse(event.data);
        if (serverMessage.type === "SET_INTERVIEW" && Object.keys(state.appointments).length) {
          const appointment = {
            ...state.appointments[serverMessage.id],
            interview: serverMessage.interview
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

  // Function gets called to book interview when appointment's save btn is clicked
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
        dispatch({ type: SET_INTERVIEW, value: appointments });
      })
  }

// Function gets called to cancel interview when appointment's confirm's btn is clicked
  const cancelInterview = id => {
    const appointment = { ...state.appointments[id], interview: null };
    const appointments = { ...state.appointments, [id]: appointment };
    return axios.delete(`/api/appointments/${id}`, appointment)
      .then(() => {
        dispatch({ type: SET_INTERVIEW, value: appointments });
      })
  };

  return { state, setDay, bookInterview, cancelInterview }
}

export default useApplicationData;