import React from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import './navbar.css';
import axios from 'axios';

import Logo from "../../assets/Logo.svg"

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };
  return (
    <nav className="navbar">
      <img src={Logo} alt="" />
      <ul className="nav-links">
        <li><Link to="/main-menu">Головна</Link></li>
        <li><Link to="/warehouses">Склади</Link></li>
        <li><Link to="/goods">Товари</Link></li>
        <li><Link to="/clients">Клієнти</Link></li>


        <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Вийти</li>
      </ul>
    </nav>
  );
};

export default Navbar;
