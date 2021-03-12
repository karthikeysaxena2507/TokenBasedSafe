import React, { useEffect } from "react";

const Home = () => {

    useEffect(() => {
        const check = () => {

        }   
        check(); 
    },[]);

    return (
    <div className="text-center mt-5">
        <h1> This is the Home page </h1>
        <button onClick={() => window.location="/profile"} className="btn btn-dark mr-3 mt-3"> Profile </button>
        <button onClick={() => window.location="/"} className="btn btn-dark mr-3 mt-3"> Logout </button>
    </div>
    );
}

export default Home;