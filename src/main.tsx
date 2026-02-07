import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './css/index.css';
import { ThemeProvider } from './context/ThemeProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
   <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
         <App />
      </ThemeProvider>
   </BrowserRouter>,
);
