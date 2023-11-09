import { FC } from 'react';
import { NavLink } from "react-router-dom";
import './header.css';

interface IHeaderProps {
  onLogout: () => void;
}

const Header: FC<IHeaderProps> = ({ onLogout }) => {
  return (
    <header className="header">
      <h1 className="header__logo">Ongoing Tracker</h1>
      <nav className="header__menu">
        <ul className="header__menu-list">
          <li className="header__menu-item">
            <NavLink className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "header__menu-link header__menu-link_active" : "header__menu-link"
            } to='/list'>Списки онгоингов</NavLink>
          </li>
          <li className="header__menu-item">
            <NavLink className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "header__menu-link header__menu-link_active" : "header__menu-link"
            } to='/profile'>Профиль</NavLink>
          </li>
          <li className="header__menu-item">
            <NavLink className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "header__menu-link header__menu-link_active" : "header__menu-link"
            } to='/'>Трекер</NavLink>
          </li>
        </ul>
      </nav>
      <button className="header__logout" type="button" onClick={onLogout}>Выйти</button>
    </header>
  );
}

export default Header;