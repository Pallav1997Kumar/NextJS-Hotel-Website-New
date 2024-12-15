import { NextRequest, NextResponse } from "next/server";
import meetingEventsRooms from "@/json objects/meetingEventsRooms.js"

function GET(){
    
    console.log("meetingEventsRooms" + meetingEventsRooms);
    return NextResponse.json(
        {meetingEventsRooms}
    );
    
}

export { GET };