/* Pages */
import { Fragment } from "react";
import Home from './pages/home';
import Login from './pages/login';
import SearchResults from './pages/search';

import NewStream from './pages/newStream';
import EditStream from './pages/editStream';

import GoLive from './pages/golive';
import WatchStream from './pages/viewStream';
import WatchVideo from './pages/viewVOD';
import Viewer from './pages/viewer';
import Upload from './pages/upload';
import NotFound from './404';
import { Route, Routes} from 'react-router-dom';

import './components/vendor/bootstrap/css/bootstrap.min.css';

/* Custom fonts for this template*/
import './components/vendor/fontawesome-free/css/all.min.css';

/* Custom styles for this template */
import './css/weteach-main.css';

import Header from './pages/header'

function UI() {
  return (

	<div id="page-wrapper">
        
		
        <Routes>
          <Route exact path='/' element={<><Header/><Home/></>}/>
			<Route exact path='/login' element={<Login/>}/>
		  <Route exact path='/search-results' element={<><Header/><SearchResults/></>}/>
		  <Route path="/search-results/:search" element={<><Header/><SearchResults/></>}/>	
		  <Route exact path='/media/new' element={<><Header/><NewStream/></>}/>
		  <Route exact path='/media/:id/present' element={<><Header/><GoLive/></>}/>
		  <Route exact path='/media/:id/' element={<><Header/><EditStream/></>}/>
		  <Route exact path='/media/:id/view/0' element={<><Header/><WatchStream/></>}/>
		  <Route exact path='/media/:id/view/1' element={<><Header/><WatchStream/></>}/>
		  <Route exact path='/media/:id/view/2' element={<><Header/><Viewer/></>}/>
		  <Route exact path='/media/:id/view/3' element={<><Header/><WatchVideo/></>}/>

		  <Route exact path='/media/:id/edit' element={<><Header/><EditStream/></>}/>
		  <Route exact path='/media/:id/details' element={<><Header/><EditStream/></>}/>
		  
		  <Route exact path='/upload' element={<><Header/><Upload/></>}/>

		  <Route path="*" element ={<><Header/><NotFound /></>}/>
        </Routes>
      </div>
  );
}

export default UI;
