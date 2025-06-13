import PastDiningBookingPage from "@/components/Admin Page Component/Past Booking Page Component/PastDiningBookingPage.jsx";


export function generateMetadata(){
    return {
        title: 'View Past Dining Booking'
    }   
}

export default function Page(){
    return (
        <div>
            <PastDiningBookingPage />
        </div>
    );
}