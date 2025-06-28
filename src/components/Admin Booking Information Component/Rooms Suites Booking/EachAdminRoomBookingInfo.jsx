'use client'
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import styles from './EachAdminRoomBookingInfo.module.css';

import { calculateAgeFromDob, getDateTextFromFullDate, getDateTextFromOnlyDate } from "@/functions/date.js";
import { convertToINR } from "@/functions/currency.js";


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



function EachAdminRoomBookingInfo(props){
    const eachRoomBookingInfo = props.eachRoomBookingInfo;
    const transactionDetails = eachRoomBookingInfo.transactionDetails;
    const customerDetails = eachRoomBookingInfo.customerDetails;

    useEffect(()=>{
        fetchRoomsSuitesInformation();
    }, []);

    const [roomsSuites, setRoomsSuites] = useState([]);

    const [displayGuestDetails, setDisplayGuestDetails] = useState(false);
    const [viewMoreBookingDetails, setViewMoreBookingDetails] = useState(false);

    async function fetchRoomsSuitesInformation(){
        try {
            const response = await fetch('/api/hotel-booking-information/room-and-suites-information/');
            const roomSuitesInfo = await response.json();
            setRoomsSuites(roomSuitesInfo.rooms);
        } catch (error) {
            console.log(error);
        }
    }   

    const particularRoomBasicInfo = roomsSuites.find(function(eachRoomInHotel){
        return (eachRoomInHotel.title == eachRoomBookingInfo.bookingRoomTitle);
    });

    return (
        <div className={styles.eachRoomSuiteBookingInformation}>
            <div className={styles.eachRoomSuiteBasicBookingInfo}>
                
                <div className={styles.eachRoomSuiteImage}>
                    {(particularRoomBasicInfo != null) && 
                    <Image src={particularRoomBasicInfo.photos[0]} alt="room-image" width={400} height={200} />
                    }
                </div>
                
                <div className={styles.eachRoomSuiteBookingInfo}>
                    <p className={styles.eachRoomTitle}>
                        Room Title: {eachRoomBookingInfo.bookingRoomTitle} 
                    </p>
                    <p className={styles.eachRoomOtherInfo}>
                        <span className={styles.eachRoomOtherInfoTitle}>Room CheckIn Date: </span> 
                        {getDateTextFromOnlyDate(eachRoomBookingInfo.bookingCheckinDate)}  
                    </p>
                    <p className={styles.eachRoomOtherInfo}>
                        <span className={styles.eachRoomOtherInfoTitle}>Room CheckOut Date: </span> 
                        {getDateTextFromOnlyDate(eachRoomBookingInfo.bookingCheckoutDate)} 
                    </p>
                    <p className={styles.eachRoomOtherInfo}>
                        <span className={styles.eachRoomOtherInfoTitle}>Total Number of Rooms: </span> 
                        {eachRoomBookingInfo.totalRooms} 
                    </p>
                    <p className={styles.eachRoomOtherInfo}>
                        <span className={styles.eachRoomOtherInfoTitle}>Total Number of Guests: </span> 
                        {eachRoomBookingInfo.totalGuest} 
                    </p>
                    <p className={styles.eachRoomOtherInfo}>
                        <span className={styles.eachRoomOtherInfoTitle}>Total Price Of Room: </span>
                        {convertToINR(eachRoomBookingInfo.totalPriceOfAllRooms)} 
                    </p>
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
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button onClick={()=>setDisplayGuestDetails(true)} variant="outlined">
                        View Guest Details
                    </Button>
                </div>
                
            </div>
            
            {displayGuestDetails && 
            <div className={styles.eachRoomSuiteBookingGuestContainer}>
                <div className={styles.eachRoomSuiteBookingGuestInfo}>
                    {(eachRoomBookingInfo.guestRoomsDetails).map(function(eachRoomForGuest){
                        return (
                            <div className={styles.guestDetailsStyle}>
                                <p>
                                    <span className={styles.guestDetailsTitle}>Room: </span>
                                    {eachRoomForGuest.roomNo} 
                                </p>
                                <p>
                                    <span className={styles.guestDetailsTitle}>Number of Adults: </span> 
                                    {eachRoomForGuest.noOfAdult} 
                                </p>
                                <p>
                                    <span className={styles.guestDetailsTitle}>Number of Children: </span> 
                                    {eachRoomForGuest.noOfChildren} 
                                </p>
                                <p>
                                    <span className={styles.guestDetailsTitle}>Total Guests in Room: </span>
                                    {eachRoomForGuest.total}
                                </p>
                            </div>
                        )
                    })}
                </div>
                <div className={styles.closeGuestDetails}>
                    <Button onClick={()=>setDisplayGuestDetails(false)} variant="contained">
                        CLOSE
                    </Button>
                </div>
            </div>
            }
        </div>
    );
}

export default EachAdminRoomBookingInfo;