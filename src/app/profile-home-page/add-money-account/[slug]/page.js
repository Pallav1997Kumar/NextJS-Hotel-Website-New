import AddMoneyInAccount from "@/components/Profile Page Component/Account Balance Component/AddMoneyInAccount.jsx"

export function generateMetadata(){
    return {
        title: 'Add Money to Account'
    }
}

export default function Page(){
    return (
        <div>
            <AddMoneyInAccount />
        </div>
    );
}