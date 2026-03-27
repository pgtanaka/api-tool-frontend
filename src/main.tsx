import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { CookiesProvider } from "react-cookie";// useCookies
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
	palette: {
    		mode: 'dark',
  	},
});

const Login = lazy(() => import('./Login'));
const GetAPI = lazy(() => import('./App'));
const Profile = lazy(() => import('./Profile'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <CookiesProvider>
  <ThemeProvider theme={darkTheme}>
  <CssBaseline />
    <BrowserRouter>
    <Suspense fallback={<div>Loading...</div>}>
      <nav>
      <Link to="/">[Login]</Link>
      <Link to="/api">[API Tool]</Link>
      <Link to="/profile">[Profile]</Link>
      </nav>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/api' element={<GetAPI />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </Suspense>
    </BrowserRouter>
  </ThemeProvider>
  </CookiesProvider>
  </StrictMode>,
)
