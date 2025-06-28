'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

import styles from './RoomsSuitesProceedPage.module.css';

import { useAppSelector, useAppDispatch } from '@/redux store/hooks';
import RoomSuitesBookingInfo from "@/components/Booking Information Component/Rooms Suites Booking/RoomSuitesBookingInfo.jsx";
import { ROOMS_SUITES_BOOKING_PROCESS_SUCCESSFUL } from "@/constant string files/apiSuccessMessageConstants.js";
import { resetRoomSuiteBookingInfo } from "@/redux store/features/Booking Information/roomSuiteBookingInfoSlice.js";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary";
import { convertToINR } from "@/functions/currency.js";


function RoomsSuitesProceedPageFunctionalComponent(){
    const dispatch = useAppDispatch();
    const router = useRouter();

    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);
    const loginUserId = loginUserDetails.userId;

    const allRoomSuiteBookingInfo = useAppSelector((reduxStore) => reduxStore.roomSuiteBookingInfoSlice.roomSuiteBookingInfo);

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

    const roomsSuitesBookingAmount = allRoomSuiteBookingInfo.reduce(function(total, eachRoomSuiteBookingInfo){
        return total + eachRoomSuiteBookingInfo.cartInfo.totalPriceOfAllRooms;
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

    async function payRoomsSuitesBookingAmount(){
        try{
            setPerformingPayment(true);
            const response = await fetch('/api/booking-bulk-activities/rooms-suites-booking-activities/', {
                method: 'POST',
                body: JSON.stringify(allRoomSuiteBookingInfo),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            const data = await response.json();
            if(response.status === 200 && data.message === ROOMS_SUITES_BOOKING_PROCESS_SUCCESSFUL){
                dispatch(resetRoomSuiteBookingInfo());
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

            <div className={styles.roomSuiteBookingInfo}>
                <RoomSuitesBookingInfo allRoomSuiteBookingInfo={allRoomSuiteBookingInfo} />
            </div>

            <div className={styles.proceedBtn}>
                {(allRoomSuiteBookingInfo.length > 0 && loginCustomerInfo !== null) &&
                    <Button onClick={()=>setShowPaymentContainer(true)} variant="contained">
                        Proceed For Booking
                    </Button>
                }
                {(allRoomSuiteBookingInfo.length == 0 || loginCustomerInfo == null) &&
                    <Button disabled variant="contained">
                        Proceed For Booking
                    </Button>
                }
            </div>

            {showPaymentContainer && 
            <div className={styles.paymentContainer}>
                <p className={styles.paymentAmount}>Please Pay {convertToINR(roomsSuitesBookingAmount)} for Rooms and Suites Booking</p>
                {(roomsSuitesBookingAmount <= customerAccountBalance) && 
                    <div className={styles.sufficientBalance}>
                        <p>Your Account has Balance {convertToINR(customerAccountBalance)}</p>
                        {!performingPayment &&
                            <Button onClick={payRoomsSuitesBookingAmount} variant="contained">
                                Pay {convertToINR(roomsSuitesBookingAmount)}
                            </Button>
                        }
                        {performingPayment &&
                            <Button disabled variant="contained">
                                Please Wait
                            </Button>
                        }
                    </div>    
                }
                {(roomsSuitesBookingAmount > customerAccountBalance) && 
                    <div className={styles.insufficientBalance}>
                        <p>
                            <FontAwesomeIcon icon={faCircleExclamation} />
                            Warning: Your Account has Insufficient Balance. Current Balance in Account is {convertToINR(customerAccountBalance)}. 
                            Please add {convertToINR(roomsSuitesBookingAmount - customerAccountBalance)} to your Account.
                        </p>
                        <Button disabled variant="contained">
                            Pay {convertToINR(roomsSuitesBookingAmount)}
                        </Button>
                    </div>
                }
            </div>
            }

        </div>
    );
}


function RoomsSuitesProceedPage(){
    return(
        <ErrorBoundary>
            <RoomsSuitesProceedPageFunctionalComponent />
        </ErrorBoundary>
    );
}

export default RoomsSuitesProceedPage;