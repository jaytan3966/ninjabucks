import React from 'react';
import './homelog.css';
import { Link } from 'react-router-dom';


const Home = () => {
    return (
        <div className="background">
            <div className="description">
                <img className="logo" src={require("./logo.png")} alt="Logo"/>
                <h1 className="dashboard-title">NinjaBucks Dashboard</h1>
               
                <Link className="dashboardButtons" to="/SenseiLogin">Sensei Login</Link>
                <Link className="dashboardButtons" to="/NinjaLogin">Ninja Login</Link>

                <a href="https://impact.codeninjas.com/login" target="_blank" className="IMPACTbutton"><div>Go to</div></a>               
                <a href="https://impact.codeninjas.com/login" target="_blank" className="IMPACTbutton"><img src="https://impact.codeninjas.com/assets/impact-logo.png" className="logo"></img></a>
            </div> 
        </div>
    )
}

export default Home;