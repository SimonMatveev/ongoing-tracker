import { FC, PropsWithChildren } from 'react';
import { Navigate } from "react-router-dom";
import Spinner from '../spinner/Spinner';

interface IProtectedRouteElementProps {
  isLoggedIn: boolean;
  tokenChecking: boolean;
}

const ProtectedRouteElement: FC<PropsWithChildren<IProtectedRouteElementProps>> = ({ isLoggedIn, tokenChecking, children }) => {
  return (
    !tokenChecking ? (isLoggedIn ? <>{children}</> : <Navigate to="/sign-in" replace />) : <Spinner />
  )
}

export default ProtectedRouteElement; 