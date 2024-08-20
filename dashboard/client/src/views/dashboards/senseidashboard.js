import React from "react";
import './dashboard.css';
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Popup from 'reactjs-popup';

const Ninjas = (props) => (
    <tr>
        <td className="names">{props.ninja.name}</td>
        <td>{props.ninja.balance}</td>
        <td> 
            <button className="plusminus" onClick={() => props.modBal(props.ninja._id, -1)}>-</button>
            <input type="number" min="0" placeholder="Enter amount" id={props.ninja._id} autoComplete='off'></input>
            <button className="plusminus" onClick={() => props.modBal(props.ninja._id, 1)}>+</button>
        </td>
        <td>
            <input type="text" placeholder="e.g. +75 for helping another student" className="comments" id={props.ninja.name} autoComplete='off'></input>
            <button className="submit" onClick={() => props.addCom(props.ninja.name)}>submit</button> 
        </td>  
        <td><button className="delete" onClick={() => props.delNin(props.ninja._id, props.ninja.name)}><img src="https://impact.codeninjas.com/assets/delete.svg"></img></button></td>
    </tr> 
);

export default function SenseiDashboard(){
    const [ninjas, setNinja] = useState([]);
    const [loc, setLoc] = useState("Folsom");
    const [valChanged, setvalChanged] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (!isSearching){
            getNinjas(loc);
        }
    }, [loc, valChanged]);

    async function getNinjas(loc){
        let response = await fetch(`http://localhost:3001/records/${loc}`)
        
        if(!response.ok){
            console.error(`An error occurred: ${response.statusText}`);
            return;
        }
        const ninjas = await response.json();
        setNinja(ninjas);
    }
    async function findNinja(){
        setIsSearching(true); 
        let name = document.getElementById("searchbar").value;
        if (name === ''){
            setIsSearching(false);
            getNinjas(loc);
            return; 
        }
        let response = await fetch(`http://localhost:3001/records/${name}/${loc}`);
        if(!response.ok){
            console.error(`An error occurred: ${response.statusText}`);
            alert("Ninja not found")
            setIsSearching(false); 
            return;
        }
        const ninja = await response.json();
        setNinja(ninja);
        setIsSearching(false); 
        document.getElementById("searchbar").value = '';
    }
    function ninjaList(){
        return ninjas.map((ninja) => {
            return (
                <Ninjas
                    ninja={ninja}
                    modBal={(id, direction) => modifyBalance(id, direction)}
                    addCom={(name) => addComment(name)}
                    delNin={(id, name) => deleteNinja(id, name)}
                    key={ninja._id}
                />
            );
        });
    }
    function changeLocTitle(loc){
        setLoc(loc);
        document.getElementById("location").innerText = loc + ` Ninjas`;
    }
    function clear(){
        document.getElementById("newName").value = '';
        document.getElementById("newPwd").value = '';
    }
    async function modifyBalance(id, direction){
        let amnt = document.getElementById(id).value;
        if (amnt !== '' && !isNaN(amnt)){
            amnt = parseInt(amnt)*parseInt(direction);
            let response = await fetch(`http://localhost:3001/records/${id}/${amnt}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ loc })
            });
            if (!response.ok){
                alert("Balance was not modified, try again");
                document.getElementById(id).value = '';
                return;
            }
            alert(`Balance changed by ${amnt}`);
            document.getElementById(id).value = '';
            setvalChanged(prev => !prev);
        } else {
            alert("Please enter valid integer!")
        }
    }
    async function addComment(name){
        let cmnt = document.getElementById(name).value;
        if (cmnt !== ''){
            let response = await fetch(`http://localhost:3001/records/comments`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, loc, cmnt })
            });
            if (!response.ok){
                alert("Comment was not added");
                document.getElementById(name).value = '';
                return;
            }
            alert(`Added comment: ${cmnt}`);
            document.getElementById(name).value = '';
            setvalChanged(prev => !prev);
        } else {
            alert("Please enter valid comment!");
        }
    }
    async function addNinja(){
        let name = document.getElementById("newName").value;
        let pwd = document.getElementById("newPwd").value;

        if (name !== '' && pwd !== ''){
            let response = await fetch(`http://localhost:3001/records/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, pwd, loc })
            });
    
            if (!response.ok){
                alert("New ninja could not be added, try again.");
                return;
            }  
            let newNinja = await response.json();
            setNinja(prevNinjas => [...prevNinjas, newNinja]);
            setvalChanged(prev => !prev);
            alert(`New ninja ${name} has been added with password ${pwd} in the ${loc} database.`);
        } else {
            alert("Please insert values");
        }
        document.getElementById("newName").value = '';
        document.getElementById("newPwd").value = '';
    }
    async function deleteNinja(id, name){
        const delNin = true;
        let response = await fetch(`http://localhost:3001/records/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ loc, delNin, name })
        })
        if (!response.ok){
            alert("Ninja not deleted");
            return;
        } 
        setNinja(prevNinjas => prevNinjas.filter(ninja => ninja._id !== id));
        alert(`Deleted ninja ${name}`);
    }
    return (
        <div className="bg">  
        <Navbar name="Sensei" title="NinjaBucks Balances"/> 
            <header className="head">  
                <h1 className="welc" id="location">Folsom Ninjas</h1> 
            </header>

            <div className="body">  
                <div className="locChange"> 
                    <button className="locChngBtns leftBtn" onClick={() => {changeLocTitle("Folsom")}}>Folsom</button>
                    <button className="locChngBtns" onClick={() => {changeLocTitle("Rocklin")}}>Rocklin</button>
                    <button className="locChngBtns" onClick={() => {changeLocTitle("Roseville")}}>Roseville</button>
                    <button className="locChngBtns rightBtn" onClick={() => {changeLocTitle("Demo")}}>Demo</button>

                    <Popup trigger=
                        {<button className="locChngBtns">NinjaBucks Value</button>}
                            modal nested>
                        {close => (
                            <div className="popup">
                                <div className="popupContent">
                                    <h1>NinjaBucks Values</h1>
                                    <h3>Completing curriculum</h3>
                                    <p>
                                        Completing JR Sratch project: +25<br/>
                                        Complete JR ninja circuits project: +25
                                        Completing IMPACT level: +75<br/>
                                        UNITY Purple/Brown Prove yourself: +75<br/>
                                        Complete JR codeSpark puzzle chapter: +200<br/>
                                        Complete JR 10 week section: +200<br/>
                                        Red belt Project: +300<br/>
                                        Completing a belt: +1000<br/>
                                        Completing Python Club summer project: +3000<br/>
                                        Complete black belt: +7500
                                    </p>
                                    <h3>Good deeds around the dojo</h3>
                                    <p>
                                        Ask a friend to help you solve a coding problem: +25<br/>
                                        Comment on someone else's project: +25<br/>
                                        Ask an insightful question: +25<br/>
                                        Help a friend solve a coding problem: +50<br/>
                                        Volunteering to help, answering questions, or sharing thoughts in the Dojo: +50<br/>
                                        Making someone feel welcomed/reach out to other ninjas: +50<br/>
                                        Do an exceptionally good act in the center (e.g. pick up trash): +50<br/>
                                    </p>
                                    <h3>Rewards (-1000 each)</h3>
                                    <p>
                                        Code Ninjas playing cards<br/>
                                        Code Ninjas water bottle<br/>
                                        Ninja headband<br/>
                                        Code Ninjas sunglasses<br/>
                                        Katana thumb drive<br/>
                                        Code Ninjas Drawstring Bag<br/>
                                        Code Ninjas Stress Ball<br/>
                                    </p>
                                    <h1>Grand Prize</h1>
                                    <h1>Pie a Sensei: -7500</h1>
                                </div>
                                <button onClick={() => close()} className="closeButton">Close</button>
                            </div>
                        )}
                    </Popup>

                    <div className="search">
                        <input type="text" placeholder="Search for ninjas..." className="searchBar" id="searchbar" autoComplete='off'></input>
                        <button className="searchButton" onClick={findNinja}></button>
                    </div>    
                </div>
                    
                <table>   
                    <thead>
                        <tr className="header">
                            <th>Name</th>
                            <th>Balance</th>
                            <th>+/-</th>
                            <th>Comments </th>
                            <th>Delete</th>
                        </tr>
                    </thead>                           
                    <tbody>   
                        {ninjaList()}   
                    </tbody>
                    <tfoot>
                        <tr className="form">
                            <td>add new ninja</td>
                            <td><input type="text" placeholder="Enter ninja name..." className="newNinja" id="newName" autoComplete='off'></input></td>
                            <td><input type="text" placeholder="Enter new password..." className="newPwd" id="newPwd" autoComplete='off'></input></td>
                            <td><button className="add" onClick={addNinja}>add ninja</button></td>
                            <td><button className="clear" onClick={clear}>Clear</button></td>
                        </tr>
                    </tfoot>
                </table> 
            </div>
            <footer>
                <Footer/>
            </footer>
        </div>
    )
}

