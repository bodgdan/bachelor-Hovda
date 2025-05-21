import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/navbar';
import './mainMenu.css';
import { Link } from 'react-router-dom';
import axios from 'axios';


const MainMenu = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/stats', {
          withCredentials: true, // Send cookies for auth
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="main-menu"><Navbar /><div className="main-menu-container">Завантаження...</div></div>;
  }

  if (!stats) {
    return <div className="main-menu"><Navbar /><div className="main-menu-container">Не вдалося отримати дані.</div></div>;
  }

  return (
    <div className="main-menu">
      <Navbar />
      <div className="main-menu-container">
        <h1 className="main-title">Головне</h1>

        <div className="stats-row">
          <div className="stat-card">
            <div>Заг. к-сть складів</div>
            <div className="stat-value">{stats.warehouses}</div>
            <Link to="/warehouses" className="stat-more">Більше</Link>
          </div>
          <div className="stat-card">
            <div>Заг. к-сть товарів</div>
            <div className="stat-value">{stats.goods}</div>
            <Link to="/goods" className="stat-more">Більше</Link>
          </div>
          <div className="stat-card">
            <div>Заг. к-сть клієнтів</div>
            <div className="stat-value">{stats.clients}</div>
            <Link to="/clients" className="stat-more">Більше</Link>
          </div>
        </div>

        <div className="warehouse-table">
          <div className="table-title">Заповненість складів</div>
          <div className="table-content">
            {stats.warehouseFill.map((w, i) => (
              <div className="table-row" key={i}>
                <div className="warehouse-name"><strong>{w.name}</strong></div>
                <div className="warehouse-qty">{w.quantity}</div>
              </div>
            ))}
          </div>
          <Link to="/warehouses" className="stat-more">Більше</Link>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
