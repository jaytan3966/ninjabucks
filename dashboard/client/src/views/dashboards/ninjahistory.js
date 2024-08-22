import React from "react";
import './dashboard.css';
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

const API_URL = process.env.REACT_APP_API_URL;

const Comments = (props) => {
    return (
        <tr>
            <td>{props.cmnt.date}</td>
            <td>{props.cmnt.comment}</td>
        </tr>
)}

export default function NinjaHistory() {
    const token = localStorage.getItem('token');
    const userInfo = JSON.parse(atob(token.split('.')[1]));

    const name = userInfo.name;
    const loc = "transactionHistory";

    const [cmnts, setCmnt] = useState([]);

    useEffect(() => {
        getCmnts();
    }, [name])

    async function getCmnts(){
        let response = await fetch(`${API_URL}/records/comments/${name}/${loc}`);

        if(!response.ok){
            console.error(`An error occurred: ${response.statusText}`);
            return;
        }
        const cmnt = await response.json();
        setCmnt(cmnt);
    }
    function cmntList(){
        return cmnts.map((cmnt) => {
            return (
                <Comments 
                cmnt={cmnt}
                key={cmnt._id}
                />
            )
        })
    }
    return (
        <div className="bg">  
            <Navbar name="Ninja" title="My Transactions"/> 
            <h1 className="welc">Welcome, {name}!</h1>
            <div className="scrollable">
                <table>
                    <thead>
                        <tr className="header">
                            <th>Date</th>
                            <th>Transactions </th>
                        </tr>
                    </thead>
                    <tbody>     
                        {cmntList()}    
                    </tbody>
                </table>
            </div>
            <footer><Footer/></footer>
        </div>
    )
}
