import React, { useEffect } from "react";

const Profile = () => {

    useEffect(() => {
        const check = () => {

        }   
        check(); 
    },[]);

    return (
    <div className="text-center mt-5">
        <h1> This is the Profile page </h1>
        <button onClick={() => window.location="/home"} className="btn btn-dark mr-3 mt-3"> Home </button>
        <button onClick={() => window.location="/"} className="btn btn-dark mr-3 mt-3"> logout </button>
    </div>
    );
}

export default Profile;