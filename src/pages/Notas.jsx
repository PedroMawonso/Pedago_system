import React, { useState } from 'react';
import Header from '../componets/Header';
import Sidebar from '../componets/Sidebar';

function Notas() {
  const [sidebarOpen, setsidebarOpen] = useState(false);
  return (
    <div>
      <Sidebar visible={sidebarOpen}></Sidebar>
      <div>
        <Header onMenuClick={() => setsidebarOpen(!setsidebarOpen)}></Header>
      </div>
    </div>
  );
}

export default Notas;
