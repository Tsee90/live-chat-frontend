import Nav from './components/Nav';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function App() {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  );
}

export default App;
