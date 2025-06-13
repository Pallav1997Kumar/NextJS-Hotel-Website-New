'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';

import styles from './PastAllBookingPage.module.css';

import { DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_PRESENT, DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";
import EachAdminEventMeetingBookingInfo from "@/components/Admin Booking Information Component/Event Meeting Booking/EachAdminEventMeetingBookingInfo.jsx";
import EachAdminDiningBookingInfo from "@/components/Admin Booking Information Component/Dining Booking/EachAdminDiningBookingInfo";
import EachAdminRoomBookingInfo from "@/components/Admin Booking Information Component/Rooms Suites Booking/EachAdminRoomBookingInfo";
import { useAppSelector, useAppDispatch } from "@/redux store/hooks.js";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";


function PastAllBookingPage(){

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

    if(loginUserDetails == null){
        const loginPageCalledFrom = 'Admin Past Dining, Rooms Suites and Event Meeting Rooms Page';
        const loginRedirectPage = '/admin-home-page';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/admin-login');
        return ;
    }
    
    if(loginUserDetails != null && !loginEmailAddress.endsWith("@royalpalace.co.in")){
        const loginPageCalledFrom = 'Admin Past Dining, Rooms Suites and Event Meeting Rooms Page';
        const loginRedirectPage = '/admin-home-page';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/admin-login');
        return ;
    }


    const [diningRoomSuiteEventMeetingBooking, setDiningRoomSuiteEventMeetingBooking] = useState(null);

    const [displayedDiningRoomSuiteEventMeetingBookings, setDiningRoomSuiteDisplayedEventMeetingBookings] = useState([]); 
    const [hasMore, setHasMore] = useState(true);
    const chunkSize = 5;
    const [nextIndex, setNextIndex] = useState(0);


    useEffect(function(){
        if(loginUserDetails != null && loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            fetchDiningRoomSuiteEventMeetingBookingDb();
        }
    }, []);

    async function fetchDiningRoomSuiteEventMeetingBookingDb() {
        try {
            const response = await fetch(`/api/view-past-booking`);
            const data = await response.json();
            console.log(data);
            
            if(response.status === 200){
                if(data.message === DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_EMPTY){
                    const diningRoomSuiteEventMeetingBookingDb = [];
                    setDiningRoomSuiteEventMeetingBooking(diningRoomSuiteEventMeetingBookingDb);
                    setHasMore(false);
                }
                else if(data.message === DINING_ROOMS_SUITES_EVENT_MEETING_BOOKING_INFO_IS_PRESENT){
                    const diningRoomSuiteEventMeetingBookingDb = data.diningRoomsSuitesEventMeetingBookingInfo;
                    setDiningRoomSuiteEventMeetingBooking(diningRoomSuiteEventMeetingBookingDb);
                    loadMoreDiningRoomSuiteEventMeetingBooking(diningRoomSuiteEventMeetingBookingDb, 0);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    function loadMoreDiningRoomSuiteEventMeetingBooking(diningRoomSuiteEventMeetingBookingInfo, startIndex){
        const endIndex = startIndex + chunkSize;
        const nextChunkDiningRoomSuiteEventMeetingInfo = diningRoomSuiteEventMeetingBookingInfo.slice(startIndex, endIndex);

        setDiningRoomSuiteDisplayedEventMeetingBookings(function(previousDisplayedDiningRoomSuiteEventMeeting){
            return [...previousDisplayedDiningRoomSuiteEventMeeting, ...nextChunkDiningRoomSuiteEventMeetingInfo];
        });
        setNextIndex(endIndex);

        if(endIndex >= diningRoomSuiteEventMeetingBookingInfo.length){
            setHasMore(false);
        }
    }

    function fetchNext(){
        setTimeout(function(){
            loadMoreDiningRoomSuiteEventMeetingBooking(diningRoomSuiteEventMeetingBooking, nextIndex);
        }, 1000);
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
                    <Link href="/admin-home-page/view-past-bookings"> 
                        <span className={styles.breadcrumbsLink}> VIEW CURRENT OR UPCOMING BOOKINGS </span>
                    </Link>
                </p>
            </div>


            {(loginUserDetails != null && loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")) &&
            <div className={styles.categoryBooking}>
                <h4>Category Wise Bookings</h4>
                <ol>
                    <li>
                        <Link href={"/admin-home-page/view-past-bookings/rooms-suites"}>
                            Rooms & Suites Booking
                        </Link>
                    </li>
                    <li>
                        <Link href={"/admin-home-page/view-past-bookings/dining"}>
                            Dining Booking
                        </Link>
                    </li>
                    <li>
                        <Link href={"/admin-home-page/view-past-bookings/events-meeting-room"}>
                            Events/ Meeting Rooms Booking
                        </Link>
                    </li>
                </ol>
            </div>
            }
                        

            {((diningRoomSuiteEventMeetingBooking != null && diningRoomSuiteEventMeetingBooking.length > 0 && displayedDiningRoomSuiteEventMeetingBookings.length > 0) && (loginUserDetails != null && loginUserDetails.emailAddress.endsWith("@royalpalace.co.in"))) &&
            <div className={styles.diningRoomsEventContainer}>
                <h3>PAST BOOKINGS</h3>
                <InfiniteScroll
                    dataLength={displayedDiningRoomSuiteEventMeetingBookings.length}
                    next={fetchNext}
                    hasMore={hasMore}
                    loader={<h4 className={styles.loaderMessage}>Loading more bookings...</h4>}
                    endMessage={<p className={styles.endMessageStyle}>No more Dining, Rooms/ Suites and Event/ Meeting Rooms Bookings</p>}
                >
                    {displayedDiningRoomSuiteEventMeetingBookings.map(function(eachDiningRoomSuiteEventMeetingRoomBookingInfo){
                        const eachBookingInfo =  eachDiningRoomSuiteEventMeetingRoomBookingInfo.bookingInfo; 
                        if(eachBookingInfo.diningRestaurantTitle){
                            const diningBookingInfo =  eachBookingInfo; 
                            return (
                                <EachAdminDiningBookingInfo 
                                    eachDiningBookingInfo={diningBookingInfo} 
                                />
                            );
                        }
                        if(eachBookingInfo.bookingRoomTitle){
                            const roomSuitesBookingInfo =  eachBookingInfo;  
                            return (
                                <EachAdminRoomBookingInfo 
                                    eachRoomBookingInfo={roomSuitesBookingInfo} 
                                />
                            );          
                        }
                        if(eachBookingInfo.meetingEventsInfoTitle){
                            const eventMeetingBookingInfo = eachBookingInfo;
                            return (
                                <EachAdminEventMeetingBookingInfo 
                                    eachEventMeetingBookingInfo={eventMeetingBookingInfo} 
                                />
                            );
                        }
                        
                    })}
                </InfiniteScroll>               
            </div>
            }
                        

        </div>
    );

}


export default PastAllBookingPage;