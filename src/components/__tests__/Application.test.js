import React from "react";
import axios from "axios";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  prettyDOM,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  queryByAltText
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe('Application', () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText, getByAltText } = render(<Application />);

    await waitForElement(() => getByText("Monday")) //loads page after mock API call

    fireEvent.click(getByText('Tuesday')); //select tuesday
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen')); //loads page after mock API call

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0]; //select first(empty) apt

    fireEvent.click(getByAltText(appointment, 'Add')); //click on add button when appointment mode is EMPTY

    // Fill out and submit form
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument(); // appointment mode should be SAVING

    // wait to transition to show mode of appointment
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen")); //reload page after mock API call

    // Get Archie Cohen appt
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    // Initial attempt to delete
    fireEvent.click(queryByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    //2nd attempt to delete appt
    fireEvent.click(getByText(appointment, 'Confirm'));
    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    // Wait for empty mode to show
    await waitForElement(() => getByAltText(appointment, 'Add'));

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen")); //reload page after mock API call

    // Get a non-empty appt
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Interviewer")
    );

    fireEvent.click(getByAltText(appointment, 'Edit'));

    // Fill out and submit form
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    // wait to transition to show mode of appointment
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen')); //loads page after mock API call

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, 'Add')); //click on add button when appointment mode is EMPTY

    // Fill out and submit form
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    // Wait for error to appear
    await waitForElement(() => getByText(appointment, "Error"));
    expect(getByText(appointment, 'Error')).toBeInTheDocument();

    //Close error and go back to form mode of Form
    fireEvent.click(getByAltText(appointment, 'Close'));
    expect(getByPlaceholderText(appointment, /enter student name/i)).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen")); //reload page after mock API call

    // Get Archie Cohen appt
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    // Initial attempt to delete
    fireEvent.click(queryByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    //2nd attempt to delete appt
    fireEvent.click(getByText(appointment, 'Confirm'));
    await waitForElement(() => getByText(appointment, "Error"));
    expect(getByText(appointment, 'Error')).toBeInTheDocument();

    // Redirect to show mode of apt when 'x' clicked
    fireEvent.click(getByAltText(appointment, 'Close'));
    expect(getByText(appointment, 'Archie Cohen')).toBeInTheDocument();
  });
})
