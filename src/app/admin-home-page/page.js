import AdminHomePage from "@/components/Admin Page Component/AdminHomePage.jsx";

export function generateMetadata(){
    return {
        title: 'Admin Home Page'
    }   
}

export default function Page(){
    return (
        <div>
            <AdminHomePage />
        </div>
    );
}