import { useState, useEffect, useContext, FC } from "react";
import api from "../../utils/shikiApi";
import './main-screen.css';
import currentUserContext from "../../contexts/currentUserContext";
import OngoingTable from "../ongoing-table/OngoingTable";
import Spinner from "../spinner/Spinner";
import { IOngoing } from "../../types/types";

const MainScreen: FC = () => {
  const currentUser = useContext(currentUserContext);
  const [ongoings, setOngoings] = useState<IOngoing[]>([]);

  function handleOngoing(id: number) {
    api.getOngoing(id)
      .then(res => {
        setOngoings(res);
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    if (currentUser) handleOngoing(currentUser.id);
  }, [currentUser]);

  return (
    <div className="main-screen">
      <div className="main-screen__container">
        {(currentUser && currentUser.nickname) ?
          <>
            <h1 className="main-screen__title">Привет, {currentUser.nickname}</h1>
            <OngoingTable ongoings={ongoings} />
          </> :
          <Spinner />}
      </div>
    </div>
  );
}

export default MainScreen;