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

        //response is ok but what is going on
        alert(name, password, collection);
        let text = await response.text();
        alert(text);
        if (text){
            let result;
            try{
                result = JSON.parse(text);
            } catch (jsonError) {
                console.error('JSON Parsing Error:', jsonError);
                alert("Failed to parse server response.");
                return;
            }
        
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
                    document.getElementById("name").value = '';
                    document.getElementById("pwd").value = '';
                }
            } else {
                alert("An error occurred: " + result.message || response.statusText);
            }
        } else {
            alert("Empty response from server.");

            document.getElementById("name").value = '';
            document.getElementById("pwd").value = '';
        }
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

