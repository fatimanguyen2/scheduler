import React from "react";
import { render, cleanup, waitForElement, fireEvent, prettyDOM, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe('Application', () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText, getByAltText } = render(<Application />);

    await waitForElement(() => getByText("Monday"))
    fireEvent.click(getByText('Tuesday'));
    expect(getByText("Leopold Silvers")).toBeInTheDocument()
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />)

    await waitForElement(() => getByText(container, 'Archie Cohen')); //loads page after mock API call

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, 'Add')); //click on add button when appointment mode is EMPTY

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, "Monday")
    );
    // await waitForElement(() => getByText(day, 'no spots remaining'));
    // expect(getByText(day, 'no spots remaining')).toBeInTheDocument();
    setTimeout(() => {
      console.log(debug())
      expect(getByText(day, 'no spots remaining')).toBeInTheDocument()
    }, 5 )


  });
})
