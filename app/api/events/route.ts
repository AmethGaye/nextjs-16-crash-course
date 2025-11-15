import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import {Event} from "@/database/index";
import {v2 as cloudinary} from "cloudinary";

export async function POST (req : NextRequest) {
    try {
        await connectDB();
        const formData = await req.formData();
        // console.log(formData);

        let event;
        try {
            event = Object.fromEntries(formData.entries());
        }catch(e) {
            return NextResponse.json({message : "Invalid JSON data format"}, {status : 400});
        }

        const file = formData.get("image") as File;

        if(!file) {
            return NextResponse.json({message : "image file is required"}, {status : 400})
        }

        let tags = JSON.parse(formData.get("tags") as string);
        let agenda = JSON.parse(formData.get("agenda") as string);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({resource_type : "image", folder: "DevEvent"}, (err, result ) => {
                if (err) reject(err);
                resolve(result);
            }).end(buffer);
        });

        event.image = (uploadResult as {secure_url : string}).secure_url;




        const eventCreated = await Event.create({
            ...event,
            tags,
            agenda,
        });
        return NextResponse.json({message : "Event created successfully.", event : eventCreated}, {status : 201});
    }catch (e) {
        console.error(e);
        return NextResponse.json({message : "event creation error field", error : e instanceof Error ? e.message : "UNKNOWN"}, {status : 500} );
    }
}

export async function GET () {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({message : "Event fetched successfully.", events : events});
    } catch (e) {
        return NextResponse.json({message : "fetching data failed !", error : e}, {status : 500})
    }
}