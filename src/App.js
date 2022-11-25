import React from 'react';
import GoLive from './golive'
import Test from './View'
import Home from './Home'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return(
    <div>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route exact path='/view' element={<Test/>}/>
          <Route exact path='/live' element={<GoLive/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
