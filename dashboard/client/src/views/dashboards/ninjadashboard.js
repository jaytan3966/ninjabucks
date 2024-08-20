import React from "react";
import './dashboard.css';
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/footer"

export default function NinjaDashboard(){

    const token = localStorage.getItem('token');
    const userInfo = JSON.parse(atob(token.split('.')[1]));
    const [valChanged, setvalChanged] = useState(false);

    const [myBal, setBal] = useState(0);
    const name = userInfo.name;
    const loc = userInfo.location;
    useEffect(() =>{
        getInfo();
    }, [valChanged]);

    async function getInfo(){
        let response = await fetch(`http://localhost:3001/records/${name}/${loc}`);
        if(!response.ok){
            console.error(`An error occurred: ${response.statusText}`);
            return;
        }
        const user = await response.json();
        
        setBal(user[0].balance);
    }
    async function redeemPrize(amnt, cmnt){
        //check if ninja has enough for prize
        if (amnt*-1 > myBal){
            alert("You do not have enough NinjaBucks for this item!");
            return;
        }
        //modify balance 
        let response = await fetch(`http://localhost:3001/records/ninja`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, loc, amnt })
        });
        if (!response.ok){
            alert("Prize was not redeemed, try again");
            return;
        }
        //add comment
        response = await fetch("http://localhost:3001/records/comments", {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, loc, cmnt })
        });
        alert(`Redeemed prize! Ask a sensei for your reward!`)
        setvalChanged(prev => !prev);
    }
    return (
        <div className="bg">  
            <Navbar name="Ninja" title="My Balance"/> 
            <header className="head">
                <h1 className="welc">Welcome, {userInfo.name}!</h1>
                <h1 className="welc">{userInfo.location} Ninja</h1>
            </header>

            <body className="main">
                <h1>You have {myBal} NinjaBucks</h1>
                <div className="rewardHeader">
                    <h1>NinjaBucks Rewards</h1>
                    <table>
                        <tr>
                            <td>
                                <div>Code Ninjas Playing Cards</div>
                                <div>Image</div>
                                <div><button className="redeemBtns" onClick={() => redeemPrize(-1000, "-1000 Redeemed Code Ninjas Playing Cards")}>-1000 NinjaBucks</button></div>
                            </td>
                            <td>
                                <div>Code Ninjas Water Bottle</div>
                                <div>Image</div>
                                <div><button className="redeemBtns" onClick={() => redeemPrize(-1000, "-1000 Redeemed Code Ninjas Water Bottle")}>-1000 NinjaBucks</button></div>
                            </td>
                            <td>
                                <div>Code Ninjas Drawstring Bag</div>
                                <div>Image</div>
                                <div><button className="redeemBtns" onClick={() => redeemPrize(-1000, "-1000 Redeemed Code Ninjas Drawstring Bag")}>-1000 NinjaBucks</button></div>
                            </td>
                            <td>
                                <div>Code Ninjas Stress Ball</div>
                                <div>Image</div>
                                <div><button className="redeemBtns" onClick={() => redeemPrize(-1000, "-1000 Redeemed Code Ninjas Stress Ball")}>-1000 NinjaBucks</button></div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div>Code Ninjas Sunglasses</div>
                                <div>Image</div>
                                <div><button className="redeemBtns" onClick={() => redeemPrize(-1000, "-1000 Redeemed Code Ninjas Sunglasses")}>-1000 NinjaBucks</button></div>
                            </td>
                            <td>
                                <div>Katana Thumb Drive</div>
                                <div>Image</div>
                                <div><button className="redeemBtns" onClick={() => redeemPrize(-1000, "-1000 Redeemed Katana Thumb Drive")}>-1000 NinjaBucks</button></div>
                            </td>
                            <td>
                                <div>Code Ninja Headband</div>
                                <div>Image</div>
                                <div><button className="redeemBtns" onClick={() => redeemPrize(-1000, "-1000 Redeemed Code Ninja Headband")}>-1000 NinjaBucks</button></div>
                            </td>
                            <td>
                                <div>Pie a Sensei</div>
                                <div>Image</div>
                                <div><button className="redeemBtns" onClick={() => redeemPrize(-7500, "-7500 Redeemed Pie a Sensei")}>-7500 NinjaBucks</button></div>
                            </td>
                        </tr>
                    </table>
                </div>
            </body>

            <footer>
                <Footer />
            </footer>
        </div>
    )
}
