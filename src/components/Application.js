import React, { useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import DayList from 'components/DayList';
import Appointment from 'components/Appointments';
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from '../helpers/selectors';
import useApplicationData from '../hooks/useApplicationData';

export default function Application(props) {
  const {
    state,
    setState, 
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  const schedule = getAppointmentsForDay(state, state.day).map(appointment => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        {...appointment}
        interview={interview}
        interviewers={getInterviewersForDay(state, state.day)}
        bookInterview={bookInterview}
        delete={cancelInterview} />);
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
        console.log(err)
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