'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from 'next/navigation';

import styles from './PastDiningRoomEventPage.module.css';

import { 
    ROOMS_SUITES_BOOKING_INFO_IS_PRESENT, 
    ROOMS_SUITES_BOOKING_INFO_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants.js";
import EachAdminRoomBookingInfo from "@/components/Admin Booking Information Component/Rooms Suites Booking/EachAdminRoomBookingInfo.jsx";
import { useAppSelector, useAppDispatch } from "@/redux store/hooks.js";
import { 
    updateLoginPageCalledFrom, 
    updateLoginRedirectPage 
} from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice.js";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary.jsx";

function PastRoomsSuitesBookingPage(){
    return(
        <ErrorBoundary>
            <PastRoomsSuitesBookingPageFunctionalComponent />
        </ErrorBoundary>
    );
}


function PastRoomsSuitesBookingPageFunctionalComponent(){

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
        const loginPageCalledFrom = 'Admin Past Rooms Suites Page';
        const loginRedirectPage = '/admin-home-page';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/admin-login');
        return ;
    }
    
    if(loginUserDetails != null && 
        !loginEmailAddress.endsWith("@royalpalace.co.in")){
        const loginPageCalledFrom = 'Admin Past Rooms Suites Page';
        const loginRedirectPage = '/admin-home-page';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/admin-login');
        return ;
    }


    const [roomSuitesBooking, setRoomSuitesBooking] = useState(null);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);


    useEffect(function(){
        if(loginUserDetails != null && 
            loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            fetchRoomSuiteBookingDb(page);
        }
    }, [page]);


    async function fetchRoomSuiteBookingDb(currentPage) {
        try {
            const response = await fetch(`/api/view-past-booking/rooms-suites?page=${currentPage}`);
            const data = await response.json();
            console.log(data);
            
            if(response.status === 200){
                if(data.message === ROOMS_SUITES_BOOKING_INFO_IS_EMPTY){
                    const roomSuitesBookingDb = [];
                    setRoomSuitesBooking(roomSuitesBookingDb);
                    setHasMore(false);
                }
                else if(data.message === ROOMS_SUITES_BOOKING_INFO_IS_PRESENT){
                    const roomSuitesBookingInfo = data.roomSuitesBookingInfo;
                    let roomSuitesBookingDb = [];
                    if(Array.isArray(roomSuitesBooking) && roomSuitesBooking.length > 0){
                        roomSuitesBookingDb = [...roomSuitesBooking, ...roomSuitesBookingInfo];
                    }
                    else{
                        roomSuitesBookingDb = roomSuitesBookingInfo;
                    }
                    setRoomSuitesBooking(roomSuitesBookingDb);
                    setHasMore(data.pagination.hasMore);
                }
            }
        } catch (error) {
            console.log(error);
            setHasMore(false);
        }
    }


    function fetchNext() {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchRoomSuiteBookingDb(nextPage);
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
                    <Link href="/admin-home-page/view-past-bookings/rooms-suites"> 
                        <span className={styles.breadcrumbsLink}> ROOMS AND SUITES BOOKING </span>
                    </Link>
                </p>
            </div>


            {((roomSuitesBooking != null && roomSuitesBooking.length > 0) && 
                (loginUserDetails != null && 
                    loginUserDetails.emailAddress.endsWith("@royalpalace.co.in"))) &&
                <div className={styles.diningRoomsEventContainer}>
                    <InfiniteScroll
                        dataLength={roomSuitesBooking.length}
                        next={fetchNext}
                        hasMore={hasMore}
                        loader={<h4 className={styles.loaderMessage}>Loading more bookings...</h4>}
                        endMessage={<p className={styles.endMessageStyle}>No more Rooms and Suites Bookings</p>}
                    >
                        {roomSuitesBooking.map(function(eachRoomSuitesBookingInfo){
                            const roomSuitesBookingInfo =  eachRoomSuitesBookingInfo.bookingInfo;  
                            return (
                                <EachAdminRoomBookingInfo 
                                    eachRoomBookingInfo={roomSuitesBookingInfo} 
                                />
                            );
                        })}
                    </InfiniteScroll>               
                </div>
            }

        </div>
    );

}


export default PastRoomsSuitesBookingPage;