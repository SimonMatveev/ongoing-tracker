import './authorization.css';
import api from '../../utils/shikiApi';
import { FC } from 'react';

const Authorization: FC = () => {

  const handleAuthorize = () => {
    api.authorize('user_rates+comments+topics')
  }

  return (
    <div className="authorization">
      <div className="autorization__container">
        <h1 className="autorization__title">Привет! Для использования сайта<br />необходимо авторизироваться</h1>
        <button type="button" className="autorization__button" onClick={handleAuthorize}>Авторизация</button>
      </div>
    </div>
  );
}

export default Authorization;