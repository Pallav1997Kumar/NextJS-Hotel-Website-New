'use client'
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import styles from './ViewAccountBalance.module.css';

import { useAppDispatch, useAppSelector } from "@/redux store/hooks";
import { updateLoginPageCalledFrom, updateLoginRedirectPage } from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice";
import { utcTimeToISTConvesion } from "@/functions/date.js";
import { convertToINR } from "@/functions/currency.js";
import { TRANSACTION_HISTORY_FOUND, NO_TRANSACTION_HISTORY_FOUND } from "@/constant string files/apiSuccessMessageConstants.js";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary.jsx";


const tableHeadingStyle = {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    backgroundColor: 'rgb(55, 47, 45)',
    color: 'rgb(232, 219, 216)'
}


function ViewAccountBalanceFunctionalComponent() {
    const loginUserDetails = useAppSelector((reduxStore)=> reduxStore.userSlice.loginUserDetails);

    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(function() {
        if (loginUserDetails == null) {
            const loginPageCalledFrom = 'View Account Balance Page';
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

    const [loginCustomerInfo, setLoginCustomerInfo] = useState(null);
    const [showTransaction, setShowTransaction] = useState(false);
    const [transactionHistoryFound, setTransactionHistoryFound] = useState(false);
    const [transactionHistory, setTransactionHistory] = useState(null);

    if(transactionHistory != null){
        transactionHistory.sort(function(a,b){
            return new Date(b.transactionDateTime) - new Date(a.transactionDateTime)
        });
    }
    

    useEffect(()=>{
        fetchLoginUsersDetailsDb(loginUserId);
        fetchUserTransactionHistory(loginUserId);
    }, []);

    async function fetchLoginUsersDetailsDb(loginUserId) {
        try {
            const response = await fetch(`/api/users-authentication/customers-authenticatication/login-user-information/${loginUserId}`);
            const data = await response.json();
            if(response.status == 200){
                setLoginCustomerInfo(data.loginUserDetails);   
            }
        } catch (error) {
            console.log(error); 
        }
    }

    async function fetchUserTransactionHistory(loginUserId) {
        try {
            const response = await fetch(`/api/account-balance-user/view-transaction-history/${loginUserId}`);
            const data = await response.json();
            if(response.status === 200){
                if(data.message === NO_TRANSACTION_HISTORY_FOUND){
                    setTransactionHistoryFound(false);
                }
                else if(data.message === TRANSACTION_HISTORY_FOUND){
                    setTransactionHistoryFound(true);
                    setTransactionHistory(data.transactionHistory);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className={styles.viewBalancePage}>

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
                    <Link href={`/profile-home-page/view-account-balance/${loginUserId}`}> 
                        <span className={styles.breadcrumbsLink}> VIEW ACCOUNT BALANCE </span>
                    </Link>
                </p>
            </div>

            {(loginCustomerInfo != null) && 
            <div className={styles.viewBalance}>
                <div className={styles.viewBalanceAmount}>
                    <h3>Account Balance: </h3>
                    <p>{convertToINR(loginCustomerInfo.accountBalance)}</p>
                </div>
                <div className={styles.transactionButton}>
                    <Button onClick={()=> setShowTransaction(true)} variant="outlined">View Transaction</Button>
                    <Button onClick={()=> setShowTransaction(false)} variant="outlined">Hide Transaction</Button>
                </div>
            </div>
            }

            {(!transactionHistoryFound && showTransaction) && 
            <div className={styles.noTransactionHistory}>
                <p>No Transaction Found</p>
            </div>
            }

            {(transactionHistoryFound && showTransaction) && 
            <div className={styles.transactionHistory}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={tableHeadingStyle}>Transaction Date Time</TableCell>
                                <TableCell sx={tableHeadingStyle}>Transaction Type</TableCell>
                                <TableCell sx={tableHeadingStyle}>Transaction Amount</TableCell>
                                <TableCell sx={tableHeadingStyle}>Updated Account Balance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactionHistory.map(function(eachTransaction){
                                return (
                                    <TableRow>
                                        <TableCell>{utcTimeToISTConvesion(eachTransaction.transactionDateTime.toString())}</TableCell>
                                        <TableCell>{eachTransaction.transactionType}</TableCell>
                                        <TableCell>{convertToINR(eachTransaction.transactionAmount)}</TableCell>
                                        <TableCell>{convertToINR(eachTransaction.updatedAccountBalance)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            }
            
        </div>
    );
}


function ViewAccountBalance(){
    return (
        <ErrorBoundary>
            <ViewAccountBalanceFunctionalComponent />
        </ErrorBoundary>
    );
}


export default ViewAccountBalance;