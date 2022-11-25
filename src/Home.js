import React from 'react';
import {Link} from 'react-router-dom';

function Home(){
  return(
    <div>
      <h1>Try This</h1>
      <Link to="/live">Go Live</Link>
      <br></br>
      <Link to="/view">View</Link>
    </div>
  );
}

export default Home;
