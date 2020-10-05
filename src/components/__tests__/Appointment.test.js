import React from 'react';
import {render} from '@testing-library/react';
import Appointment from '../Appointments';

describe('Appointment', () => {
  it('renders without crashing', () => {
    render(<Appointment />);
  });
});
