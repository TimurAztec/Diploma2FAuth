import { useNavigate } from "react-router-dom";
import { Calendar, Views, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import { FormEvent, useEffect, useState } from "react";
import { API } from "../../../api/axios";
import { ErrorNotification } from "../../notifications";
import DatePicker from "react-datepicker";

export interface CustomEvent {
  allDay?: boolean | undefined;
  title?: React.ReactNode | undefined;
  start?: Date | undefined;
  end?: Date | undefined;
  resource?: any;
  location?: string;
  description?: string;
  id: string;
}

function Schedule() {
  const [events, setEvents] = useState<CustomEvent[] | undefined>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    location: '',
    description: ''
  });

  const localizer = momentLocalizer(moment);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (selectedEvent) {
        await API.put('/events', {_id: selectedEvent.id, ...formData});
      } else {
        await API.post('/events', formData);
      }
      fetchEvents();
      setFormData({
        title: '',
        start: new Date(),
        end: new Date(),
        location: '',
        description: ''
      });
      setError(null);
      setSelectedEvent(null);
    } catch (error) {
      setError(error.response.data.message || Object.values(error.response.data)[0]);
    };
  };

  const handleDeleteEvent = async (event: any) => {
    try {
      if (selectedEvent?.id) {
        await API.delete(`/events/${selectedEvent.id}`)
        fetchEvents();
      }
    } catch (error) {
      setError(error.response.data.message || Object.values(error.response.data)[0]);
    };
  };

  const handleEventSelect = (event: CustomEvent) => {
    setSelectedEvent(event);
    const { start = new Date(), end = new Date(), title, location, description } = event;
    setFormData({
      title: typeof title === 'string' ? title : '',
      start: start instanceof Date ? start : new Date(),
      end: end instanceof Date ? end : new Date(),
      location: location || '',
      description: description || ''
    });
  };  

  const fetchEvents = () => {
    API.get('/events').then((response: any) => {
      const events: any[] = response.data;
      if (events.length) {
        events.forEach(event => {
          event.id = event["_id"];
          event.start = new Date(event.start);
          event.end = new Date(event.end);
        });
        setEvents(events as CustomEvent[]);
      }
    });
  };

  return (
      <main>
          <ErrorNotification message={error} setMessage={setError}/>
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
              <Calendar
                  className="col-span-1 lg:col-span-3"
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                  defaultView={Views.MONTH}
                  style={{ height: "75vh" }}
                  onSelectEvent={handleEventSelect}
              />
              <form onSubmit={handleSubmit} id="event-form" className="col-span-1 flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md border border-gray-300">
                <div>
                  <label htmlFor="title">Title</label>
                  <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div>
                  <label htmlFor="location">Location</label>
                  <input type="text" name="location" id="location" value={formData.location} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div>
                  <label htmlFor="start">Start</label>
                  <DatePicker
                    selected={formData.start}
                    onChange={(date) => handleInputChange({ target: { name: "start", value: date } })}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label htmlFor="end">End</label>
                  <DatePicker
                    selected={formData.end}
                    onChange={(date) => handleInputChange({ target: { name: "end", value: date } })}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    minDate={formData.start}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label htmlFor="description">Description</label>
                  <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="col-span-2">
                {selectedEvent ? (
                  <>
                  <button type="submit" className="w-full bg-primary-600 text-white rounded-md px-4 py-2 hover:bg-primary-700 focus:outline-none focus:bg-indigo-600">Update Event</button>
                  <button
                    className="w-full text-white rounded-md px-4 py-2 mt-4 focus:outline-none focus:bg-indigo-600 bg-red-600 hover:bg-red-700"
                    onClick={() => {setSelectedEvent(null)}}>
                    Do not update item
                  </button>
                  </>
                ) : (
                  <button type="submit" className="w-full bg-primary-600 text-white rounded-md px-4 py-2 hover:bg-primary-700 focus:outline-none focus:bg-indigo-600">Add Event</button>
                )}
                  <button type="button" className="w-full bg-red-600 text-white rounded-md px-4 mt-4 py-2 hover:bg-red-700 focus:outline-none focus:bg-indigo-600" onClick={handleDeleteEvent}>Delete</button>
                </div>
              </form>
          </section>
      </main>
  )
}

export {Schedule}