import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./views/homepage/home";
import Login from './views/homepage/login';
import NinjaDashboard from "./views/dashboards/ninjadashboard";
import SenseiDashboard from "./views/dashboards/senseidashboard";
import TransactionHistory from './views/dashboards/transactionhistory';
import NinjaHistory from './views/dashboards/ninjahistory';

function ProtectedRoute({children, openAccess}){
    const token = localStorage.getItem('token');
    const userInfo = JSON.parse(atob(token.split('.')[1]));

    if(token){
        if (userInfo.location === "Demo"){
            return children;
        } else {
            try {
                const publicAccess = openAccess === "True";
                return publicAccess ? children: <NavigateToRoot/>
            } catch {
                return <NavigateToRoot/>
            }
        }
    } else {
        return <NavigateToRoot/>
    }
}

function NavigateToRoot() {
    localStorage.removeItem('token');
    return <Navigate to="/" />;
}


function App(){
    return(
        <BrowserRouter>     
            <Routes>
                <Route exact path="/" element={<Home/>}></Route>
                <Route exact path="/SenseiLogin" element={<Login title="Sensei"/>}></Route>
                <Route exact path="/NinjaLogin" element={<Login title="Ninja"/>}></Route>
                <Route exact path="/NinjaDashboard" element={<ProtectedRoute openAccess="True"><NinjaDashboard/></ProtectedRoute>}></Route>
                <Route exact path="/SenseiView" element={<ProtectedRoute openAccess="False"><SenseiDashboard/></ProtectedRoute>}></Route>
                <Route exact path="/Transactions" element={<ProtectedRoute openAccess="False"><TransactionHistory/></ProtectedRoute>}></Route>
                <Route exact path="/NinjaHistory" element={<ProtectedRoute openAccess="True"><NinjaHistory/></ProtectedRoute>}></Route>
            </Routes>      
        </BrowserRouter>
    )
    
}

export default App;


