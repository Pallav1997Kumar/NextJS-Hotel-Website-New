'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

import styles from './CurrentDiningRoomEventPage.module.css';

import { ROOMS_SUITES_BOOKING_INFO_IS_PRESENT, ROOMS_SUITES_BOOKING_INFO_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";
import EachAdminRoomBookingInfo from "@/components/Admin Booking Information Component/Rooms Suites Booking/EachAdminRoomBookingInfo.jsx";
import { useAppSelector, useAppDispatch } from "@/redux store/hooks.js";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";


function CurrentRoomsSuitesBookingPage(){

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
            const loginPageCalledFrom = 'Admin Current Rooms Suites Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }

        if(loginUserDetails != null && !loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            const loginPageCalledFrom = 'Admin Current Rooms Suites Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }
    }, [loginUserDetails, router, dispatch]);
    

    const [loadingBookingDetails, setLoadingBookingDetails] = useState(true);

    const [roomSuitesBooking, setRoomSuitesBooking] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(function(){
        if(loginUserDetails != null && loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            fetchRoomSuiteBookingDb(currentPage);
        }
    }, []);

    async function fetchRoomSuiteBookingDb(page = 1) {
        try {
            const response = await fetch(`/api/view-current-booking/rooms-suites?page=${page}`);
            const data = await response.json();
            console.log(data);
            
            if(response.status === 200){
                if(data.message === ROOMS_SUITES_BOOKING_INFO_IS_EMPTY){
                    const roomSuitesBookingDb = [];
                    setRoomSuitesBooking(roomSuitesBookingDb);
                    setTotalPages(1);
                }
                else if(data.message === ROOMS_SUITES_BOOKING_INFO_IS_PRESENT){
                    const roomSuitesBookingDb = data.roomSuitesBookingInfo;
                    setRoomSuitesBooking(roomSuitesBookingDb);
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
                    <Link href="/admin-home-page/view-current-bookings/rooms-suites"> 
                        <span className={styles.breadcrumbsLink}> ROOMS AND SUITES BOOKING </span>
                    </Link>
                </p>
            </div>

            {(loadingBookingDetails && (loginUserDetails != null && loginUserDetails.emailAddress.endsWith("@royalpalace.co.in"))) &&
                <div className={styles.loadingBookingDetails}>
                    <p> LOADING ROOMS AND SUITES BOOKING DETAILS...</p>
                </div>
            }

            {(loginUserDetails != null && loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")) &&
            <div className={styles.diningRoomsEventContainer}>
                {(!loadingBookingDetails && roomSuitesBooking !== null && roomSuitesBooking.length == 0) &&
                    <div className={styles.emptyBooking}>
                        <p>There are no Current or Future Upcoming Rooms and Suites Bookings</p>
                    </div>
                }

                {(!loadingBookingDetails && roomSuitesBooking !== null && roomSuitesBooking.length > 0) &&
                    <div>
                        {roomSuitesBooking.map(function(eachRoomSuitesBookingInfo){
                            const roomSuitesBookingInfo =  eachRoomSuitesBookingInfo.bookingInfo; 
                            return (
                                <EachAdminRoomBookingInfo 
                                    eachRoomBookingInfo={roomSuitesBookingInfo} 
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


export default CurrentRoomsSuitesBookingPage;