'use client'
import React, { useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import styles from "./AdminHomePage.module.css";

import { logout } from "@/redux store/features/Auth Features/loginUserDetailsSlice.js";
import { useAppSelector, useAppDispatch } from "@/redux store/hooks.js";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";


function AdminHomePage(){

    const dispatch = useAppDispatch();
    const router = useRouter();

    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    let loginUserId;
    let loginUserFullName;
    let loginEmailAddress;

    if(loginUserDetails != null){
        loginUserId = loginUserDetails.userId;
        loginEmailAddress = loginUserDetails.emailAddress;
        loginUserFullName = loginUserDetails.fullName;
    }

    useEffect(function(){
        if(loginUserDetails == null){
            const loginPageCalledFrom = 'Admin Home Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
        }
        if(loginUserDetails != null && !loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            const loginPageCalledFrom = 'Admin Home Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
        }
    }, [loginUserDetails, dispatch, router])


    async function logoutHandler() {
        try {
            const response = await fetch(`/api/users-authentication/admin-authentication/logout`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data = await response.json();
            if(response.status === 200){
                const loginPageCalledFrom = 'Admin Home Page';
                const loginRedirectPage = '/admin-home-page';
                dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
                dispatch(updateLoginRedirectPage(loginRedirectPage));
                router.push('/admin-login');
                dispatch(logout());
                localStorage.removeItem('loginUserDetails');
            }
        } catch (error) {
            
        }
    }
    

    return (
        <div className={styles.profileHomePage}>
            <h1>Welcome</h1>
            <h3>{loginUserFullName}</h3>
            
            <div className={styles.proileOptions}>
                <ul>
                    
                    <li>
                        <Link href={"/admin-home-page/view-current-bookings"}>
                            View Current Bookings
                        </Link>
                    </li>
                    
                    <li>
                    <Link href={"/admin-home-page/view-past-bookings"}>
                            View Past Bookings
                        </Link>
                    </li>
                    
                    <li onClick ={logoutHandler}>Logout</li>
                </ul>
            </div>
        </div>
    )
}


export default AdminHomePage;