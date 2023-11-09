import { FC, useState, useEffect, useRef, FormEventHandler, ChangeEvent, Dispatch, SetStateAction } from 'react';
import api from '../../utils/shikiApi';
import './ongoing.css';
import { useForm } from '../../hooks/useForm';
import { IOngoing } from '../../types/types';
import { CELL_AMOUNT, CELL_WIDTH, LOADING_MSG } from '../../utils/constants';

interface IOngoingProps {
  ongoingItem: IOngoing;
  setLoaded: Dispatch<SetStateAction<boolean>>;
}

const Ongoing: FC<IOngoingProps> = ({ ongoingItem, setLoaded }) => {
  const [ongoing, setOngoing] = useState(ongoingItem);
  const [isLoading, setLoading] = useState({ increment: false, score: false, epScore: false });
  const [isOpen, setOpen] = useState({ score: false, epScore: false });
  const [epCount, setEpCount] = useState(0);
  const [maxEpCount, setMaxEpCount] = useState(0);
  const { values: finalScoreValues, handleChange: handleFinalScoreChange, setValues: setFinalScoreValues } = useForm({ score: ongoing.score });
  const { values: epScoreValues, handleChange: handleEpScoreChange, setValues: setEpScoreValues } = useForm(setEpScores());

  const cells = useRef<HTMLDivElement>(null);

  function setEpScores() {
    return api.parseShikiRating(ongoing, ongoing.anime.episodes || ongoing.anime.episodes_aired);
  }

  const handleEpScoreChangeAndButtons = (e: ChangeEvent<HTMLInputElement>) => {
    handleEpScoreChange(e);
    setOpen({ ...isOpen, epScore: true });
  }

  const handleEpScoreSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setLoading({ ...isLoading, epScore: true });
    api.setEpScores(ongoing.id, epScoreValues)
      .then(res => {
        setOngoing({ ...ongoing, text: res.text });
        setEpScoreValues(api.parseShikiRating(res, ongoing.anime.episodes || ongoing.anime.episodes_aired));
        setOpen({ ...isOpen, epScore: false });
      })
      .catch(err => console.log(err))
      .finally(() => setLoading({ ...isLoading, epScore: false }));
  }

  const handleIncrement = () => {
    setLoading({ ...isLoading, increment: true });
    api.increment(ongoing.id)
      .then(res => setOngoing({ ...ongoing, episodes: res.episodes }))
      .catch(err => console.log(err))
      .finally(() => setLoading({ ...isLoading, increment: false }));
  };

  const handleFinalScoreSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setLoading({ ...isLoading, score: true });
    api.setFinalScore(ongoing.id, finalScoreValues.score)
      .then(res => {
        setOngoing({ ...ongoing, score: res.score });
        setOpen({ ...isOpen, score: false });
      })
      .catch(err => console.log(err))
      .finally(() => setLoading({ ...isLoading, score: false }));
  }

  const handleFinalScoreOpen = () => setOpen({ ...isOpen, score: true });

  const handleFinalScoreClose = () => {
    setOpen({ ...isOpen, score: false });
    setFinalScoreValues({ score: ongoing.score });
  }

  const handleEpScoreClose = () => {
    setOpen({ ...isOpen, epScore: false });
    setEpScoreValues(setEpScores());
  }

  const handlePaginationFwd = () => {
    if (cells.current) cells.current.style.transform = `translateX(calc(-${CELL_WIDTH}px * ${CELL_AMOUNT} * ${maxEpCount + 1 - epCount}))`;
    setEpCount(epCount - 1);
  }

  const handlePaginationBack = () => {
    if (cells.current) cells.current.style.transform = `translateX(calc(-${CELL_WIDTH}px * ${CELL_AMOUNT} * ${maxEpCount - 1 - epCount}))`;
    setEpCount(epCount + 1);
  }

  const isLong = () => ongoing.anime.episodes_aired > 25 || ongoing.anime.episodes > 25;

  useEffect(() => {
    setLoaded(true);
    let counter = 0;
    if (ongoing.anime.episodes > 25) {
      counter = Math.floor(ongoing.anime.episodes / 25);
    } else if (ongoing.anime.episodes_aired > 25) {
      counter = Math.floor(ongoing.anime.episodes_aired / 25);
    }
    setEpCount(counter);
    setMaxEpCount(counter);
  }, []);

  return (
    <>
      <a href={`https://shikimori.me/animes/${ongoing.anime.id}`} target='_blank' rel='noreferrer' className="table__title">{ongoing.anime.russian}</a>
      <span className="table__count">{`${ongoing.episodes}/${ongoing.anime.episodes_aired}`}</span>
      <button
        className={`table__increment${isLoading.increment ? ' table__increment_loading' : ''}${ongoing.episodes >= ongoing.anime.episodes_aired ? ' table__increment_disabled' : ''}`}
        onClick={handleIncrement}
        disabled={ongoing.episodes >= ongoing.anime.episodes_aired}>+
      </button>
      <form className="table__cells" action='#' name={`${ongoing.anime.id}-form`} onSubmit={handleEpScoreSubmit}>
        <div className='table__cells-row'>
          <div className='table__cells-row-container' ref={cells}>
            {Array.from({ length: ongoing.anime.episodes > 0 ? ongoing.anime.episodes : ongoing.anime.episodes_aired }, (_, i) => i + 1).map(el => (
              <input
                key={el}
                className={`table__cell${el <= ongoing.anime.episodes_aired ? ' table__cell_aired' : ''}${el <= ongoing.episodes ? ' table__cell_watched' : ''}`}
                name={el.toString()}
                id={el.toString()}
                value={epScoreValues[el]}
                onChange={handleEpScoreChangeAndButtons}
              />
            ))}
          </div>
        </div>
        <button
          type='button'
          className={`table__cells-pagination table__cells-pagination_t_prev
        ${isLong() ? ' table__cells-pagination_visible' : ''}
        ${epCount >= maxEpCount ? ' table__cells-pagination_disabled' : ''}`}
          onClick={handlePaginationBack}
          disabled={epCount >= maxEpCount} />
        <button
          type='button'
          className={`table__cells-pagination table__cells-pagination_t_next
        ${isLong() ? ' table__cells-pagination_visible' : ''}
        ${epCount <= 0 ? ' table__cells-pagination_disabled' : ''}`}
          onClick={handlePaginationFwd}
          disabled={epCount <= 0} />
        <div className={`table__cells-container${isOpen.epScore ? ' table__cells-container_visible' : ''}`}>
          {isLoading.epScore ?
            <span className='table__cells-loader'>{LOADING_MSG}</span> :
            <>
              <button type='submit' className="table__cells-button">&#10003;</button>
              <button type='submit' className="table__cells-button table__cells-button_t_deny" onClick={handleEpScoreClose}>&#215;</button>
            </>}
        </div>
      </form >
      <span className="table__count-all">{ongoing.anime.episodes > 0 ? ongoing.anime.episodes : '?'}</span>
      <form className="table__score" name='score-form' action="#" onSubmit={handleFinalScoreSubmit}>
        <button type='button' className='table__score-number' onClick={handleFinalScoreOpen}>{finalScoreValues.score !== 0 ? finalScoreValues.score : '-'}</button>
        <div className={`table__score-container${isOpen.score ? ' table__score-container_visible' : ''}`}>
          {isLoading.score ?
            <span className='table__score-loader'>{LOADING_MSG}</span> :
            <>
              <input className='table__score-input' type='range' name='score' id='score' value={finalScoreValues.score} onChange={handleFinalScoreChange} min='0' max='10' />
              <button type='submit' className='table__score-button table__score-button_t_confirm'>&#10003;</button>
              <button type='button' className='table__score-button table__score-button_t_deny' onClick={handleFinalScoreClose}>&#215;</button>
            </>}
        </div>
      </form>
    </>
  );
}

export default Ongoing;