
// import events from "@/lib/constants";

import Home from "@/components/Home"
import { Suspense } from "react"


async function HomePage() {
    return (
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Home />
        </Suspense>
      </main>
    )
}

export default HomePage