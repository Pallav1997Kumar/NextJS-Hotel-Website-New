import { NextRequest, NextResponse } from "next/server";
import RoomsSuitesBookingInfo from "@/database models/booking models/room suites models/roomsSuitesBookingInfo.js";

import Connection from "@/database config/config.js";

import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { ROOMS_SUITES_BOOKING_INFO_IS_PRESENT, ROOMS_SUITES_BOOKING_INFO_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";

Connection();


async function GET(NextRequest){
    try {
        const url = new URL(NextRequest.url);
        const currentPageNumber = url.searchParams.get("page");
        const page = parseInt(currentPageNumber || "1", 10);
        const limit = 5;
        const skip = (page - 1) * limit;

        const currentDate = new Date();
        const options = { timeZone: 'Asia/Kolkata' };
        const currentIstDate = new Date(currentDate.toLocaleString('en-US', options));

        // Get total count of bookings (for pagination metadata)
        const totalCountAgg = await RoomsSuitesBookingInfo.aggregate([
            { 
                $match: { 
                    tableBookingDate: { $gte: currentIstDate } 
                } 
            },
            { $count: "totalCount" }
        ]);

        let totalCount;
        if (totalCountAgg.length > 0 && totalCountAgg[0].totalCount !== undefined) {
            totalCount = totalCountAgg[0].totalCount;
        } else {
            totalCount = 0;
        }

        const totalPages = Math.ceil(totalCount / limit);


        const roomSuiteUserBooking = await RoomsSuitesBookingInfo.aggregate([
            {
                $match: {
                    bookingCheckoutDate: { $gte: currentIstDate }
                }
            },
            { 
                $sort: { 
                    bookingCheckoutDate: 1 
                } 
            },
            { 
                $skip: skip 
            },
            { 
                $limit: limit 
            },
            {
                $lookup: {
                    from: 'hotelcustomerstransactions', // Ensure this matches the collection name in the database
                    localField: 'transactionId',
                    foreignField: '_id',
                    as: 'transactionDetails'
                }
            },
            {
                $unwind: {
                    path: '$transactionDetails',
                    preserveNullAndEmptyArrays: true // Optional, if you want to keep bookings without transactions
                }
            },
            {
                $lookup: {
                from: 'hotelcustomersusers', // Join with customer users
                localField: 'customerId',
                foreignField: '_id',
                as: 'customerDetails'
                }
            },
            {
                $unwind: {
                path: '$customerDetails',
                preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    //bookingInfo: "$$ROOT",
                    bookingInfo: {
                        _id: "$_id",
                        customerId: "$customerId",
                        transactionId: "$transactionId",
                        bookingRoomTitle: "$bookingRoomTitle",
                        bookingCheckinDate: "$bookingCheckinDate",
                        bookingCheckoutDate: "$bookingCheckoutDate",
                        totalRooms: "$totalRooms",
                        totalGuest: "$totalGuest",
                        guestRoomsDetails: "$guestRoomsDetails",
                        totalPriceOfAllRooms: "$totalPriceOfAllRooms",
                        transactionDetails: "$transactionDetails",
                        customerDetails: {
                            _id: "$customerDetails._id",
                            firstName: "$customerDetails.firstName",
                            middleName: "$customerDetails.middleName",
                            lastName: "$customerDetails.lastName",
                            fullName: "$customerDetails.fullName",
                            gender: "$customerDetails.gender",
                            dateOfBirth: "$customerDetails.dateOfBirth",
                            emailAddress: "$customerDetails.emailAddress",
                            contactNo: "$customerDetails.contactNo",
                            alternateContactNo: "$customerDetails.alternateContactNo",
                            accountBalance: "$customerDetails.accountBalance"
                        }
                    }
                }
            }
        ]);

        if(roomSuiteUserBooking){
                
            if(roomSuiteUserBooking.length > 0){
                return NextResponse.json(
                    { 
                        message: ROOMS_SUITES_BOOKING_INFO_IS_PRESENT, 
                        roomSuitesBookingInfo: roomSuiteUserBooking,
                        pagination: {
                            totalCount,
                            totalPages,
                            currentPage: page,
                            limit
                        } 
                    },
                    { status: 200 }
                );
            }
            else{
                return NextResponse.json(
                    { message: ROOMS_SUITES_BOOKING_INFO_IS_EMPTY },
                    { status: 200 }
                );
            }
        }
        else{
            return NextResponse.json(
                { message: ROOMS_SUITES_BOOKING_INFO_IS_EMPTY },
                { status: 200 }
            );
        }
        
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { GET }