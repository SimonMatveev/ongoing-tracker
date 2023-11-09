export interface IOngoing {
  id: number;
  text: string;
  score: number;
  episodes: number;
  anime: {
    status: 'ongoing';
    russian: string;
    episodes: number;
    episodes_aired: number;
    id: number;
  }
}

export interface ICurrentUser {
  nickname: string;
  id: number;
}