import { NextRequest, NextResponse } from "next/server";
import SingleDateBookingInfo from "@/database models/booking models/events meetings models/singleDateBookingInfo.js";
import NonContinousMultipleDatesBookingInfo from "@/database models/booking models/events meetings models/nonContinousMultipleDatesBookingInfo.js";
import ContinousMultipleDatesBookingInfo from "@/database models/booking models/events meetings models/continousMultipleDatesBookingInfo.js";

import Connection from "@/database config/config.js";

import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT, EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";

Connection();


async function GET(NextRequest){
    try {

        const currentDate = new Date();
        const options = { timeZone: 'Asia/Kolkata' };
        const currentIstDate = new Date(currentDate.toLocaleString('en-US', options));

        // === 1. Fetch and prepare all bookings from 3 collections ===

        // Single Date
        const eventMeetingSingleDateBookingInfo = await SingleDateBookingInfo.aggregate([
            {
                $match: {
                    meetingEventBookingDate: { $gte: currentIstDate }
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
                    meetingEventEndBookingDate: { $gte: currentIstDate }
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
                    "allDatesBookingInformation.meetingEventBookingDate": { $gte: currentIstDate }
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
        const combinedEventMeetingBookingsInfo = [
            ...eventMeetingSingleDateBookingInfo,
            ...eventMeetingMultipleContinousDatesBookingInfo,
            ...eventMeetingMultipleNonContinousDatesBookingInfo
        ];

        // === 3. Sort by sortDate (ascending)
        combinedEventMeetingBookingsInfo.sort(function(a, b){
            return new Date(a.sortDate) - new Date(b.sortDate);
        });

        const totalEventMeetingBookingCount = combinedEventMeetingBookingsInfo.length;

        if (totalEventMeetingBookingCount === 0) {
            return NextResponse.json(
                { message: EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY },
                { status: 200 }
            );
        }

        const combinedSanitizedEventMeetingBookingsInfo = combinedEventMeetingBookingsInfo.map(function(booking){
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
                message: EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT,
                eventMeetingBookingInfo: combinedSanitizedEventMeetingBookingsInfo,
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