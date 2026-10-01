interface IProtectedRouteProps {
    children:React.ReactNode;
}

const loginToken = "BEPODDEV";
// Login using this logintoken asked in prompt dialogue
export default function ProtectedRoute({children}: IProtectedRouteProps) {
    const isLoggedIn = localStorage.getItem("bepods-admin-login-token")
    if(isLoggedIn !== loginToken){
        return <>
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Please login to access this page</h1>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => {
                    const token = prompt("Enter your login token");
                    if(token === loginToken){
                        localStorage.setItem("bepods-admin-login-token", token);
                        window.location.reload();
                    } else {
                        alert("Invalid token");
                    }
                }}>Login</button>
            </div>
        </div>
        </>
    }
    else {
        return children;
    }
    

}