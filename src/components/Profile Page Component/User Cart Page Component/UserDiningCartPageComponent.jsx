'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import styles from './UserDiningRoomsSuitesEventMeetingStyle.module.css';

import { useAppSelector, useAppDispatch } from "@/redux store/hooks";
import { 
    updateLoginPageCalledFrom, 
    updateLoginRedirectPage 
} from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice.js";
import UserDiningBookingCart from "@/components/User Carts Component/UserDiningBookingCart.jsx";
import { 
    addDiningBookingInfo, 
    resetDiningBookingInfo 
} from "@/redux store/features/Booking Information/diningBookingInfoSlice.js";
import { 
    DINING_PRESENT_IN_CART, 
    DINING_CART_IS_EMPTY 
} from "@/constant string files/apiSuccessMessageConstants.js";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary.jsx";


function UserDiningCartPageComponentFunctionalComponent(){

    const dispatch = useAppDispatch();
    const router = useRouter();

    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    useEffect(function() {
        if (loginUserDetails == null) {
            const loginPageCalledFrom = 'My Cart Page';
            const loginRedirectPage = '/profile-home-page';
            dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
            dispatch(updateLoginRedirectPage(loginRedirectPage));
            router.push('/login');
        }
    }, [loginUserDetails, dispatch, router]);

    if(loginUserDetails == null){
        return null;
    }

    const loginUserId = loginUserDetails.userId;

    useEffect(()=>{
        fetchDiningCartDb(loginUserId);
        dispatch(resetDiningBookingInfo());
    }, []);

    const [loadingCartDetails, setLoadingCartDetails] = useState(true);
    const [proceedBtnClickable, setProceedBtnClickable] = useState(true);

    const [diningCart, setDiningCart] = useState(null);
    const [diningCartIdList, setDiningCartIdList] = useState([]);


    async function fetchDiningCartDb(loginUserId) {
        try {
            const response = await fetch(`/api/view-cart/dining/search-by-user-id/${loginUserId}`);
            const data = await response.json();
            if(response.status === 200){
                if(data.message === DINING_CART_IS_EMPTY){
                    const diningCartDb = [];
                    setDiningCart(diningCartDb);
                }
                else if(data.message === DINING_PRESENT_IN_CART){
                    const diningCartDb = data.diningCartInfo;
                    setDiningCart(diningCartDb);
                }
            }
        } 
        catch (error) {
            console.log(error);
        }
        finally{
            setLoadingCartDetails(false);
        }
    }


    async function removeDiningItemFromCartDb(id){
        try {
            const response = await fetch(`/api/delete-cart/dining/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }); 
            const data = await response.json();   
            if(response.status !== 200){

            }  
            if(response.status === 200){
                await fetchDiningCartDb(loginUserId);
            }
        } 
        catch (error) {
            console.log(error);
        }
    }


    function getDiningCheckedItemsId(idList){
        setDiningCartIdList(idList);
    }

    async function addToDiningBookingHandler(){ 
        const diningPaymentCartList = [];
        setProceedBtnClickable(false);
        try{
            const fetchDiningCartPromise = diningCartIdList.map(async function(eachDiningCartId){
                const diningCartResponse = await fetch(`/api/view-cart/dining/search-by-cart-id/${eachDiningCartId}`);
                const diningCartData = await diningCartResponse.json();
                return diningCartData;
            });
            const diningCartPromiseResult = await Promise.all(fetchDiningCartPromise);
            diningCartPromiseResult.forEach(function(eachDiningCartPromise){
                diningPaymentCartList.push(eachDiningCartPromise);
            });
        }
        catch(error){

        }
        finally{
            dispatch(addDiningBookingInfo(diningPaymentCartList));
            const redirectPage = `/proceed-booking/dining/${loginUserId}`;
            router.push(redirectPage);
            setProceedBtnClickable(true);
        }
    }


    if(!loadingCartDetails && diningCart !== null && diningCart.length == 0){
        return (
            <React.Fragment>
                <Image src={'/hotel photo.jpg'} alt="hotel" width={1500} height={500} />

                <div className={styles.breadcrumbsContainer}>
                    <p>
                        <Link href="/">
                            <span className={styles.breadcrumbsLink}> HOME </span>
                        </Link> 
                        <span>{'>>'}</span> 
                        <Link href="/profile-home-page"> 
                            <span className={styles.breadcrumbsLink}> PROFILE PAGE </span>
                        </Link>
                        <span>{'>>'}</span> 
                        <Link href={`/profile-home-page/my-cart/${loginUserId}`}> 
                            <span className={styles.breadcrumbsLink}> MY ACCOUNT CART </span>
                        </Link>
                        <span>{'>>'}</span>
                        <Link href={`/profile-home-page/my-cart/dining/${loginUserId}`}> 
                            <span className={styles.breadcrumbsLink}> MY ACCOUNT DINING CART </span>
                        </Link>
                    </p>
                </div>

                <div className={styles.emptyCart}>
                    <p>Dining Cart is Empty</p>
                    <p>Click on Below Button to Add Items</p>
                    <Link href={`/dining/`} passHref>
                        <Button variant="contained">Dining Page</Button>
                    </Link>
                </div>
            </React.Fragment>
        );
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
                    <Link href="/profile-home-page"> 
                        <span className={styles.breadcrumbsLink}> PROFILE PAGE </span>
                    </Link>
                    <span>{'>>'}</span> 
                    <Link href={`/profile-home-page/my-cart/${loginUserId}`}> 
                        <span className={styles.breadcrumbsLink}> MY ACCOUNT CART </span>
                    </Link>
                    <span>{'>>'}</span>
                    <Link href={`/profile-home-page/my-cart/dining/${loginUserId}`}> 
                        <span className={styles.breadcrumbsLink}> MY ACCOUNT DINING CART </span>
                    </Link>
                </p>
            </div>

            {loadingCartDetails &&
                <div className={styles.loadingCart}>
                    <p> LOADING CART ...</p>
                </div>
            }

            <div className={styles.diningRoomsEventContainer}>
                {(!loadingCartDetails && diningCart !== null && diningCart.length > 0) &&
                    <UserDiningBookingCart 
                        diningCart={diningCart} 
                        onGetCheckIdDiningCart={getDiningCheckedItemsId}
                        onRemoveDiningItemFromCart={removeDiningItemFromCartDb}
                    />
                }

                {(diningCart !== null && diningCart.length > 0 && diningCartIdList.length > 0) &&
                    <div className={styles.addCartBtn}>
                        {proceedBtnClickable && 
                            <Button onClick={addToDiningBookingHandler} variant="contained">
                                Procced For Booking
                            </Button>
                        }
                        {!proceedBtnClickable &&
                            <Button disabled variant="contained">
                                Please Wait
                            </Button>
                        }                        
                    </div>
                }

                {(diningCart !== null && diningCart.length > 0 && diningCartIdList.length == 0) &&
                    <div className={styles.addCartBtn}>
                        <Button disabled variant="contained">
                            Procced For Booking
                        </Button>
                    </div>
                }
            </div>

        </div>
    );

}


function UserDiningCartPageComponent(){
    return(
        <ErrorBoundary>
            <UserDiningCartPageComponentFunctionalComponent />
        </ErrorBoundary>
    );
}


export default UserDiningCartPageComponent;