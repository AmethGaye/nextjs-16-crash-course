
// import events from "@/lib/constants";
import ExploreBtn from "@/components/ExploreBtn"
import EventCards from "@/components/EventCards"
import { Suspense } from "react"



async function HomePage() {
  
    return (
      <section>
        <h1 className= "text-center">The hub for Every Dev <br/> Event You Can&apos;t Miss</h1>
        <p className="text-center mt-5">Hackatons, Meetups, and Conferences, All in One Place</p>

        <ExploreBtn />

        <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>

          <Suspense fallback={<div>Loading...</div>}>
            <EventCards />
          </Suspense>
        </div>
      </section>
    )
}

export default HomePage