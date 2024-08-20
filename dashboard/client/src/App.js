import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./views/homepage/home";
import Login from './views/homepage/login';
import NinjaDashboard from "./views/dashboards/ninjadashboard";
import SenseiDashboard from "./views/dashboards/senseidashboard";
import TransactionHistory from './views/dashboards/transactionhistory';
import NinjaHistory from './views/dashboards/ninjahistory';

function ProtectedRoute({children}){
    const token = localStorage.getItem('token');
    return token ? children: <Navigate to="/" />
}

function App(){
    return(
        <BrowserRouter>     
            <Routes>
                <Route exact path="/" element={<Home/>}></Route>
                <Route exact path="/SenseiLogin" element={<Login title="Sensei"/>}></Route>
                <Route exact path="/NinjaLogin" element={<Login title="Ninja"/>}></Route>
                <Route exact path="/NinjaDashboard" element={<ProtectedRoute><NinjaDashboard/></ProtectedRoute>}></Route>
                <Route exact path="/SenseiView" element={<ProtectedRoute><SenseiDashboard/></ProtectedRoute>}></Route>
                <Route exact path="/Transactions" element={<ProtectedRoute><TransactionHistory/></ProtectedRoute>}></Route>
                <Route exact path="/NinjaHistory" element={<ProtectedRoute><NinjaHistory/></ProtectedRoute>}></Route>
            </Routes>      
        </BrowserRouter>
        
        
        
    )
    
}

export default App;


