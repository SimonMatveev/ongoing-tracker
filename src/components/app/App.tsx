import { useState, useEffect, FC } from "react";
import RedirectPage from "../redirect-page/RedirectPage";
import api from "../../utils/shikiApi";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import currentUserContext from "../../contexts/currentUserContext";
import './app.css';
import ProtectedRouteElement from "../protected-route/ProtectedRoute";
import Authorization from "../authorization/Authorization";
import MainScreen from "../main-screen/MainScreen";
import Home from "../home/Home";
import Header from "../header/Header";
import { ICurrentUser } from "../../types/types";
import { TOKEN_NAME } from "../../utils/constants";

const App: FC = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<ICurrentUser | null>(null);
  const [tokenChecking, setTokenChecking] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    api.logout();
    setLoggedIn(false);
  }

  const handleAutorization = () => {
    setLoggedIn(true);
    setTokenChecking(false);
    if (location.pathname === '/sign-in') navigate('/', { replace: true });
    api.getCurrentUser()
      .then(res => {
        setCurrentUser(res);
      })
      .catch(err => console.log(err));
  }

  const tokenCheck = () => {
    if (localStorage.getItem(TOKEN_NAME)) {
      const AUTH_TOKEN = JSON.parse(localStorage.getItem(TOKEN_NAME) as string);
      api.getNewToken(AUTH_TOKEN['refresh_token'])
        .then(res => {
          localStorage.setItem('ShikiTokenObj', JSON.stringify(res));
          handleAutorization();
        })
        .catch(err => {
          console.log(err);
          navigate('/sign-in', { replace: true });
        });
      // .finally() loading: false
    } else {
      setLoggedIn(false);
      setTokenChecking(false);
    }
  }

  useEffect(() => {
    tokenCheck();
  }, [])

  return (
    <currentUserContext.Provider value={currentUser}>
      <div className="page">
        {isLoggedIn && <Header onLogout={handleLogout} />}
        <Routes>
          <Route path='/' element={
            <ProtectedRouteElement isLoggedIn={isLoggedIn} tokenChecking={tokenChecking}>
              <MainScreen />
            </ProtectedRouteElement>
          } />
          <Route path="/profile" element={<ProtectedRouteElement isLoggedIn={isLoggedIn} tokenChecking={tokenChecking}>
            <Home />
          </ProtectedRouteElement>} />
          <Route path="/sign-in" element={<Authorization />} />
          <Route path='/redirect' element={<RedirectPage />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </div>
    </currentUserContext.Provider>
  );
}

export default App;
