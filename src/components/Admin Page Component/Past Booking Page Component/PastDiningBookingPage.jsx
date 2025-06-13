'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InfiniteScroll from "react-infinite-scroll-component";

import styles from './PastDiningRoomEventPage.module.css';

import { DINING_BOOKING_INFO_IS_PRESENT, DINING_BOOKING_INFO_IS_EMPTY } from "@/constant string files/apiSuccessMessageConstants.js";
import EachAdminDiningBookingInfo from "@/components/Admin Booking Information Component/Dining Booking/EachAdminDiningBookingInfo.jsx";
import { useAppSelector, useAppDispatch } from "@/redux store/hooks.js";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";



function PastDiningBookingPage(){

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
            const loginPageCalledFrom = 'Admin Past Dining Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }
        if(loginUserDetails != null && !loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            const loginPageCalledFrom = 'Admin Past Dining Page';
            const loginRedirectPage = '/admin-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/admin-login');
            return ;
        }
    }, [loginUserDetails, router, dispatch]);


    const [diningBooking, setDiningBooking] = useState(null);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);


    useEffect(function(){
        if(loginUserDetails != null && loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            fetchDiningBookingDb(page);
        }
    }, [page]);


    async function fetchDiningBookingDb(currentPage) {
        try {
            const response = await fetch(`/api/view-past-booking/dining?page=${currentPage}`);
            const data = await response.json();
            console.log(data);
            
            if(response.status === 200){
                if(data.message === DINING_BOOKING_INFO_IS_EMPTY){
                    const diningBookingDb = [];
                    setDiningBooking(diningBookingDb);
                    setHasMore(false);
                }
                else if(data.message === DINING_BOOKING_INFO_IS_PRESENT){
                    const diningBookingInfo = data.diningBookingInfo;
                    let diningBookingDb = [];
                    if(Array.isArray(diningBooking) && diningBooking.length > 0){
                        diningBookingDb = [...diningBooking, ...diningBookingInfo];
                    }
                    else{
                        diningBookingDb = diningBookingInfo;
                    }
                    setDiningBooking(diningBookingDb);
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
        fetchDiningBookingDb(nextPage);
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
                    <Link href="/admin-home-page/view-past-bookings/dining"> 
                        <span className={styles.breadcrumbsLink}> DINING BOOKING </span>
                    </Link>
                </p>
            </div>


            {((diningBooking != null && diningBooking.length > 0) && (loginUserDetails != null && loginUserDetails.emailAddress.endsWith("@royalpalace.co.in"))) &&
            <div className={styles.diningRoomsEventContainer}>
                <InfiniteScroll
                    dataLength={diningBooking.length}
                    next={fetchNext}
                    hasMore={hasMore}
                    loader={<h4 className={styles.loaderMessage}>Loading more bookings...</h4>}
                    endMessage={<p className={styles.endMessageStyle}>No more Dining Bookings</p>}
                >
                    {diningBooking.map(function(eachDiningBookingInfo){
                        const diningBookingInfo =  eachDiningBookingInfo.bookingInfo; 
                        return (
                            <EachAdminDiningBookingInfo 
                                eachDiningBookingInfo={diningBookingInfo} 
                            />
                        );
                    })}
                </InfiniteScroll>               
            </div>
            }

        </div>
    );

}


export default PastDiningBookingPage;