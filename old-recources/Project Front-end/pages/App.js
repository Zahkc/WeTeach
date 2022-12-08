import Home from './pages/home(Teacher)';
import VideoPage from './pages/videoPage(Teacher)';
import Upload from './pages/upload';
import UploadVideo from './pages/uploadVideo';
import StartStream from './pages/startStream'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import './components/vendor/bootstrap/css/bootstrap.min.css';
import './components/vendor/fontawesome-free/css/all.min.css';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/videoPage' element={<VideoPage/>}/>
          <Route path='/upload' element={<Upload/>}/>
          <Route path='/uploadVideo' element={<UploadVideo/>}/>
          <Route path='/startStream' element={<StartStream/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
