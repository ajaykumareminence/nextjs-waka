export default function AuthLayout({ children }) {
    return (
        <section className="d-flex align-items-center" style={{minHeight: '100vh'}}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    )
}