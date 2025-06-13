import { NextRequest, NextResponse } from "next/server";
import DiningBookingInfo from "@/database models/booking models/dining models/diningBookingInfo.js";

import Connection from "@/database config/config.js";

import { INTERNAL_SERVER_ERROR } from "@/constant string files/apiErrorMessageConstants.js";
import { DINING_BOOKING_INFO_IS_PRESENT, DINING_BOOKING_INFO_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";


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
        const totalCountAgg = await DiningBookingInfo.aggregate([
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

            
        const bookingDiningUser = await DiningBookingInfo.aggregate([
            {
                $match: {
                    tableBookingDate: { $gte: currentIstDate }
                }
            },
            { 
                $sort: { 
                    tableBookingDate: 1 
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
                    bookingInfo: {
                        _id: "$_id",
                        customerId: "$customerId",
                        transactionId: "$transactionId",
                        diningRestaurantTitle: "$diningRestaurantTitle",
                        tableBookingDate: "$tableBookingDate",
                        noOfGuests: "$noOfGuests",
                        mealType: "$mealType",
                        tableBookingTime: "$tableBookingTime",
                        tableBookingCountDetails: "$tableBookingCountDetails",
                        priceForBooking: "$priceForBooking",
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
    
            
        if(bookingDiningUser){
            if(bookingDiningUser.length > 0){
                return NextResponse.json(
                    { 
                        message: DINING_BOOKING_INFO_IS_PRESENT, 
                        diningBookingInfo: bookingDiningUser,
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
                    { message: DINING_BOOKING_INFO_IS_EMPTY },
                    { status: 200 }
                );
            }
        }
        else{
            return NextResponse.json(
                { message: DINING_BOOKING_INFO_IS_EMPTY },
                { status: 200 }
            );
        }
        
    }
    catch (error) {
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}


export { GET };