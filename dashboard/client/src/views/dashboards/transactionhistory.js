import React from "react";
import './dashboard.css';
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/footer";

const API_URL = process.env.REACT_APP_API_URL;

const Transaction = (props) => (
    <tr>
        <td>{props.transaction.date}</td>
        <td>{props.transaction.location}</td>
        <td>{props.transaction.name}</td>
        <td className="comments transactionComments" id={props.transaction.comment}>{props.transaction.comment}</td>
        <td><button className="delete" onClick={() => props.delTransac(props.transaction._id, props.transaction.comment, props.transaction.location, props.transaction.name)}><img src="https://impact.codeninjas.com/assets/delete.svg"></img></button></td>
    </tr>
);

export default function TransactionHistory(){
    const [transactions, setTransactions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const loc = "transactionHistory";

    useEffect(() => {
        if (!isSearching){
            getTransactions();
        }
    }, [])

    async function getTransactions() {
        let response = await fetch(`${API_URL}/records/${loc}`);
        if (!response.ok){
            console.error(`An error occurred: ${response.statusText}`);
            return;
        }
        const transactions = await response.json();
        setTransactions(transactions);
    }
    function transactionList(){
        return transactions.map((transaction) => {
            return (
                <Transaction 
                transaction={transaction}
                delTransac={(id, cmnt, location, name) => delTransac(id, cmnt, location, name)}
                key = {transaction._id}/>
            )
        })
    }
    async function findCom(){
        setIsSearching(true); 
        let name = document.getElementById("searchbar").value;
        if (name === ''){
            setIsSearching(false);
            getTransactions(loc);
            return; 
        }
        let response = await fetch(`${API_URL}/records/comments/${name}/${loc}`);
        if(!response.ok){
            console.error(`An error occurred: ${response.statusText}`);
            alert("Comments not found")
            setIsSearching(false); 
            document.getElementById("searchbar").value = '';
            return;
        }
        const transaction = await response.json();
        setTransactions(transaction);
        setIsSearching(false); 
        document.getElementById("searchbar").value = '';
    }
    async function delTransac(id, cmnt, location, name){
        const delNin = false;
        let comment = document.getElementById(cmnt).innerText;
        let response = await fetch(`${API_URL}/records/${id}`, {
            method: "DELETE", 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ loc, delNin, comment, location, name })
        });
        if (!response.ok){
            console.error(`An error occurred: ${response.statusText}`);
            return;
        }
        alert(`Deleted transaction: \nName: ${name}\nLocation: ${location}\nComments: ${comment}`)
        setTransactions(prevtransactions => prevtransactions.filter(transactions => transactions._id !== id));
    }
    return (
        <div className="bg">  
            <Navbar name="Sensei" title="History"/> 
            <header>
                <h1 className="welc">Past Transactions</h1> 
            </header>
            
            <div className="body transactionBody">
                <div className="search">
                    <input type="text" placeholder="Search for ninjas..." className="searchBar" id="searchbar" autoComplete='off'></input>
                    <button className="searchButton" onClick={findCom}></button>
                </div>
                <table>
                    <thead>
                        <tr className="header">
                            <th>Date</th>
                            <th>Location</th>
                            <th>Name</th>
                            <th>Comments</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>     
                        {transactionList()}   
                    </tbody>
                </table>
            </div>

            <footer>
                <Footer/>
            </footer>      
        </div>
    )
};