import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Room from '../pages/Room';
import Signup from '../pages/Signup';

const routes = [
  {
    path: '/',
    element: <App></App>,
    children: [
      { path: '', element: <Home></Home> },
      { path: '/login', element: <Login></Login> },
      { path: '/room/:roomId', element: <Room></Room> },
      { path: '/signup', element: <Signup></Signup> },
    ],
  },
];

export default routes;
