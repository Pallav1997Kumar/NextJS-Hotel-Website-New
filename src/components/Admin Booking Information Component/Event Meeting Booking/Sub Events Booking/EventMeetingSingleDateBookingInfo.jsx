'use client'
import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import styles from './EventMeetingSingleDateBookingInfo.module.css';

import { calculateAgeFromDob, getDateTextFromFullDate } from "@/functions/date.js";
import { getCommaAndSeperatedArray } from "@/functions/array.js";
import { wantFoodServiceConstants } from "@/constant string files/eventsMeetingRoomImportantConstants.js";
import { convertToINR } from '@/functions/currency.js';
import EventMeetingFoodServices from "./Food Services Of Event/EventMeetingFoodServices.jsx";


const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 1000,
    bgcolor: 'background.paper',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #000',
    p: 2.5
}

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


function EventMeetingSingleDateBookingInfo(props){

    const eachEventMeetingBookingInfo = props.eachEventMeetingBookingInfo;
    const transactionDetails = eachEventMeetingBookingInfo.transactionDetails;
    const customerDetails = eachEventMeetingBookingInfo.customerDetails;

    const [viewFoodItems, setViewFoodItems] = useState(false);

    const [viewMoreBookingDetails, setViewMoreBookingDetails] = useState(false);

    return (
        <div className={styles.eachEventMeetingBookingtInformation}>
            <p className={styles.eachEventMeetingTitle}>
                Meeting / Event Area Name: {eachEventMeetingBookingInfo.meetingEventsInfoTitle}
            </p>
            <p className={styles.eventMeetingBookingEachInfo}>
                <span className={styles.eventMeetingBookingInfoEachInfoTitle}>Meeting / Event Booking Date: </span>
                {getDateTextFromFullDate(eachEventMeetingBookingInfo.meetingEventBookingDate)}
            </p>
            {(eachEventMeetingBookingInfo.meetingEventBookingTime.length > 1) &&
                <p className={styles.eventMeetingBookingEachInfo}>
                    <span className={styles.eventMeetingBookingInfoEachInfoTitle}>Meeting / Event Booking Time: </span>
                    {getCommaAndSeperatedArray(eachEventMeetingBookingInfo.meetingEventBookingTime)}
                </p>
            }
            {(eachEventMeetingBookingInfo.meetingEventBookingTime.length == 1) &&
                <p className={styles.eventMeetingBookingEachInfo}>
                    <span className={styles.eventMeetingBookingInfoEachInfoTitle}>Meeting / Event Booking Time: </span>
                    {eachEventMeetingBookingInfo.meetingEventBookingTime[0]}
                </p>
            }
            <p className={styles.eventMeetingBookingEachInfo}>
                <span className={styles.eventMeetingBookingInfoEachInfoTitle}>Meeting / Event Seating Arrangement: </span>
                {eachEventMeetingBookingInfo.meetingEventSeatingArrangement}
            </p>
            <p className={styles.eventMeetingBookingEachInfo}>
                <span className={styles.eventMeetingBookingInfoEachInfoTitle}>Number of Guests Attending: </span>
                {eachEventMeetingBookingInfo.maximumGuestAttending}
            </p>
            <p className={styles.eventMeetingBookingEachInfo}>
                <span className={styles.eventMeetingBookingInfoEachInfoTitle}>Food Services Included: </span>
                {eachEventMeetingBookingInfo.wantFoodServices}
            </p>
            <p className={styles.eventMeetingBookingEachInfo}>
                <span className={styles.eventMeetingBookingInfoEachInfoTitle}>Total Price of Event/Meeting Room: </span>
                {convertToINR(eachEventMeetingBookingInfo.totalPriceEventMeetingRoom)}
            </p>

            <div className={styles.buttonContainer}>

                <Button variant='contained' onClick={()=> setViewMoreBookingDetails(true)}>
                    View Booking Details
                </Button>

                {(eachEventMeetingBookingInfo.wantFoodServices == wantFoodServiceConstants.WANT_FOOD_SERVICE_YES) &&
                <React.Fragment>
                    
                    <Button onClick={()=>setViewFoodItems(true)} variant="outlined" sx={{ mx: 2 }}>
                        View Food Items
                    </Button>
                    <Modal
                        open={viewFoodItems}
                        onClose={()=>setViewFoodItems(false)}
                    >
                        <Box sx={boxStyle}>
                            <EventMeetingFoodServices eachEventMeetingBookingInfo={eachEventMeetingBookingInfo} />
                            <Button  onClick={()=>setViewFoodItems(false)} variant="contained">Ok</Button>
                        </Box>
                    </Modal>
                    
                </React.Fragment>
                }
            </div>

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
    );

}

export default EventMeetingSingleDateBookingInfo;