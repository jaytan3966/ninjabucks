import React from 'react';
import './homelog.css';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function Login(props) {
    const title = props.title;
    const navigate = useNavigate();

    async function onSubmit(){
        let name = document.getElementById("name").value;
        let password = document.getElementById("pwd").value;
        let collection;

        console.log('API URL:', API_URL);

        if (title === "Sensei"){
            collection = "senseiLogin"
        } else {
            collection = "ninjaLogin"
        }
        let response = await fetch(`${API_URL}/records/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, password, collection })
        });
        let result = await response.json();
        if (response.ok){
            if (result.token){
                localStorage.setItem('token', result.token)
                if (title === "Sensei"){
                    navigate('/SenseiView');
                } else {
                    navigate('/NinjaDashboard')
                }
            } else {
                alert("Invalid credentials!");
            }
        } else {
                alert("An error occurred: " + result.message || response.statusText);
        }
       
        document.getElementById("name").value = '';
        document.getElementById("pwd").value = '';
        
        setTimeout(() => {
            localStorage.removeItem('token');
            window.location.href = '/';
            alert("Session expired, please login again");
        }, 900000);
    }

    return (
        <div className="background">
            <div className="description">
                <img className="logo" src={require("./logo.png")} alt="Logo"/>
                <h1 className="dashboard-title">{title} Dashboard Login</h1>

                <div className='loginButtons'>
                    <input type="text" placeholder='Enter name here...' className='btns' id="name" autoComplete='off'></input>
                    <input type="text" placeholder='Enter password here...' className='btns' id="pwd" autoComplete='off'></input>
                    <button className='submit' onClick={onSubmit}>Submit</button>
                </div>
            </div> 
        </div>
    )
}

