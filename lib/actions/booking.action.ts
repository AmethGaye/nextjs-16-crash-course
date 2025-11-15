'use server';
import connectDB from '../mongodb';

import { Booking } from '@/database';

export const CreateBooking = async ({eventId, slug, email} : {eventId : string; slug : string; email : string}) => {
  try {
    await connectDB();
    await Booking.create({eventId, slug, email});

    return {success : true};

  } catch(e) {
    console.error("create booking failed !");
    return {success : false}
  }
}
