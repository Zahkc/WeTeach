import Home from './pages/home';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import './App.css';
import './css/kf.css';
import './css/styles.css';

import './components/vendor/bootstrap/css/bootstrap.min.css';
import './components/vendor/fontawesome-free/css/all.min.css';


function UI() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default UI;
