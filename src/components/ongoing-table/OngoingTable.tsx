import { FC, useState, MouseEventHandler } from 'react';
import './ongoing-table.css';
import Ongoing from '../ongoing/Ongoing';
import Spinner from '../spinner/Spinner';
import { IOngoing } from '../../types/types';

interface IOngoingTableProps {
  ongoings: IOngoing[];
}

const OngoingTable: FC<IOngoingTableProps> = ({ ongoings }) => {
  const [isLoaded, setLoaded] = useState(false);
  const [sortType, setSortType] = useState(localStorage.getItem('sortOrder') || '');
  const [sortClicked, setSortClicked] = useState<boolean>(JSON.parse(localStorage.getItem('sortClicked') as string) === true || false);

  const handleSort: MouseEventHandler<HTMLButtonElement> = (e) => {
    if ((e.target as HTMLButtonElement).id === sortType) {
      localStorage.setItem('sortClicked', String(!sortClicked));
      setSortClicked(!sortClicked);
    } else {
      localStorage.setItem('sortClicked', String(false));
      setSortClicked(false);
    }
    localStorage.setItem('sortOrder', (e.target as HTMLButtonElement).id);
    setSortType((e.target as HTMLButtonElement).id);
  }

  const sortByTitle = (a: IOngoing, b: IOngoing) => {
    return a.anime.russian.localeCompare(b.anime.russian);
  }

  const sortByCurrentEpisodes = (a: IOngoing, b: IOngoing) => {
    if (a.episodes < b.episodes) {
      return 1;
    } else if (a.episodes > b.episodes) {
      return -1;
    } else {
      return 0;
    }
  }

  const sortByTotalEpisodes = (a: IOngoing, b: IOngoing) => {
    const aTemp = a.anime.episodes !== 0 ? a.anime.episodes : a.anime.episodes_aired;
    const bTemp = b.anime.episodes !== 0 ? b.anime.episodes : b.anime.episodes_aired;
    if (aTemp < bTemp) {
      return 1;
    } else if (aTemp > bTemp) {
      return -1;
    } else {
      return 0;
    }
  }

  const sortByTotalScore = (a: IOngoing, b: IOngoing) => {
    if (a.score < b.score) {
      return 1;
    } else if (a.score > b.score) {
      return -1;
    } else {
      return 0;
    }
  }

  return (
    <div className='table'>
      <button className={`table__header${sortType === "title" ? " table__header_sort" : ""}${sortClicked ? " table__header_sort_r" : ""}`}
        type="button" id="title" onClick={handleSort}>Название</button>
      <button className={`table__header table__header_t_count${sortType === "currentEpisodes" ? " table__header_sort" : ""}${sortClicked ? " table__header_sort_r" : ""}`}
        type="button" id="currentEpisodes" onClick={handleSort}>Смотрю</button>
      <button className={`table__header${sortType === "currentEpisodesToo" ? " table__header_sort" : ""}${sortClicked ? " table__header_sort_r" : ""}`}
        type="button" id="currentEpisodesToo" onClick={handleSort}>Серии</button>
      <button className={`table__header${sortType === "totalEpisodes" ? " table__header_sort" : ""}${sortClicked ? " table__header_sort_r" : ""}`}
        type="button" id="totalEpisodes" onClick={handleSort}>Всего серий</button>
      <button className={`table__header${sortType === "totalScore" ? " table__header_sort" : ""}${sortClicked ? " table__header_sort_r" : ""}`}
        type="button" id="totalScore" onClick={handleSort}>Оценка</button>
      {ongoings.sort((a, b) => {
        switch (sortType) {
          case ('title'):
            return sortByTitle(a, b) * (sortClicked ? -1 : 1);
          case ('currentEpisodes'):
          case ('currentEpisodesToo'):
            return sortByCurrentEpisodes(a, b) * (sortClicked ? -1 : 1);
          case ('totalEpisodes'):
            return sortByTotalEpisodes(a, b) * (sortClicked ? -1 : 1);
          case ('totalScore'):
            return sortByTotalScore(a, b) * (sortClicked ? -1 : 1);
          default:
            return 0;
        }
      }).map(ongoing => (
        <Ongoing key={ongoing.id} ongoingItem={ongoing} setLoaded={setLoaded} />
      ))}
      {!isLoaded && <Spinner small />}
    </div>
  );
}

export default OngoingTable;