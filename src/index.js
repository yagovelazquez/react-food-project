import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from './store/auth-context';
import CartProvider from './store/cartProvider';


import './index.css';

import App from './App';


ReactDOM.render(<BrowserRouter>     <CartProvider><AuthContextProvider><App /> </AuthContextProvider> </CartProvider> </BrowserRouter>, document.getElementById('root'));
