'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import styles from './EachAdminDiningBookingInfo.module.css';

import { calculateAgeFromDob, getDateTextFromFullDate } from "@/functions/date.js";
import { CURRENCY_SYMBOL } from "@/constant string files/commonConstants.js";


const style = {
    position: 'absolute',
    top: '50%',
    left: '40%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '3px solid #000',
    boxShadow: 24,
    px: 4,
    py: 2,
    fontSize: '0.8rem'
};


function EachAdminDiningBookingInfo(props){

    const eachDiningBookingInfo = props.eachDiningBookingInfo;
    const transactionDetails = eachDiningBookingInfo.transactionDetails;
    const customerDetails = eachDiningBookingInfo.customerDetails;
    

    useEffect(()=>{
        fetchDiningInformation();
    }, []);

    const [dining, setDining] = useState([]);

    const [viewMoreBookingDetails, setViewMoreBookingDetails] = useState(false);

    async function fetchDiningInformation(){
        try {
            const response = await fetch('/api/hotel-booking-information/dining-information/');
            const diningInfo = await response.json();
            setDining(diningInfo.dining);
        } catch (error) {
            console.log(error);
        }
    }

    const particularDiningBasicInfo = dining.find(function(eachDiningInHotel){
        return (eachDiningInHotel.diningAreaTitle == eachDiningBookingInfo.diningRestaurantTitle);
    });

    return (
        <div className={styles.eachDiningBookingInfo}>
            
            
            <div className={styles.eachDiningBookingInfoImage}>
                {(particularDiningBasicInfo != null) && 
                <Image src={particularDiningBasicInfo.photo} alt='dining-image' width={430} height={210} />
                }
            </div>
            

            <div className={styles.eachDiningBookingInformation}>
                <p className={styles.eachDiningTitle}>
                    Dining Restaurant Name: {eachDiningBookingInfo.diningRestaurantTitle} 
                </p>
                <p className={styles.diningBookingInfoEachInfo}>
                    <span className={styles.diningBookingInfoEachInfoTitle}>Table Dining Date: </span>
                    {getDateTextFromFullDate(eachDiningBookingInfo.tableBookingDate)}
                </p>
                <p className={styles.diningBookingInfoEachInfo}>
                    <span className={styles.diningBookingInfoEachInfoTitle}>Meal Type: </span>
                    {eachDiningBookingInfo.mealType}
                </p>
                <p className={styles.diningBookingInfoEachInfo}>
                    <span className={styles.diningBookingInfoEachInfoTitle}>Table Booking Time: </span>
                    {eachDiningBookingInfo.tableBookingTime}
                </p>
                <p className={styles.diningBookingInfoEachInfo}>
                    <span className={styles.diningBookingInfoEachInfoTitle}>Total Number Of Guest: </span>
                    {eachDiningBookingInfo.noOfGuests}
                </p>
                <p className={styles.diningBookingInfoEachInfo}>
                    <span className={styles.diningBookingInfoEachInfoTitle}>Total Booking Price: </span>
                    {CURRENCY_SYMBOL}{eachDiningBookingInfo.priceForBooking}
                </p>
                <p className={styles.diningBookingInfoEachInfoTitle}>Total Number Of Tables</p>
                <div className={styles.tableInformation}>
                    <p className={styles.eachTableInfo}>
                        <span className={styles.diningBookingInfoEachInfoTitle}>Two Guest Table: </span>
                        {eachDiningBookingInfo.tableBookingCountDetails.tableCountTwoPerson}
                    </p>
                    <p className={styles.eachTableInfo}>
                        <span className={styles.diningBookingInfoEachInfoTitle}>Four Guest Table: </span>
                        {eachDiningBookingInfo.tableBookingCountDetails.tableCountFourPerson}
                    </p>
                    <p className={styles.eachTableInfo}>
                        <span className={styles.diningBookingInfoEachInfoTitle}>Six Guest Table: </span>
                        {eachDiningBookingInfo.tableBookingCountDetails.tableCountSixPerson}
                    </p>
                </div>

                <Button variant='contained' onClick={()=> setViewMoreBookingDetails(true)}>
                    View Booking Details
                </Button>
                <Modal
                    open={viewMoreBookingDetails}
                    onClose={()=> setViewMoreBookingDetails(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Transaction Details
                        </Typography>
                        <Typography id="modal-modal-description">
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table" size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Transaction Date Time</TableCell>
                                            <TableCell>{getDateTextFromFullDate(transactionDetails.transactionDateTime)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Transaction Amount</TableCell>
                                            <TableCell>{transactionDetails.transactionAmount}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Transaction Description</TableCell>
                                            <TableCell>{transactionDetails.transactionDescription}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Typography>

                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mt: 3 }}>
                            Customer Details
                        </Typography>
                        <Typography id="modal-modal-description">
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table" size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Full Name</TableCell>
                                            <TableCell>{customerDetails.fullName}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Gender</TableCell>
                                            <TableCell>{customerDetails.gender}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Email Address</TableCell>
                                            <TableCell>{customerDetails.emailAddress}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Contact Number</TableCell>
                                            <TableCell>{customerDetails.contactNo}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Alternate Contact Number</TableCell>
                                            <TableCell>{customerDetails.alternateContactNo || 'N/A'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Age</TableCell>
                                            <TableCell>{calculateAgeFromDob(customerDetails.dateOfBirth)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Typography>

                    </Box>
                </Modal>
                
            </div>
        </div>
    )

}

export default EachAdminDiningBookingInfo;