import { NextRequest, NextResponse } from 'next/server';
import HotelCustomersTransaction from "@/database models/hotelCustomersTransaction.js";
import Connection from "@/database config/config.js";
import { INTERNAL_SERVER_ERROR } from "@/constant string files/apiErrorMessageConstants.js";
import { TRANSACTION_HISTORY_FOUND, NO_TRANSACTION_HISTORY_FOUND } from "@/constant string files/apiSuccessMessageConstants.js";


Connection();

async function GET(NextRequest){
    try{

        const url = new URL(NextRequest.url);
        const currentPageNumber = url.searchParams.get("page");
        const page = parseInt(currentPageNumber || "1", 10);

        const totalCount = await HotelCustomersTransaction.countDocuments();

        const minElementsPerPage = Math.floor(totalCount/7);
        
        const limit = Math.min(minElementsPerPage, 10);
        const skip = (page - 1) * limit;   

        const transactionHistory = await HotelCustomersTransaction.aggregate([
            {
                $sort: {
                    transactionDateTime: -1,
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
                from: 'hotelcustomersusers', 
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
                    _id: "$_id",
                    customerId: "$customerId",
                    transactionAmount: "$transactionAmount",
                    transactionType: "$transactionType",
                    transactionDescription: "$transactionDescription",
                    transactionDateTime: "$transactionDateTime",
                    updatedAccountBalance: "$updatedAccountBalance",
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
        ]);
        
        if(transactionHistory){
            if(transactionHistory.length > 0){
                return NextResponse.json(
                    { 
                        message: TRANSACTION_HISTORY_FOUND, 
                        transactionHistory: transactionHistory,
                        pagination: {
                            currentPage: page,
                            totalPages: Math.ceil(totalCount / limit),
                            totalItems: totalCount,
                        },
                    },
                    { status: 200 }
                );
            }
            else{
                return NextResponse.json(
                    { message: NO_TRANSACTION_HISTORY_FOUND },
                    { status: 200 }
                );
            }
        }
        else{
            return NextResponse.json(
                { message: NO_TRANSACTION_HISTORY_FOUND },
                { status: 200 }
            );
        }
    }
    catch(error){
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { GET }