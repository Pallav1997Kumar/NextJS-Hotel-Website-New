import { NextRequest, NextResponse } from "next/server";
import SingleDateBookingInfo from "@/database models/booking models/events meetings models/singleDateBookingInfo.js";
import NonContinousMultipleDatesBookingInfo from "@/database models/booking models/events meetings models/nonContinousMultipleDatesBookingInfo.js";
import ContinousMultipleDatesBookingInfo from "@/database models/booking models/events meetings models/continousMultipleDatesBookingInfo.js";
import DiningBookingInfo from "@/database models/booking models/dining models/diningBookingInfo.js";
import RoomsSuitesBookingInfo from "@/database models/booking models/room suites models/roomsSuitesBookingInfo.js";

import Connection from "@/database config/config.js";

import { INTERNAL_SERVER_ERROR } from "@/constant string files/apiErrorMessageConstants.js";
import { DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_PRESENT, DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";


Connection();


async function GET(NextRequest){
    try {

        const currentDate = new Date();
        const options = { timeZone: 'Asia/Kolkata' };
        const currentIstDate = new Date(currentDate.toLocaleString('en-US', options));

        // === 1. Fetch and prepare all bookings from 3 collections ===

        //Dining 
        const diningBookingInfo = await DiningBookingInfo.aggregate([
            {
                $match: {
                    tableBookingDate: { $lt: currentIstDate }
                }
            },
            {
                $addFields: {
                    sortDate: "$tableBookingDate"
                }
            },
            {
                $lookup: {
                    from: "hotelcustomerstransactions",
                    localField: "transactionId",
                    foreignField: "_id",
                    as: "transactionDetails"
                }
            },
            {
                $unwind: {
                    path: "$transactionDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "hotelcustomersusers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerDetails"
                }
            },
            {
                $unwind: {
                    path: "$customerDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    bookingInfo: "$$ROOT",
                    sortDate: 1
                }
            }
        ]);
        
        
        //Rooms and Suites
        const roomsSuitesBookingInfo = await RoomsSuitesBookingInfo.aggregate([
            {
                $match: {
                    bookingCheckoutDate: { $lt: currentIstDate }
                }
            },
            {
                $addFields: {
                    sortDate: "$bookingCheckoutDate"
                }
            },
            {
                $lookup: {
                    from: "hotelcustomerstransactions",
                    localField: "transactionId",
                    foreignField: "_id",
                    as: "transactionDetails"
                }
            },
            {
                $unwind: {
                    path: "$transactionDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "hotelcustomersusers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerDetails"
                }
            },
            {
                $unwind: {
                    path: "$customerDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    bookingInfo: "$$ROOT",
                    sortDate: 1
                }
            }
        ]);


        // Single Date
        const eventMeetingSingleDateBookingInfo = await SingleDateBookingInfo.aggregate([
            {
                $match: {
                    meetingEventBookingDate: { $lt: currentIstDate }
                }
            },
            {
                $addFields: {
                    sortDate: "$meetingEventBookingDate"
                }
            },
            {
                $lookup: {
                    from: "hotelcustomerstransactions",
                    localField: "transactionId",
                    foreignField: "_id",
                    as: "transactionDetails"
                }
            },
            {
                $unwind: {
                    path: "$transactionDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "hotelcustomersusers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerDetails"
                }
            },
            {
                $unwind: {
                    path: "$customerDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    bookingInfo: "$$ROOT",
                    sortDate: 1
                }
            }
        ]);

        // Continous Dates
        const eventMeetingMultipleContinousDatesBookingInfo = await ContinousMultipleDatesBookingInfo.aggregate([
            {
                $match: {
                    meetingEventEndBookingDate: { $lt: currentIstDate }
                }
            },
            {
                $addFields: {
                    sortDate: "$meetingEventEndBookingDate"
                }
            },
            {
                $lookup: {
                    from: "hotelcustomerstransactions",
                    localField: "transactionId",
                    foreignField: "_id",
                    as: "transactionDetails"
                }
            },
            {
                $unwind: {
                    path: "$transactionDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "hotelcustomersusers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerDetails"
                }
            },
            {
                $unwind: {
                    path: "$customerDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    bookingInfo: "$$ROOT",
                    sortDate: 1
                }
            }
        ]);

        // Non-Continous Dates
        const eventMeetingMultipleNonContinousDatesBookingInfo = await NonContinousMultipleDatesBookingInfo.aggregate([
            {
                $match: {
                    "allDatesBookingInformation.meetingEventBookingDate": { $lt: currentIstDate }
                }
            },
            {
                $addFields: {
                    sortDate: { $min: "$allDatesBookingInformation.meetingEventBookingDate" }
                }
            },
            {
                $lookup: {
                    from: "hotelcustomerstransactions",
                    localField: "transactionId",
                    foreignField: "_id",
                    as: "transactionDetails"
                }
            },
            {
                $unwind: {
                    path: "$transactionDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "hotelcustomersusers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerDetails"
                }
            },
            {
                $unwind: {
                    path: "$customerDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    bookingInfo: "$$ROOT",
                    sortDate: 1
                }
            }
        ]);


        // === 2. Combine all bookings ===
        const combinedDiningRoomsSuitesEventMeetingBookingsInfo = [
            ...diningBookingInfo,
            ...roomsSuitesBookingInfo,
            ...eventMeetingSingleDateBookingInfo,
            ...eventMeetingMultipleContinousDatesBookingInfo,
            ...eventMeetingMultipleNonContinousDatesBookingInfo
        ];

        // === 3. Sort by sortDate (ascending)
        combinedDiningRoomsSuitesEventMeetingBookingsInfo.sort(function(a, b){
            return new Date(b.sortDate) - new Date(a.sortDate);
        });

        const totalDiningRoomsSuitesEventMeetingBookingCount = combinedDiningRoomsSuitesEventMeetingBookingsInfo.length;

        if (totalDiningRoomsSuitesEventMeetingBookingCount === 0) {
            return NextResponse.json(
                { message: DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_EMPTY },
                { status: 200 }
            );
        }

        const combinedSanitizedDiningRoomsSuitesEventMeetingBookingsInfo = combinedDiningRoomsSuitesEventMeetingBookingsInfo.map(function(booking){
            const sanitizedBooking = { ...booking };

            // Remove top-level sortDate
            delete sanitizedBooking.sortDate;

            // Remove password and sortDate from customerDetails
            if (sanitizedBooking.bookingInfo?.customerDetails) {
                const { password, sortDate, ...safeCustomerDetails } = sanitizedBooking.bookingInfo.customerDetails;
                sanitizedBooking.bookingInfo.customerDetails = safeCustomerDetails;
            }

            // Remove sortDate from bookingInfo as well
            if (sanitizedBooking.bookingInfo?.sortDate) {
                delete sanitizedBooking.bookingInfo.sortDate;
            }

            return sanitizedBooking;
        });


        return NextResponse.json(
            {
                message: DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_PRESENT,
                diningRoomsSuitesEventMeetingBookingInfo: combinedSanitizedDiningRoomsSuitesEventMeetingBookingsInfo,
            },
            { status: 200 }
        );


    } 
    catch (error) {
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { GET }