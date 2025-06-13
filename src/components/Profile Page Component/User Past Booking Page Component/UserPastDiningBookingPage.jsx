'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import styles from './UserPastDiningRoomEventPage.module.css';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";
import { DINING_BOOKING_INFO_IS_PRESENT, DINING_BOOKING_INFO_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";
import UserDiningBookingComponent from "@/components/User Booking Component/UserDiningBookingComponent.jsx";


function UserPastDiningBookingPage(){
    
    const dispatch = useAppDispatch();
    const router = useRouter();

    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    useEffect(function() {
        if (loginUserDetails == null) {
            const loginPageCalledFrom = 'My Cart Page';
            const loginRedirectPage = '/profile-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/login');
        }
    }, [loginUserDetails, dispatch, router]);

    if(loginUserDetails == null){
        return null;
    }
    
    const loginUserId = loginUserDetails.userId;

    const [loadingBookingDetails, setLoadingBookingDetails] = useState(true);

    const [diningBooking, setDiningBooking] = useState(null);

    useEffect(()=>{
        fetchDiningBookingDb(loginUserId);
    }, []);


    async function fetchDiningBookingDb(loginUserId) {
        try {
            const response = await fetch(`/api/view-past-booking/dining/${loginUserId}`);
            const data = await response.json();
            if(response.status === 200){
                if(data.message === DINING_BOOKING_INFO_IS_EMPTY){
                    const diningBookingDb = [];
                    setDiningBooking(diningBookingDb);
                }
                else if(data.message === DINING_BOOKING_INFO_IS_PRESENT){
                    const diningBookingDb = data.diningBookingInfo;
                    setDiningBooking(diningBookingDb);
                }
            }
        } catch (error) {
            console.log(error);
        }
        finally{
            setLoadingBookingDetails(false);
        }
    }



    return (
        <div>
            <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />

            <div className={styles.breadcrumbsContainer}>
                <p>
                    <Link href="/">
                        <span className={styles.breadcrumbsLink}> HOME </span>
                    </Link> 
                    <span>{'>>'}</span> 
                    <Link href="/profile-home-page"> 
                        <span className={styles.breadcrumbsLink}> PROFILE PAGE </span>
                    </Link>
                    <span>{'>>'}</span> 
                    <Link href={`/profile-home-page/view-past-bookings/${loginUserId}`}> 
                        <span className={styles.breadcrumbsLink}> VIEW PAST BOOKINGS </span>
                    </Link>
                    <span>{'>>'}</span>
                    <Link href={`/profile-home-page/view-past-bookings/dining/${loginUserId}`}> 
                        <span className={styles.breadcrumbsLink}> DINING BOOKING </span>
                    </Link>
                </p>
            </div>

            {loadingBookingDetails &&
                <div className={styles.loadingBookingDetails}>
                    <p> LOADING DINING BOOKING DETAILS...</p>
                </div>
            }

            <div className={styles.diningRoomsEventContainer}>
                {(!loadingBookingDetails && diningBooking !== null && diningBooking.length == 0) &&
                    <div className={styles.emptyBooking}>
                        <p>You do not have any Past Dining Bookings</p>
                    </div>
                }

                {(!loadingBookingDetails && diningBooking !== null && diningBooking.length > 0) &&
                    <UserDiningBookingComponent diningBookingInfo={diningBooking} />
                }
            </div>

        </div>
    );

}


export default UserPastDiningBookingPage;