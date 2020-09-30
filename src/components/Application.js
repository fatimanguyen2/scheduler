import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import DayList from 'components/DayList';
import Appointment from 'components/Appointments'

export default function Application(props) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {}
  })

  useEffect(() => {
    axios.get('/api/days')
      .then( res => setDays(res.data))
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
            days={days}
            day={day}
            setDay={setDay}
          /></nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointments.map(appointment => <Appointment key={appointment.id} {...appointment}/>)}
          {<Appointment key="last" time="5pm" />}
      </section>
    </main>
  );
}