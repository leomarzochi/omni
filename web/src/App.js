import React, { useState, useEffect } from 'react';
import api from './services/api';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

function App() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [github_username, setGithubUsername] = useState('');
  const [techs, setTechs] = useState('');

  const [devs, setDevs] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        setLatitude(latitude);
        setLongitude(longitude);
      },
      err => {
        console.error(err);
      },
      {
        timeout: 20000,
      }
    );
  }, []);

  useEffect(() => {
    async function loadDevs() {
      const res = await api.get('/devs');
      setDevs(res.data);
    }
    loadDevs();
  }, []);

  async function handleAddDev(e) {
    e.preventDefault();

    const res = await api.post('/devs', {
      github_username,
      techs,
      latitude,
      longitude,
    });

    setTechs('');
    setGithubUsername('');

    setDevs([...devs, res.data]);
  }

  let devsList = null;

  devsList = devs.map(dev => (
    <li className='dev-item' key={dev._id}>
      <header>
        <img src={dev.avatar_url} alt={`avatar_${github_username}`} />
        <div className='user-info'>
          <strong>{dev.github_username}</strong>
          <span>{dev.techs.join(',')}</span>
        </div>
      </header>
      <p>{dev.bio}</p>
      <a
        href={`http://github.com/${dev.github_username}`}
        target='_blank'
        rel='noopener noreferrer'
      >
        Ver no github
      </a>
    </li>
  ));

  return (
    <div id='app'>
      <aside>
        <strong>Cadastrar</strong>
        <form onSubmit={handleAddDev}>
          <div className='input-block'>
            <label htmlFor='github_username'>Usuário Github</label>
            <input
              value={github_username}
              name='github_username'
              id='github_username'
              required
              onChange={e => setGithubUsername(e.target.value)}
            ></input>
          </div>
          <div className='input-block'>
            <label htmlFor='techs'>Tecnologias</label>
            <input
              value={techs}
              name='techs'
              id='techs'
              required
              onChange={e => setTechs(e.target.value)}
            ></input>
          </div>
          <div className='input-group'>
            <div className='input-block'>
              <label htmlFor='latitude'>Latitude</label>
              <input
                onChange={e => setLatitude(e.target.value)}
                type='number'
                name='latitude'
                id='latitude'
                required
                value={latitude}
              ></input>
            </div>
            <div className='input-block'>
              <label htmlFor='Longitude'>Longitude</label>
              <input
                onChange={e => setLongitude(e.target.value)}
                type='number'
                name='Longitude'
                id='Longitude'
                required
                value={longitude}
              ></input>
            </div>
          </div>

          <button type='submit'>Salvar</button>
        </form>
      </aside>
      <main>
        <ul>{devsList}</ul>
      </main>
    </div>
  );
}

export default App;
