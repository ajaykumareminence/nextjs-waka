import Header from "@/components/common/Header.js"
import ReactClient from "@/api/ReactClient.js"
export default function DashboardLayout({ children }) {
    return (
        <>
            <Header />
            <ReactClient>
                {children}
            </ReactClient>
        </>
    )
}