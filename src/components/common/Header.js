import Link from "next/link";
import LogoutDialog from "./LogoutDialog.js";
export default function Header() {
    return (
        <>
            <nav className="navbar bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand">Navbar</a>
                    <div className="d-flex gap-3 align-items-center">
                        <Link href="/dashboard/profile">Profile</Link>
                        <Link href="/dashboard/activity-logs">Activity Logs</Link>
                        <Link href="/dashboard/find_friends">Find Friends</Link>
                        <LogoutDialog />
                    </div>
                </div>
            </nav>
        </>
    )
}