import { FC } from 'react';
import './spinner.css'

interface ISpinnerProps {
  small?: boolean;
}

const Spinner: FC<ISpinnerProps> = ({ small }) => (
  <div className={`spinner${small ? ' spinner_small' : ''}`}></div>
);

export default Spinner;
