'use client';

import Image from "next/image";

function ExploreBtn() {
  return (
    <button type="button" id="explore-btn" className="mx-auto mt-7"  onClick={() => console.log("BTN Clicked !")}>
        <a href="#events">
            Explore Events
            <Image src="icons/arrow-down.svg" alt="arrow-down" width={20} height={20}/>
        </a>
    </button>
  )
}

export default ExploreBtn