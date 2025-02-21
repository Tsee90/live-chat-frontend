import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Room from '../pages/Room';

const routes = [
  {
    path: '/',
    element: <App></App>,
    children: [
      { path: '', element: <Home></Home> },
      { path: '/login', element: <Login></Login> },
      { path: '/room/:roomId', element: <Room></Room> },
    ],
  },
];

export default routes;
