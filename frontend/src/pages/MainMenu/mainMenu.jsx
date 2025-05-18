import React from 'react';
import Navbar from '../../components/Navbar/navbar';

const MainMenu = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1>Головне меню</h1>
        <p>Ласкаво просимо до системи управління складами!</p>
      </div>
    </div>
  );
};

export default MainMenu;
