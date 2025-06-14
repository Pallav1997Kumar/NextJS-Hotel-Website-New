'use client'
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import styles from './ViewTransactionHistory.module.css';

import { 
    TRANSACTION_HISTORY_FOUND, 
    NO_TRANSACTION_HISTORY_FOUND 
} from "@/constant string files/apiSuccessMessageConstants.js";
import ViewPracticularTransactionDetails from "./ViewPracticularTransactionDetails.jsx";
import { useAppSelector, useAppDispatch } from "@/redux store/hooks.js";
import { 
    updateLoginPageCalledFrom, 
    updateLoginRedirectPage 
} from "@/redux store/features/Login Page Called From Features/loginPageCalledFromSlice.js";
import ErrorBoundary from "@/components/Error Boundary/ErrorBoundary.jsx";


const tableHeadingStyle = {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    backgroundColor: 'rgb(55, 47, 45)',
    color: 'rgb(232, 219, 216)',
    border: '2.5px solid rgb(233, 206, 200)'
}


function ViewTransactionHistory(){
    return (
        <ErrorBoundary>
            <ViewTransactionHistoryFunctionalComponent />
        </ErrorBoundary>
    );
}


function ViewTransactionHistoryFunctionalComponent(){

    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

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
    
    if(loginUserDetails != null && 
        !loginEmailAddress.endsWith("@royalpalace.co.in")){
        const loginPageCalledFrom = 'Admin Past Dining, Rooms Suites and Event Meeting Rooms Page';
        const loginRedirectPage = '/admin-home-page';
        dispatch(updateLoginPageCalledFrom(loginPageCalledFrom));
        dispatch(updateLoginRedirectPage(loginRedirectPage));
        router.push('/admin-login');
        return ;
    }

    const pageNumber = searchParams.get('page')

    const currentPage = Number(pageNumber) || 1;

    const [transactionDetails, setTransactionDetails] = useState(null);
    const [loadingTransactionDetails, setLoadingTransactionDetails] = useState(false);
    const [totalPages, setTotalPages] = useState(0);


    useEffect(function(){
        if(loginUserDetails != null && 
            loginUserDetails.emailAddress.endsWith("@royalpalace.co.in")){
            fetchCurrentPageTransactionDetails();
        }
    }, [currentPage]);

    async function fetchCurrentPageTransactionDetails(){
        try{
            setLoadingTransactionDetails(true);
            const response = await fetch(`/api/all-users-view-transaction-history?page=${currentPage}`);
            const data = await response.json();
            console.log(data);

            if(response.status === 200){
                if(data.message === TRANSACTION_HISTORY_FOUND){
                    const transactionHistoryInfo = data.transactionHistory;
                    setTransactionDetails(transactionHistoryInfo);
                    setTotalPages(data.pagination.totalPages);
                }
                else if(data.message === NO_TRANSACTION_HISTORY_FOUND){
                    const transactionHistoryInfo = [];
                    setTransactionDetails(transactionHistoryInfo);
                }
            }
        }
        catch(error){
            console.log(error)
        }
        finally{
            setLoadingTransactionDetails(false);
        }
    }

    function handlePageChange(page) {
        router.push(`/admin-home-page/view-transaction-history?page=${page}`);
    }

    function renderPagination(){
        if(totalPages <= 1){
            return null;
        }

        let buttons = [];

        //First Page
        buttons.push(
            <Button 
                key={1} 
                color="success"
                variant={currentPage === 1 ? "contained" : "outlined"} 
                onClick={()=>handlePageChange(1)}
                sx={{ mx: 1 }}
            >
                1
            </Button>
        );

        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage <= 2) {
            startPage = 2;
            endPage = Math.min(4, totalPages - 1); 
        }

        if (currentPage >= totalPages - 1) {
            startPage = Math.max(totalPages - 3, 2);
            endPage = totalPages - 1;
        }

        if (startPage > 2) {
            buttons.push(
                <span key="ellipsis-start" className={styles.ellipsis}>...</span>
            );
        }

        for(let i = startPage; i <= endPage; i++){
            buttons.push(
                <Button
                    key={i}
                    color="success"
                    variant={currentPage === i ? "contained" : "outlined"}
                    onClick={()=>handlePageChange(i)}
                    sx={{ mx: 1 }}
                >
                    {i}
                </Button>
            );
        }

        if (endPage < totalPages - 1) {
            buttons.push(
                <span key="ellipsis-end" className={styles.ellipsis}>...</span>
            );
        }

        if(totalPages > 1){
            buttons.push(
                <Button
                    key={totalPages}
                    color="success"
                    variant={currentPage === totalPages ? "contained" : "outlined"}
                    onClick={()=>handlePageChange(totalPages)}
                    sx={{ mx: 1 }}
                >
                    {totalPages}
                </Button>
            );
        }

        return <div className={styles.paginationContainer}>{buttons}</div>;
    }

    return(
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
                    <Link href={`/admin-home-page/view-transaction-history?page=${currentPage}`}> 
                        <span className={styles.breadcrumbsLink}> VIEW TRANSACTION HISTORY </span>
                    </Link>
                </p>
            </div>

            {(!loadingTransactionDetails && 
            transactionDetails != null && transactionDetails.length > 0) && 
                <div className={styles.transactionHistoryContainer}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={tableHeadingStyle}>Customer Full Name</TableCell>
                                    <TableCell sx={tableHeadingStyle}>Customer Email Address</TableCell>
                                    <TableCell sx={tableHeadingStyle}>Transaction Date Time</TableCell>
                                    <TableCell sx={tableHeadingStyle}>Transaction Type</TableCell>
                                    <TableCell sx={tableHeadingStyle}>Transaction Amount</TableCell>
                                    <TableCell sx={tableHeadingStyle}>Transaction Description</TableCell>
                                    <TableCell sx={tableHeadingStyle}>View Customer's Full Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactionDetails.map(function(eachTransactionDetails){
                                    return(
                                        <ViewPracticularTransactionDetails eachTransactionDetails={eachTransactionDetails} />
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination Logic */}
                    {renderPagination()}

                </div>
            }
        </div>
    );
}

export default ViewTransactionHistory;