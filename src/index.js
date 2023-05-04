import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from "react-router-dom";

/* Custom fonts for this template*/
import './components/vendor/fontawesome-free/css/all.min.css';

/* Custom styles for this template */
import './css/weteach-main.css';

/* Core plugin JavaScript*/
import 'jquery.easing/jquery.easing.min.js';

/* Date Picker */
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/en-gb';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <React.StrictMode>
	<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
    <HashRouter>
      <App />
    </HashRouter>
	</LocalizationProvider>
  </React.StrictMode>,

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
