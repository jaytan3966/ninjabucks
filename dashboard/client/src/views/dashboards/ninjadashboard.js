import React from "react";
import './dashboard.css';
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/footer"

const Reward = ({ name, imgSrc, cost, redeemPrize }) => {
    return (
        <td>
            <div>{name}</div>
            <div><img src={require(`${imgSrc}`)} className="imgs" alt={name}></img></div>
            <div><button className="redeemBtns" onClick={() => redeemPrize(cost, `${cost} Redeemed ${name}`)}>{cost} NinjaBucks</button></div>
        </td>
)}

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
        alert(`${cmnt}! Ask a sensei for your reward!`)
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
                            <Reward 
                                name="Code Ninjas Playing Cards"
                                imgSrc="./rewardImgs/cards.jpg"
                                cost="-1000"
                                redeemPrize = {(amnt, cmnt) => redeemPrize(amnt, cmnt)}
                            />
                            <Reward 
                                name="Code Ninjas Water Bottle"
                                imgSrc="./rewardImgs/waterbottle.jpg"
                                cost="-1000"
                                redeemPrize = {(amnt, cmnt) => redeemPrize(amnt, cmnt)}
                            />
                            <Reward 
                                name="Code Ninjas Drawstring Bag"
                                imgSrc="./rewardImgs/bag.jpg"
                                cost="-1000"
                                redeemPrize = {(amnt, cmnt) => redeemPrize(amnt, cmnt)}
                            />
                            <Reward 
                                name="Code Ninjas Stress Ball"
                                imgSrc="./rewardImgs/ball.jpg"
                                cost="-1000"
                                redeemPrize = {(amnt, cmnt) => redeemPrize(amnt, cmnt)}
                            />
                        </tr>
                        <tr>
                            <Reward 
                                name="Code Ninjas Sunglasses"
                                imgSrc="./rewardImgs/glasses.jpg"
                                cost="-1000"
                                redeemPrize = {(amnt, cmnt) => redeemPrize(amnt, cmnt)}
                            />
                            <Reward 
                                name="Katana Thumb Drive"
                                imgSrc="./rewardImgs/thumbdrive.jpg"
                                cost="-1000"
                                redeemPrize = {(amnt, cmnt) => redeemPrize(amnt, cmnt)}
                            />
                            <Reward 
                                name="Code Ninja Headband"
                                imgSrc="./rewardImgs/headband.jpg"
                                cost="-1000"
                                redeemPrize = {(amnt, cmnt) => redeemPrize(amnt, cmnt)}
                            />
                            <Reward 
                                name="Pie a Sensei"
                                imgSrc="./rewardImgs/pie.jpg"
                                cost="-7500"
                                redeemPrize = {(amnt, cmnt) => redeemPrize(amnt, cmnt)}
                            />
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
