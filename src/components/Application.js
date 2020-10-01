import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import DayList from 'components/DayList';
import Appointment from 'components/Appointments';
import {getAppointmentsForDay, getInterviewersForDay, getInterview} from '../helpers/selectors';

export default function Application(props) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })
  const setDay = day => setState({ ...state, day });
  // const setDays = days => setState({...state, days}); //BEFORE: causing warning
  // const setDays = days => setState(prev => ({...prev, days}));  //NO warning
  // useEffect(() => {
  //     axios.get('/api/days').then(res => setDays( res.data))
  //   }, [])
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.interviewers);
  const schedule = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    return (
    <Appointment key={appointment.id} {...appointment} interview={interview} interviewers={dailyInterviewers}/>);
  })


  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(all => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }))
    })
      .catch(err => {
        console.log(err.response.status)
        console.log(err.response.headers)
        console.log(err.response.data)
      })
  }, []);
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          /></nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        {<Appointment key="last" time="5pm" />}
      </section>
    </main>
  );
}