import React from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import Loading from "../Loading";

function Calendar({ proposal, mode, loading }) {
  setTimeout(() => window.dispatchEvent(new Event("resize")));
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={[
            { title: "event 1", date: "2023-02-01" },
            { title: "event 2", date: "2023-02-02" },
          ]}
          headerToolbar={{
            center: "addEventButton",
          }}
          customButtons={{
            addEventButton: {
              text: "Add Event",
            },
          }}
          height="80vh"
        />
      )}
    </>
  );
}

export default Calendar;
