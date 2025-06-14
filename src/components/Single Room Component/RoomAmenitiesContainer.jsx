"use client"
import styles from "./RoomAmenitiesContainer.module.css";

import ErrorBoundary from '@/components/Error Boundary/ErrorBoundary.jsx';


function RoomAmenitiesContainerFunctionalComponent(props){
    const roomInfo = props.roomInfo;
    
    return (
        <div className={styles.amenitiesContainer}>
            <h3>Amenities</h3>
            <div className={styles.amenities}>
                <div className={styles.amenitiesSubContainer}>
                    <h5>Room</h5>
                    <ul>
                        {(roomInfo.amenities.room).map(function(element){
                            return (<li key={element}>{element}</li>)
                        })}
                    </ul>
                </div>
                <div className={styles.amenitiesSubContainer}>
                    <h5>Technology</h5>
                    <ul>
                        {(roomInfo.amenities.technology).map(function(element){
                            return (<li key={element}>{element}</li>)
                        })}
                    </ul>
                </div>
                <div className={styles.amenitiesSubContainer}>
                    <h5>Bathroom</h5>
                    <ul>
                        {(roomInfo.amenities.bathroom).map(function(element){
                            return (<li key={element}>{element}</li>)
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function RoomAmenitiesContainer(props){
    const roomInfo = props.roomInfo;

    return (
        <ErrorBoundary>
            <RoomAmenitiesContainerFunctionalComponent roomInfo={roomInfo} />
        </ErrorBoundary>
    );
}

export default RoomAmenitiesContainer;