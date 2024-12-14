import { NextRequest, NextResponse } from "next/server";
import HotelCustomersUsers from "@/database models/hotelCustomersUsers.js";
import HotelCustomersTransaction from "@/database models/hotelCustomersTransaction.js";
import Connection from "@/database config/config.js";
import { INTERNAL_SERVER_ERROR, USER_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { SUCCESSFUL_AMOUNT_DEDUCT_ROOMS_SUITES_DINING_EVENT_MEETING_ROOM_TRANSACTION } from "@/constant string files/apiSuccessMessageConstants.js";

Connection();

async function POST(NextRequest){
    try{
        const body = await NextRequest.json();
        const transactionInfo = body;

        const customerId = transactionInfo.customerId;
        const allComponentTotalBookingAmount = transactionInfo.deductionAmount;

        const hotelUser = await HotelCustomersUsers.findById(customerId);

        if(hotelUser){
            const transactionAmount = allComponentTotalBookingAmount; 
            const transactionType = 'Money Deducted From Account';
            const transactionDescription = 'Money Deducted From Account By All Events i.e. Dining, Rooms Suites and Event Meeting Room Booking';
            const transactionDateTime = new Date();
            const beforeAccountBalance = hotelUser.accountBalance;
            const updatedAccountBalance = Number(beforeAccountBalance) - Number(allComponentTotalBookingAmount);
            const newTransactionAmountDeduct = new HotelCustomersTransaction({
                customerId,
                transactionAmount,
                transactionType,
                transactionDescription,
                transactionDateTime,
                updatedAccountBalance
            });
            await newTransactionAmountDeduct.save();
            const transactionId = newTransactionAmountDeduct._id;
            return NextResponse.json(
                { message: SUCCESSFUL_AMOUNT_DEDUCT_ROOMS_SUITES_DINING_EVENT_MEETING_ROOM_TRANSACTION, transactionId },
                { status: 200 }
            );
        }
        else{
            return NextResponse.json(
                { errorMessage: USER_NOT_FOUND },
                { status: 404 }
            );
        }

    }
    catch(error){
        console.log('src/app/api/account-balance-user/add-transaction-amount-deduct-account/all-types-transaction/route.js')
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { POST }