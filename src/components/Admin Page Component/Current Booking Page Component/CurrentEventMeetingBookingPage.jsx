'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

import styles from './CurrentDiningRoomEventPage.module.css';

import { EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT, EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";
import EachAdminEventMeetingBookingInfo from "@/components/Admin Booking Information Component/Event Meeting Booking/EachAdminEventMeetingBookingInfo.jsx";
import { useAppSelector, useAppDispatch } from "@/redux store/hooks.js";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";


function CurrentEventMeetingBookingPage(){

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
            const loginPageCalledFrom = 'Admin Current Event Meeting Rooms Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }
    
        if(loginUserDetails != null && !loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            const loginPageCalledFrom = 'Admin Current Event Meeting Rooms Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        } 
    }, [loginUserDetails, router, dispatch]);
    

    const [loadingBookingDetails, setLoadingBookingDetails] = useState(true);

    const [eventMeetingBooking, setEventMeetingBooking] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const BOOKINGS_PER_PAGE = 5;

    useEffect(function(){
        if(loginUserDetails != null && loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            fetchEventMeetingBookingDb();
        }
    }, []);

    async function fetchEventMeetingBookingDb() {
        try {
            const response = await fetch(`/api/view-current-booking/meeting-events`);
            const data = await response.json();
            console.log(data);
            
            if(response.status === 200){
                if(data.message === EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY){
                    const eventMeetingBookingDb = [];
                    setEventMeetingBooking(eventMeetingBookingDb);
                    setTotalPages(1);
                }
                else if(data.message === EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT){
                    const eventMeetingBookingDb = data.eventMeetingBookingInfo;
                    setEventMeetingBooking(eventMeetingBookingDb);
                    const total = Math.ceil(eventMeetingBookingDb.length / BOOKINGS_PER_PAGE);
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
    const currentPageBookings = Array.isArray(eventMeetingBooking) ? eventMeetingBooking.slice(indexOfFirstBooking, indexOfLastBooking) : [];


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
                    <Link href="/admin-home-page/view-current-bookings/events-meeting-room"> 
                        <span className={styles.breadcrumbsLink}> EVENT/ MEETING ROOMS BOOKING </span>
                    </Link>
                </p>
            </div>

            {(loadingBookingDetails && (loginUserDetails != null && loginUserDetails.emailAddress.endsWith("@royalpalace.co.in"))) &&
                <div className={styles.loadingBookingDetails}>
                    <p> LOADING EVENT/ MEETING ROOMS BOOKING DETAILS...</p>
                </div>
            }

            {(loginUserDetails != null && loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")) &&
            <div className={styles.diningRoomsEventContainer}>
                {(!loadingBookingDetails && eventMeetingBooking !== null && eventMeetingBooking.length == 0) &&
                    <div className={styles.emptyBooking}>
                        <p>There are no Current or Future Upcoming Events/ Meeting Room Bookings</p>
                    </div>
                }

                {(!loadingBookingDetails && eventMeetingBooking !== null && eventMeetingBooking.length > 0) &&
                    <div>
                        {currentPageBookings.map(function(eachEventMeetingRoomBookingInfo){
                            const eventMeetingBookingInfo =  eachEventMeetingRoomBookingInfo.bookingInfo; 
                            return (
                                <EachAdminEventMeetingBookingInfo 
                                    eachEventMeetingBookingInfo={eventMeetingBookingInfo} 
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


export default CurrentEventMeetingBookingPage;