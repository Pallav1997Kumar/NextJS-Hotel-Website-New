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

import styles from './EventMeetingMultipleDateNonContinuousBookingInfo.module.css';

import EventMeetingEachDayNonContinuous from './EventMeetingEachDayNonContinuous.jsx';
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


function EventMeetingMultipleDateNonContinuousBookingInfo(props){

    const eachEventMeetingBookingInfo = props.eachEventMeetingBookingInfo;
    const transactionDetails = eachEventMeetingBookingInfo.transactionDetails;
    const customerDetails = eachEventMeetingBookingInfo.customerDetails;

    const [viewMoreBookingDetails, setViewMoreBookingDetails] = useState(false);

    return (
        <div className={styles.eachEventMeetingBookingInformation}>
            <p className={styles.eachEventMeetingTitle}>
                Meeting / Event Area Name: {eachEventMeetingBookingInfo.meetingEventsInfoTitle}
            </p>
            {transactionDetails &&
                <p className={styles.eventMeetingBookingEachInfo}>
                    <span className={styles.eventMeetingBookingInfoEachInfoTitle}>Meeting / Event Booked On Date: </span>
                    {getDateTextFromFullDate(transactionDetails.transactionDateTime)}
                </p>
            }
            {(Object.hasOwn(eachEventMeetingBookingInfo, 'allDatesBookingInformation')) &&
                <div className={styles.allDateNumber}>
                    {(eachEventMeetingBookingInfo.allDatesBookingInformation).map(function(eachBookingDate){
                        return(
                            <EventMeetingEachDayNonContinuous eachBookingDate={eachBookingDate} />
                        )
                   })} 
                </div>
            }
            <p>
                <span className={styles.totalValueTitle}>Total Price All Rooms: </span>
                {CURRENCY_SYMBOL}{eachEventMeetingBookingInfo.totalPriceOfAllDates}
            </p>

            <div className={styles.buttonContainer}>
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
    );
}

export default EventMeetingMultipleDateNonContinuousBookingInfo;