'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';

import styles from './CurrentAllBookingPage.module.css';

import {
  DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_PRESENT,
  DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_EMPTY
} from "@/constant string files/apiSuccessMessageConstants.js";
import EachAdminEventMeetingBookingInfo from "@/components/Admin Booking Information Component/Event Meeting Booking/EachAdminEventMeetingBookingInfo.jsx";
import EachAdminDiningBookingInfo from "@/components/Admin Booking Information Component/Dining Booking/EachAdminDiningBookingInfo.jsx";
import EachAdminRoomBookingInfo from "@/components/Admin Booking Information Component/Rooms Suites Booking/EachAdminRoomBookingInfo.jsx";
import { useAppSelector, useAppDispatch } from "@/redux store/hooks.js";
import { 
    updateLoginPageCalledFrom, 
    updateLoginRedirectPage
} from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice.js";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary.jsx";


function CurrentAllBookingPage(){
    return (
        <ErrorBoundary>
            <CurrentAllBookingPageFunctionalComponent />
        </ErrorBoundary>
    );
}


function CurrentAllBookingPageFunctionalComponent(){

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
            const loginPageCalledFrom = 'Admin Current Dining, Rooms Suites and Event Meeting Rooms Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }
        if(loginUserDetails != null && 
            !loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            const loginPageCalledFrom = 'Admin Current Dining, Rooms Suites and Event Meeting Rooms Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
        return ;
    }
    }, [loginUserDetails, router, dispatch])


    const [loadingBookingDetails, setLoadingBookingDetails] = useState(true);

    const [diningRoomSuiteEventMeetingBooking, setDiningRoomSuiteEventMeetingBooking] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const BOOKINGS_PER_PAGE = 5;

    useEffect(function() {
        if(loginUserDetails != null && 
            loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            fetchDiningRoomsSuitesEventMeetingBookingDb();
        }
    }, []);

    async function fetchDiningRoomsSuitesEventMeetingBookingDb() {
        try {
            const response = await fetch(`/api/view-current-booking`);
            const data = await response.json();
            console.log(data);
            
            if(response.status === 200){
                if(data.message === DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_EMPTY){
                    const diningRoomSuiteEventMeetingBookingDb = [];
                    setDiningRoomSuiteEventMeetingBooking(diningRoomSuiteEventMeetingBookingDb);
                    setTotalPages(1);
                }
                else if(data.message === DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_PRESENT){
                    const diningRoomSuiteEventMeetingBookingDb = data.diningRoomsSuitesEventMeetingBookingInfo;
                    setDiningRoomSuiteEventMeetingBooking(diningRoomSuiteEventMeetingBookingDb);
                    const total = Math.ceil(diningRoomSuiteEventMeetingBookingDb.length / BOOKINGS_PER_PAGE);
                    setTotalPages(total);
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

     // Get bookings for current page only
    const indexOfLastBooking = currentPage * BOOKINGS_PER_PAGE;
    const indexOfFirstBooking = indexOfLastBooking - BOOKINGS_PER_PAGE;
    const currentPageBookings = Array.isArray(diningRoomSuiteEventMeetingBooking) ? diningRoomSuiteEventMeetingBooking.slice(indexOfFirstBooking, indexOfLastBooking) : [];


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
                </p>
            </div>

            {(loginUserDetails != null && 
                loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")) &&
                <div className={styles.myBooking}>
                    <h2>CURRENT BOOKINGS</h2>

                    <div className={styles.categoryBooking}>
                        <h4>Category Wise Bookings</h4>
                        <ol>
                            <li>
                                <Link href={"/admin-home-page/view-current-bookings/rooms-suites"}>
                                    Rooms & Suites Booking
                                </Link>
                            </li>
                            <li>
                                <Link href={"/admin-home-page/view-current-bookings/dining"}>
                                    Dining Booking
                                </Link>
                            </li>
                            <li>
                                <Link href={"/admin-home-page/view-current-bookings/events-meeting-room"}>
                                    Events/ Meeting Rooms Booking
                                </Link>
                            </li>
                        </ol>
                    </div>


                    <div>
                        <h3>All Bookings</h3>

                        {loadingBookingDetails &&
                            <div className={styles.loadingBookingDetails}>
                                <p> LOADING DINING, ROOMS / SUITES  AND  EVENT/ MEETING ROOMS BOOKING DETAILS...</p>
                            </div>
                        }

                        <div className={styles.diningRoomsEventContainer}>
                            {(!loadingBookingDetails && diningRoomSuiteEventMeetingBooking !== null && diningRoomSuiteEventMeetingBooking.length == 0) &&
                                <div className={styles.emptyBooking}>
                                    <p>There are no Current or Future Upcoming Dining, Rooms/Suites and Events/ Meeting Room Bookings</p>
                                </div>
                            }

                            {(!loadingBookingDetails && 
                                diningRoomSuiteEventMeetingBooking !== null && 
                                diningRoomSuiteEventMeetingBooking.length > 0) &&
                                <div>
                                    {currentPageBookings.map(function(eachBookingInfo){
                                        const currentBookingInfo = eachBookingInfo.bookingInfo; 

                                        if(currentBookingInfo.diningRestaurantTitle){
                                            const diningBookingInfo =  currentBookingInfo; 
                                            return (
                                                <EachAdminDiningBookingInfo 
                                                    eachDiningBookingInfo={diningBookingInfo} 
                                                />
                                            );
                                        }
                                        if(currentBookingInfo.bookingRoomTitle){
                                            const roomSuitesBookingInfo =  currentBookingInfo; 
                                            return (
                                                <EachAdminRoomBookingInfo 
                                                    eachRoomBookingInfo={roomSuitesBookingInfo} 
                                                />
                                            );
                                        }
                                        if(currentBookingInfo.meetingEventsInfoTitle){
                                            const eventMeetingBookingInfo =  currentBookingInfo; 
                                            return (
                                                <EachAdminEventMeetingBookingInfo 
                                                    eachEventMeetingBookingInfo={eventMeetingBookingInfo} 
                                                />
                                            );
                                        }
                                        
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

                    </div>
                </div>
            }

        </div>
    );

}


export default CurrentAllBookingPage;