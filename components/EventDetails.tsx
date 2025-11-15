import {notFound} from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import {IEvent} from "@/database";
import {getSimilarEventsBySlug} from "@/lib/actions/event.actions";
import { cacheLife } from "next/cache";
import EventCard from "@/components/EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const bookings = 10;


const EventDetails = async ({params} : {params : Promise<string>}) => {
    'use cache'
    cacheLife('hours')
    const slug = await params;
    const similarEvents : IEvent[] = await getSimilarEventsBySlug(slug);

    let event;
    try {
        const request  = await fetch(`${BASE_URL}/api/events/${slug}`, {next : {revalidate : 60}});
        if(!request.ok) {
            if(request.status === 404) return notFound();
            throw new Error("failed to fetch event :" + request.statusText)
        }

        const response = await request.json()
        event = response.event;

        if(!event) return notFound();

    } catch (error) {
        console.error("Error fetching event : " + error);
        return notFound()
    }

    const {_id, description, image, overview, date, time, location, mode, agenda, audience, tags, organizer} = event;


    
    return (
        <section id="event">
            <div className="header">
                <h1>Event Description</h1>
                <p>{description}</p>
            </div>

            <div className="details">
            {/*  Left side : Event content */}
                <div className="content">
                    <Image src={image} alt="Event Banner" height={800} width={800} className="banner"/>
                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>
                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="time" label={time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="location" label={location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
                    </section>

                    <EventAgenda agenda={agenda} />

                    <section className="flex-col-gap-2">
                        <h2>About The Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    <EventTags tags={tags} />

                    <div className="flex flex-col gap-4 pt-20 w-full">
                        <h2>Similar Event</h2>
                        <div className="events">
                            {similarEvents.length > 0 && similarEvents.map((item) => (
                                <EventCard {...item} key={item.title} />
                            ))}
                        </div>
                    </div>
                </div>
            {/*  Right side : Booking form */}
                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book Your Spot</h2>
                        {
                            bookings > 0 ? (
                                <p className="text-sm">
                                    Join {bookings} people who have already booked their spot !
                                </p>
                            ) : (
                                <p className="text-sm">
                                    Be the first to book your spot !
                                </p>
                            )
                        }
                        <BookEvent eventId={_id} slug={slug}/>
                    </div>

                </aside>
            </div>

        </section>
    )
}


const EventDetailItem = ({icon, alt, label} : {icon : string, alt : string, label : string }) => (
    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} height={17} width={17} />
        <p>{label}</p>
    </div>
)

const EventAgenda = ({agenda} : {agenda : string[]}) => (
    <div className="agenda">
        <h2>Agenda</h2>
        <ul>
            {
                agenda.map((item) => <li key={item} >{item}</li>)
            }
        </ul>
    </div>
)

const EventTags = ({tags}: { tags: string[] }) => (
    <div className="flex flex-row gap-1.5 flex-wrap">
        {
            tags.map((tag) => (
                <div key={tag} className="pill">{tag}</div>
            ))
        }
    </div>
)

export default EventDetails