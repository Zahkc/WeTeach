import React, {useState, Fragment} from 'react';
import {NavLink, Link, useNavigate, useLocation} from 'react-router-dom';
import SideBar from './sidebar(Teacher)'
import NavBar from './navBar'

import './golive.css';

function Search(){

  let {state} = useLocation();

  let searchVar = state.searchVar;

  return(
    <Fragment>
    <NavBar/>
    <SideBar/>
    <body className="align">
      <h1> Showing results for: {searchVar} </h1>
    </body>
    </Fragment>
  );
}

export default Search;
