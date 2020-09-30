
export function getAppointmentsForDay(state, day) {
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
}