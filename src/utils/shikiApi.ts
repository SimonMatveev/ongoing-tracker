import { testData } from "./functions";
import { ICurrentUser, IOngoing } from "../types/types";
import { BASE_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, RESPONSE_TYPE, TOKEN_NAME, USER_AGENT } from "./constants";

interface ShikiApiProps {
  baseUrl: string;
  headers: {
    [key: string]: string;
  };
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  response_type: string;
}

function ShikiApi({ baseUrl, headers, client_id, client_secret, redirect_uri, response_type }: ShikiApiProps) {

  function authorize(scope: string) {
    const authUrl = `https://shikimori.one/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`;
    const authWindow = window.open(authUrl);
    const checkConnect = setInterval(function () {
      if (!authWindow || !authWindow.closed) return;
      clearInterval(checkConnect);
      window.location.reload();
    }, 100);
  }

  function getFirstToken(code: string) {
    return fetch(`https://shikimori.one/oauth/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&code=${code}&redirect_uri=${redirect_uri}&headers=User-agent`, {
      method: 'POST',
      headers: {
        ...headers
      }
    })
      .then(res => testData(res));
  }

  function getNewToken(refresh_token: string) {
    return fetch(`https://shikimori.one/oauth/token?grant_type=refresh_token&client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}`, {
      method: 'POST',
      headers: {
        ...headers
      }
    })
      .then(res => testData(res));
  }

  function getCurrentUser() {
    return fetch(`${baseUrl}/users/whoami`, {
      method: 'GET',
      headers: {
        ...headers,
        Authorization: `Bearer ${JSON.parse(localStorage.getItem(TOKEN_NAME) as string)['access_token']}`
      }
    })
      .then(res => testData<ICurrentUser>(res));
  }

  function logout() {
    localStorage.removeItem(TOKEN_NAME);
  }

  function getOngoing(id: number) {
    return fetch(`${baseUrl}/users/${id}/anime_rates?status=watching&limit=30`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${JSON.parse(localStorage.getItem(TOKEN_NAME) as string)['access_token']}`
      }
    })
      .then(res => testData<IOngoing[]>(res))
      .then(res => res.filter(item => item.anime.status === 'ongoing'));
  }

  function increment(id: number) {
    return fetch(`${baseUrl}/v2/user_rates/${id}/increment`, {
      method: 'POST',
      headers: {
        ...headers,
        Authorization: `Bearer ${JSON.parse(localStorage.getItem(TOKEN_NAME) as string)['access_token']}`
      }
    })
      .then(res => testData<IOngoing>(res));
  }

  function setFinalScore(id: number, score: number) {
    return fetch(`${baseUrl}/v2/user_rates/${id}`, {
      method: 'PATCH',
      headers: {
        ...headers,
        Authorization: `Bearer ${JSON.parse(localStorage.getItem(TOKEN_NAME) as string)['access_token']}`
      },
      body: JSON.stringify({ score })
    })
      .then(res => testData<IOngoing>(res));
  }

  function parseShikiRating(ongoing: IOngoing, episodes: number) {
    const ratings = [];
    const shikiRatings: { [key: number]: any } = {};
    const shikiRatingsMatches = ongoing.text ? Array.from(ongoing.text?.matchAll(/Эпизод(.+): (.+)\//g)) : null;

    shikiRatingsMatches?.forEach(item => shikiRatings[+item[1]] = item[2]);

    for (let i = 1; i <= episodes; i++) {
      ratings[i] = +shikiRatings[i] || '';
    }

    return ratings;
  }

  function setEpScores(id: number, scores: object) {
    const scoresArr = Object.values(scores);
    const eps = scoresArr.map((item, index) => {
      if (item) return `Эпизод ${index + 1}: ${item}/10`;
      return null;
    }).filter(item => item).join('\r\n');
    const text = eps.length > 0 ? `[spoiler=Оценки по эпизодам]\r\n${eps}\r\n[/spoiler]` : '';

    return fetch(`${baseUrl}/v2/user_rates/${id}`, {
      method: 'PATCH',
      headers: {
        ...headers,
        Authorization: `Bearer ${JSON.parse(localStorage.getItem(TOKEN_NAME) as string)['access_token']}`
      },
      body: JSON.stringify({ text })
    })
      .then(res => testData<IOngoing>(res));

  }

  return { authorize, getFirstToken, getNewToken, getCurrentUser, logout, getOngoing, increment, setFinalScore, setEpScores, parseShikiRating }
}

const api = ShikiApi({
  baseUrl: BASE_URL,
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  redirect_uri: REDIRECT_URI,
  response_type: RESPONSE_TYPE,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': USER_AGENT,
  },
});

export default api;

//http://localhost:3000/redirect                http%3A%2F%2Flocalhost%3A3000%2Fredirect   