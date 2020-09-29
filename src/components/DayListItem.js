import React from "react";
import "components/DayListItem.scss";
import classNames from 'classnames';

export default function DayListItem(props) {
  const style = classNames('day-list__item', {'day-list__item--selected': props.selected, 'day-list__item--full': !props.spots});
  const formatSpots = (numOfSpots) => {
    let text;
    if (numOfSpots > 1) {
      text = `${numOfSpots} spots remaining`;
    } else if (numOfSpots === 1) {
      text = `${numOfSpots} spot remaining`;
    } else {
      text = `no spots remaining`;
    }
    return text;
  };
  return (
    <li className = {style} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}
