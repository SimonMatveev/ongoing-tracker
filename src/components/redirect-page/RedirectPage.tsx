import { FC, useEffect } from "react";
import api from "../../utils/shikiApi";
import './redirect-page.css';
import { useNavigate } from "react-router-dom";


const RedirectPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = window.location.href;
    const code = /code=(.+)$/.exec(url);
    const error = /error=(.+)$/.exec(url);
    if (code) {
      api.getFirstToken(code[1])
        .then(res => {
          console.log(res)
          localStorage.setItem('ShikiTokenObj', JSON.stringify(res));
          window.close();
        })
        .catch(err => console.log(err));
    } else if (error) {
      console.log(error);
    } else navigate('/', { replace: true });

  }, [navigate])

  return (
    <div className="redirect">
      <div className="redirect__container">
        <h1 className="redirect__title">Авторизируем...</h1>
      </div>
    </div>
  )
}

export default RedirectPage;