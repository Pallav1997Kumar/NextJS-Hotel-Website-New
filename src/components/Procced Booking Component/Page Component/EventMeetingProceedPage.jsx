'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

import styles from './EventMeetingProceedPage.module.css';

import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import EventMeetingBookingInfo from "@/components/Booking Information Component/Event Meeting Booking/EventMeetingBookingInfo.jsx";
import { resetEventMeetingBookingInfo } from "@/redux store/features/Booking Information/eventMeetingBookingInfoSlice.js";
import { EVENT_AND_MEETING_ROOMS_BOOKING_PROCESS_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants.js";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";
import { convertToINR } from "@/functions/currency.js";


function EventMeetingProceedPageFunctionalComponent(){
    const dispatch = useAppDispatch();
    const router = useRouter();

    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;

    const allEventMeetingBookingInfo = useAppSelector((reduxStore) => reduxStore.eventMeetingBookingInfoSlice.eventMeetingBookingInfo);

    useEffect(()=>{
        fetchLoginUsersDetailsDb(loginUserId);
    }, []);

    const [loginCustomerInfo, setLoginCustomerInfo] = useState(null);
    const [showPaymentContainer, setShowPaymentContainer] = useState(false);
    const [performingPayment, setPerformingPayment] = useState(false);

    let customerAccountBalance = 0;
    if(loginCustomerInfo !== null){
        customerAccountBalance = loginCustomerInfo.accountBalance
    }

    const eventMeetingBookingAmount = allEventMeetingBookingInfo.reduce(function(total, eachEventMeetingBookingInfo){
        return total + (eachEventMeetingBookingInfo.cartInfo.totalPriceEventMeetingRoom || eachEventMeetingBookingInfo.cartInfo.totalPriceOfAllDates || 0);
    }, 0);

    
    async function fetchLoginUsersDetailsDb(loginUserId) {
        try {
            const response = await fetch(`/api/users-authentication/customers-authenticatication/login-user-information/${loginUserId}`);
            const data = await response.json();
            if(response.status == 200){
                setLoginCustomerInfo(data.loginUserDetails);   
            }
        } 
        catch (error) {
            console.log(error); 
        }
        finally{
            
        }
    }

    async function payEventMeetingBookingAmount(){
        try{
            setPerformingPayment(true);
            const response = await fetch('/api/booking-bulk-activities/events-meeting-booking-activities/', {
                method: 'POST',
                body: JSON.stringify(allEventMeetingBookingInfo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data = await response.json();
            if(response.status === 200 && data.message === EVENT_AND_MEETING_ROOMS_BOOKING_PROCESS_SUCCESSFUL){
                dispatch(resetEventMeetingBookingInfo());
                router.push(`/profile-home-page/view-current-bookings/${loginUserId}`);
            }
        }
        catch (error) {
            console.log(error); 
        }
        finally{
            setPerformingPayment(false);
        }
    }


    return (
        <div>
            <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />

            <div className={styles.eventMeetingBookingInfo}>
                <EventMeetingBookingInfo allEventMeetingBookingInfo={allEventMeetingBookingInfo} />
            </div>

            <div className={styles.proceedBtn}>
                {(allEventMeetingBookingInfo.length > 0 && loginCustomerInfo !== null) &&
                    <Button onClick={()=>setShowPaymentContainer(true)} variant="contained">
                        Proceed For Booking
                    </Button>
                }
                {(allEventMeetingBookingInfo.length == 0 || loginCustomerInfo == null) &&
                    <Button disabled variant="contained">
                        Proceed For Booking
                    </Button>
                }
            </div>

            {showPaymentContainer && 
            <div className={styles.paymentContainer}>
                <p className={styles.paymentAmount}>Please Pay {convertToINR(eventMeetingBookingAmount)} for Event/ Meeting Rooms Booking</p>
                {(eventMeetingBookingAmount <= customerAccountBalance) && 
                    <div className={styles.sufficientBalance}>
                        <p>Your Account has Balance {convertToINR(customerAccountBalance)}</p>
                        {!performingPayment &&
                            <Button onClick={payEventMeetingBookingAmount} variant="contained">
                                Pay {convertToINR(eventMeetingBookingAmount)}
                            </Button>
                        }
                        {performingPayment &&
                            <Button disabled variant="contained">
                                Please Wait
                            </Button>
                        }
                    </div>    
                }
                {(eventMeetingBookingAmount > customerAccountBalance) && 
                    <div className={styles.insufficientBalance}>
                        <p>
                            <FontAwesomeIcon icon={faCircleExclamation} />
                            Warning: Your Account has Insufficient Balance. Current Balance in Account is {convertToINR(customerAccountBalance)}. 
                            Please add {convertToINR(eventMeetingBookingAmount - customerAccountBalance)} to your Account.
                        </p>
                        <Button disabled variant="contained">
                            Pay {convertToINR(eventMeetingBookingAmount)}
                        </Button>
                    </div>
                }
            </div>
            }
            
        </div>
    );
}


function EventMeetingProceedPage(){
    return(
        <ErrorBoundary>
            <EventMeetingProceedPageFunctionalComponent />
        </ErrorBoundary>
    );
}


export default EventMeetingProceedPage;