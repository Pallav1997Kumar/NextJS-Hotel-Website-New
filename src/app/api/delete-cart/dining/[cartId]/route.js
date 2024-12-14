import { NextRequest, NextResponse } from 'next/server';
import DiningCartInfo from "@/database models/booking models/dining models/diningCartInfo.js";
import Connection from "@/database config/config.js";
import { INTERNAL_SERVER_ERROR, CART_ID_NOT_FOUND } from "@/constant string files/apiErrorMessageConstants.js";
import { ITEM_SUCCESSFULLY_DELETED_FROM_CART } from "@/constant string files/apiSuccessMessageConstants.js";


Connection();

async function DELETE(NextRequest, context){
    try {
        const params = context.params;
        const cartId = params.cartId;

        const cartInformation = await DiningCartInfo.findById(cartId);
        if(cartInformation){
            await DiningCartInfo.findByIdAndDelete(cartId);
            return NextResponse.json(
                { message: ITEM_SUCCESSFULLY_DELETED_FROM_CART }, 
                { status: 200 }
            );
        }
        else{
            return NextResponse.json(
                { errorMessage: CART_ID_NOT_FOUND }, 
                { status: 404 }
            );
        }
    } 
    catch (error) {
        console.log('src/app/api/delete-cart/dining/[cartId]/route.js');
        console.log(error);
        return NextResponse.json(
            { errorMessage: INTERNAL_SERVER_ERROR }, 
            { status: 500 }
        );
    }
}

export { DELETE }