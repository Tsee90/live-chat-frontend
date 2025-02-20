import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';

const routes = [
  {
    path: '/',
    element: <App></App>,
    children: [
      { path: '', element: <Home></Home> },
      { path: '/login', element: <Login></Login> },
    ],
  },
];

export default routes;
