import React from 'react';
import Header from '../componets/Header';
import Sidebar from '../componets/Sidebar';
import { useState } from 'react';

function Dashboard() {
  const [sidebarOpen, setsidebarOpen] = useState(false);
  return (
    <div>
      {<Sidebar visible={sidebarOpen}></Sidebar>}
      <div className=''>
        <Header onMenuClick={() => setsidebarOpen(!sidebarOpen)}></Header>
      </div>
    </div>
  );
}

export default Dashboard;
