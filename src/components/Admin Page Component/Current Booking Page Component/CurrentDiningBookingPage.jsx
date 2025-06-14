'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

import styles from './CurrentDiningRoomEventPage.module.css';

import { 
    DINING_BOOKING_INFO_IS_PRESENT, 
    DINING_BOOKING_INFO_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants.js";
import { useAppSelector, useAppDispatch } from "@/redux store/hooks.js";
import { 
    updateLoginPageCalledFrom, 
    updateLoginRedirectPage 
} from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice.js";
import EachAdminDiningBookingInfo from "@/components/Admin Booking Information Component/Dining Booking/EachAdminDiningBookingInfo.jsx";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary.jsx";


function CurrentDiningBookingPage(){
    return (
        <ErrorBoundary>
            <CurrentDiningBookingPageFunctionalComponent />
        </ErrorBoundary>
    );
}


function CurrentDiningBookingPageFunctionalComponent(){

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
            const loginPageCalledFrom = 'Admin Current Dining Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }

        if(loginUserDetails != null && 
            !loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            const loginPageCalledFrom = 'Admin Current Dining Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }
    }, [loginUserDetails, router, dispatch]);
    

    const [loadingBookingDetails, setLoadingBookingDetails] = useState(true);

    const [diningBooking, setDiningBooking] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(function(){
        if(loginUserDetails != null && 
            loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            fetchDiningBookingDb(currentPage);
        }
    }, []);

    async function fetchDiningBookingDb(page = 1) {
        try {
            const response = await fetch(`/api/view-current-booking/dining?page=${page}`);
            const data = await response.json();
            console.log(data);
            
            if(response.status === 200){
                if(data.message === DINING_BOOKING_INFO_IS_EMPTY){
                    const diningBookingDb = [];
                    setDiningBooking(diningBookingDb);
                    setTotalPages(1);
                }
                else if(data.message === DINING_BOOKING_INFO_IS_PRESENT){
                    const diningBookingDb = data.diningBookingInfo;
                    setDiningBooking(diningBookingDb);
                    setTotalPages(data.pagination.totalPages || 1);
                }
            }
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoadingBookingDetails(false);
        }
    }


    // Pagination handlers
    function goToPrevPage() {
        setCurrentPage(function(prev) {
            return Math.max(prev - 1, 1);
        });
    }

    function goToNextPage() {
        setCurrentPage(function(prev) {
            return Math.min(prev + 1, totalPages);
        });
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
                    <Link href="/admin-home-page"> 
                        <span className={styles.breadcrumbsLink}> ADMIN HOME PAGE </span>
                    </Link>
                    <span>{'>>'}</span> 
                    <Link href="/admin-home-page/view-current-bookings"> 
                        <span className={styles.breadcrumbsLink}> VIEW CURRENT OR UPCOMING BOOKINGS </span>
                    </Link>
                    <span>{'>>'}</span>
                    <Link href="/admin-home-page/view-current-bookings/dining"> 
                        <span className={styles.breadcrumbsLink}> DINING BOOKING </span>
                    </Link>
                </p>
            </div>

            {(loadingBookingDetails && 
                (loginUserDetails != null && 
                    loginUserDetails.emailAddress.endsWith("@royalpalace.co.in"))) &&
                <div className={styles.loadingBookingDetails}>
                    <p> LOADING DINING BOOKING DETAILS...</p>
                </div>
            }

            {(loginUserDetails != null && 
                loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")) &&
            <div className={styles.diningRoomsEventContainer}>
                {(!loadingBookingDetails && 
                    diningBooking !== null && diningBooking.length == 0) &&
                    <div className={styles.emptyBooking}>
                        <p>There are no Current or Future Upcoming Dining Bookings</p>
                    </div>
                }

                {(!loadingBookingDetails && 
                    diningBooking !== null && diningBooking.length > 0) &&
                    <div>
                        {diningBooking.map(function(eachDiningBookingInfo){
                            const diningBookingInfo =  eachDiningBookingInfo.bookingInfo; 
                            return (
                                <EachAdminDiningBookingInfo 
                                    eachDiningBookingInfo={diningBookingInfo} 
                                />
                            );
                        })}

                        {/* Pagination controls */}
                        <div className={styles.paginationContainer}>
                            <Button onClick={goToPrevPage} variant="contained" disabled={currentPage === 1}>
                                Prev
                            </Button>
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button onClick={goToNextPage} variant="contained" disabled={currentPage === totalPages}>
                                Next
                            </Button>
                        </div>
                    </div>
                }
            </div>
            }

        </div>
    );

}


export default CurrentDiningBookingPage;