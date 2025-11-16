import EventCard from "@/components/EventCard"
import {IEvent} from "@/database";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
// import events from "@/lib/constants";


const EventCards = async () => {
    const response = await fetch(`${BASE_URL}/api/events`, { next: { revalidate: 60 }});
    const {events} = await response.json();
  return (
    <>
        <ul className="events">
          {events && events.length > 0 && events.map((event : IEvent ) => (
            <li className="list-none" key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
    </>
  )
}

export default EventCards