import React, { useEffect, useState } from "react";
import axios from "axios";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const check = () => {

        }   
        check(); 
    },[]);

    const add = async() => {
        try {
            const response = await axios.post("/users/login", {email, password})
            if(response.data === "Account Doesn't Exists") setMessage(response.data);
            else if(response.data === "Password is not correct") setMessage(response.data);
            else 
            {
                localStorage.setItem("token", response.data.token);
                window.location = "/home";
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    return (
    <div className="text-center">
    <h2> Login to Your Account </h2>
    <div>
        <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" 
            autoComplete="off" 
            className="mt-3 pt-2 pb-2 pr-2 pl-2"
            required 
        />
    </div>
    <div>
        <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" 
            className="mt-3 pt-2 pb-2 pr-2 pl-2"
            required 
        />
    </div>
    <div>
        <button onClick={() => add()} className="btn btn-dark mt-3"> Login </button>
    </div>
    <div className="mt-3">
        <p> {message} </p>
    </div>
</div>
    )
}

export default Login;