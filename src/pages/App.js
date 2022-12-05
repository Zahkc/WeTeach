import Home from './pages/home(Teacher)';
import VideoPage from './pages/videoPage(Teacher)';
import Upload from './pages/upload';
import UploadVideo from './pages/uploadVideo';
import StartStream from './pages/startStream'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import './components/vendor/bootstrap/css/bootstrap.min.css';
import './components/vendor/fontawesome-free/css/all.min.css';

function UI() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/UI/' element={<Home/>}/>
          <Route path='/UI/videoPage' element={<VideoPage/>}/>
          <Route path='/UI/upload' element={<Upload/>}/>
          <Route path='/UI/uploadVideo' element={<UploadVideo/>}/>
          <Route path='/UI/startStream' element={<StartStream/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default UI;
