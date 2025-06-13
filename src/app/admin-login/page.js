import AdminLogin from "@/components/Authentication Component/AdminLogin.jsx";


export function generateMetadata(){
    return {
        title: 'Royal Palace- Admin Login'
    }
}


export default function Page(){
    return(
        <div>
            <AdminLogin />
        </div>
    );
}