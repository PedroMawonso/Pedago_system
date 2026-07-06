import React, { useState } from 'react';
import Header from '../componets/Header';
import Sidebar from '../componets/Sidebar';

function Professores() {
  const [sidebarOpen, setsidebarOpen] = useState(false);
  return (
    <div>
      <Sidebar visible={sidebarOpen}></Sidebar>
      <div>
        <Header onMenuClick={() => setsidebarOpen(!sidebarOpen)}></Header>
      </div>
    </div>
  );
}

export default Professores;
