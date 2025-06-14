'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';

import styles from './PastDiningRoomEventPage.module.css';

import { 
    EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT, 
    EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants.js";
import EachAdminEventMeetingBookingInfo from "@/components/Admin Booking Information Component/Event Meeting Booking/EachAdminEventMeetingBookingInfo.jsx";
import { useAppSelector, useAppDispatch } from "@/redux store/hooks.js";
import { 
    updateLoginPageCalledFrom, 
    updateLoginRedirectPage 
} from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice.js";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary.jsx";


function PastEventMeetingBookingPage(){
    return(
        <ErrorBoundary>
            <PastEventMeetingBookingPageFunctionalComponent />
        </ErrorBoundary>
    );
}


function PastEventMeetingBookingPageFunctionalComponent(){

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
        const loginPageCalledFrom = 'Admin Current Event Meeting Rooms Page';
        const loginRedirectPage = '/admin-home-page';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/admin-login');
        return ;
    }
    
    if(loginUserDetails != null && 
        !loginEmailAddress.endsWith("@royalpalace.co.in")){
        const loginPageCalledFrom = 'Admin Current Event Meeting Rooms Page';
        const loginRedirectPage = '/admin-home-page';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/admin-login');
        return ;
    }


    const [eventMeetingBooking, setEventMeetingBooking] = useState(null);

    const [displayedEventMeetingBookings, setDisplayedEventMeetingBookings] = useState([]); 
    const [hasMore, setHasMore] = useState(true);
    const chunkSize = 5;
    const [nextIndex, setNextIndex] = useState(0);


    useEffect(function(){
        if(loginUserDetails != null && 
            loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            fetchEventMeetingBookingDb();
        }
    }, []);

    async function fetchEventMeetingBookingDb() {
        try {
            const response = await fetch(`/api/view-past-booking/meeting-events`);
            const data = await response.json();
            console.log(data);
            
            if(response.status === 200){
                if(data.message === EVENT_MEETING_ROOM_BOOKING_INFO_IS_EMPTY){
                    const eventMeetingBookingDb = [];
                    setEventMeetingBooking(eventMeetingBookingDb);
                    setHasMore(false);
                }
                else if(data.message === EVENT_MEETING_ROOM_BOOKING_INFO_IS_PRESENT){
                    const eventMeetingBookingDb = data.eventMeetingBookingInfo;
                    setEventMeetingBooking(eventMeetingBookingDb);
                    loadMoreEventMeetingBooking(eventMeetingBookingDb, 0);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    function loadMoreEventMeetingBooking(eventMeetingBookingInfo, startIndex){
        const endIndex = startIndex + chunkSize;
        const nextChunkEventMeetingInfo = eventMeetingBookingInfo.slice(startIndex, endIndex);

        setDisplayedEventMeetingBookings(function(previousDisplayedEventMeeting){
            return [...previousDisplayedEventMeeting, ...nextChunkEventMeetingInfo];
        });
        setNextIndex(endIndex);

        if(endIndex >= eventMeetingBookingInfo.length){
            setHasMore(false);
        }
    }

    function fetchNext(){
        setTimeout(function(){
            loadMoreEventMeetingBooking(eventMeetingBooking, nextIndex);
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
                        <span className={styles.breadcrumbsLink}> VIEW PAST BOOKINGS </span>
                    </Link>
                    <span>{'>>'}</span>
                    <Link href="/admin-home-page/view-past-bookings/events-meeting-room"> 
                        <span className={styles.breadcrumbsLink}> EVENT/ MEETING ROOMS BOOKING </span>
                    </Link>
                </p>
            </div>

            {((eventMeetingBooking != null && eventMeetingBooking.length > 0 && 
                displayedEventMeetingBookings.length > 0) && 
                (loginUserDetails != null && 
                    loginUserDetails.emailAddress.endsWith("@royalpalace.co.in"))) &&
                <div className={styles.diningRoomsEventContainer}>
                    <InfiniteScroll
                        dataLength={displayedEventMeetingBookings.length}
                        next={fetchNext}
                        hasMore={hasMore}
                        loader={<h4 className={styles.loaderMessage}>Loading more bookings...</h4>}
                        endMessage={<p className={styles.endMessageStyle}>No more Event and Meeting Rooms Bookings</p>}
                    >
                        {displayedEventMeetingBookings.map(function(eachEventMeetingRoomBookingInfo){
                            const eventMeetingBookingInfo =  eachEventMeetingRoomBookingInfo.bookingInfo; 
                            return (
                                <EachAdminEventMeetingBookingInfo 
                                    eachEventMeetingBookingInfo={eventMeetingBookingInfo} 
                                />
                            );
                        })}
                    </InfiniteScroll>               
                </div>
            }
                        

        </div>
    );

}


export default PastEventMeetingBookingPage;