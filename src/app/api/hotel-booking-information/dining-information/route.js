import { NextRequest, NextResponse } from "next/server";
import dining from "@/json objects/dining.js"

function GET(){
    console.log("dining: " + dining);
    return NextResponse.json(
        {dining}
    );
    
}

export { GET };