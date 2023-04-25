import Home from './pages/home(Teacher)';
import VideoPage from './pages/videoPage(Teacher)';
import Upload from './pages/upload';
import UploadVideo from './pages/uploadVideo';
import StartStream from './pages/startStream';
import WatchStream from './pages/watchStream';
import WatchLive from './pages/watchlive';
import GoLive from './pages/golive';
import PreLive from './pages/prelive';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import './components/vendor/bootstrap/css/bootstrap.min.css';
import './components/vendor/fontawesome-free/css/all.min.css';

function UI() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/videoPage' element={<VideoPage/>}/>
          <Route path='/upload' element={<Upload/>}/>
          <Route path='/uploadVideo' element={<UploadVideo/>}/>
          <Route path='/startStream' element={<StartStream/>}/>
          <Route path='/watchStream' element={<WatchStream/>}/>
          <Route path='/GoLive' element={<GoLive/>}/>
          <Route path='/WatchLive' element={<WatchLive/>}/>
          <Route path='/PreLive' element={<PreLive/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default UI;
