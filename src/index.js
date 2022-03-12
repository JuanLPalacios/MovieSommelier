import './index.css';
import './images/Logo.png';
import Home from './home';
import Details from './details';

new Home(document.getElementById('main')).init();
new Details(document.getElementById('main')).init();