import { useNavigate } from "react-router-dom";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";

const events = [
    {
      title: "Event 1",
      start: new Date(2023, 3, 10, 10, 0),
      end: new Date(2023, 3, 10, 12, 0),
    },
    {
      title: "Event 2",
      start: new Date(2023, 3, 12, 14, 0),
      end: new Date(2023, 3, 12, 16, 0),
    },
    {
      title: "Event 3",
      start: new Date(2023, 3, 13, 9, 0),
      end: new Date(2023, 3, 13, 10, 0),
    },
  ];

function Schedule() {
    const localizer = momentLocalizer(moment);
    const navigate = useNavigate();

    return (
        <main>
            <section>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                    defaultView={Views.MONTH}
                    style={{ height: "75vh" }}
                />
            </section>
        </main>
    )
}

export {Schedule}