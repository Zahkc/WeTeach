/* Pages */
import Home from './pages/home';
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
		<Header/>
        <Routes>
          <Route exact path='/' element={<Home/>}/>
		  <Route exact path='/media/new' element={<NewStream/>}/>
		  <Route exact path='/media/:id/present' element={<GoLive/>}/>
		  <Route exact path='/media/:id/' element={<EditStream/>}/>
		  <Route exact path='/media/:id/view/0' element={<WatchStream/>}/>
		  <Route exact path='/media/:id/view/1' element={<WatchStream/>}/>
		  <Route exact path='/media/:id/view/2' element={<Viewer/>}/>
		  <Route exact path='/media/:id/view/3' element={<WatchVideo/>}/>

		  <Route exact path='/media/:id/edit' element={<EditStream/>}/>
		  <Route exact path='/upload' element={<Upload/>}/>

		  <Route path="*" element ={<NotFound />}/>
        </Routes>
      </div>
  );
}

export default UI;
