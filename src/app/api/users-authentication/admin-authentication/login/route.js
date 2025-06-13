import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { INTERNAL_SERVER_ERROR, LOGIN_ERROR_MESSAGE } from "@/constant string files/apiErrorMessageConstants.js";
import { SUCCESSFUL_LOGIN } from "@/constant string files/apiSuccessMessageConstants.js";


const jwtSecretKey = process.env.JWT_SECRET_KEY;

const adminEmailPassword = [
    {
        adminId: "user01",
        adminEmail: "admin.userone@royalpalace.co.in",
        adminPassword: "Admin@User01",
        adminName: "Admin User 1"
    },
    {
        adminId: "user02",
        adminEmail: "admin.usertwo@royalpalace.co.in",
        adminPassword: "Admin@User02",
        adminName: "Admin User 2"
    },
    {
        adminId: "user03",
        adminEmail: "admin.userthree@royalpalace.co.in",
        adminPassword: "Admin@User03",
        adminName: "Admin User 3"
    },
    {
        adminId: "user04",
        adminEmail: "admin.userfour@royalpalace.co.in",
        adminPassword: "Admin@User04",
        adminName: "Admin User 4"
    }
];

async function POST(NextRequest){
    try{
        const body = await NextRequest.json();
        const { email, password } = body;

        const loginAdminEmail = adminEmailPassword.find(function(eachAdmin){
            return (eachAdmin.adminEmail === email);
        });

        if(loginAdminEmail){
            if(loginAdminEmail.adminPassword === password){
                const tokenData = {
                    id: loginAdminEmail.adminEmail,
                    emailAddress: loginAdminEmail.adminEmail
                };

                const loginUserDetails = {
                    userId: loginAdminEmail.adminEmail,
                    emailAddress: loginAdminEmail.adminEmail,
                    fullName: loginAdminEmail.adminName
                }
                const token = jwt.sign(tokenData, jwtSecretKey, { expiresIn: '1d' });
                const response =  NextResponse.json(
                    { message: SUCCESSFUL_LOGIN, loginUserDetails: loginUserDetails },
                    { status: 200 }
                );
                response.cookies.set('jwt-token', token, { httpOnly: true });
                return response; 
            }
            else{
                return NextResponse.json(
                    { errorMessage: LOGIN_ERROR_MESSAGE.INCORRECT_PASSWORD },
                    { status: 404 }
                );
            }
        }
        else {
            return NextResponse.json(
                { errorMessage: LOGIN_ERROR_MESSAGE.EMAIL_ADDRESS_DOES_NOT_EXIST },
                { status: 404 }
            );
        }
        
    }
    catch(error){
        console.log(error);
        return NextResponse.json({ error: INTERNAL_SERVER_ERROR }, { status: 500 })
    }
}

export { POST };