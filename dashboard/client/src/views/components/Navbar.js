import React from 'react';
import { Link } from 'react-router-dom';
import './navfoot.css';


const handleLogout = () => {
    localStorage.removeItem('token');
}

export default function Navbar(props){
    const user = props.name;
    let homeLink;
    let history;
    let dashboard;
    
    if (user === "Sensei"){
        homeLink = "https://codeninjas.haisenhaven.com";
        history = "/Transactions";
        dashboard = "/SenseiView";
    } else {
        homeLink = "https://impact.codeninjas.com/";
        history = "/NinjaHistory"
        dashboard = "/NinjaDashboard";
    }
    

    return (   
        <div className='navbar'>
            <a href={homeLink} target="_blank"><img src='https://impact.codeninjas.com/assets/NinjaHead.svg'></img></a>
            <h1 className='dashboardTitle'>{props.title}</h1>
            <h1 className='dashboardTitle'>{props.name} View</h1>
                
            <nav>
                <Link to="/" onClick={handleLogout}><img src='https://impact.codeninjas.com/assets/home.svg' className='btn'></img></Link>
                <Link to={history}><img src='https://impact.codeninjas.com/assets/mystuff.svg' className='btn'></img></Link>
                <Link to={dashboard}><img src='https://impact.codeninjas.com/assets/community.svg' className='btn'></img></Link>
            </nav>
        </div>
    )
}