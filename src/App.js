 
import React,{ useEffect, useState } from 'react';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow'
import FeaturedMovie from './components/FeaturedMovie'
import Header from './components/Header';
import './App.css'

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featureData, setfeatureData] = useState(null);
  const [blackHeader,setblackHeader] = useState(false)

  useEffect(() => {
    const loadAll = async () => {
      //trazer a lista total
      let list = await Tmdb.getHomeList();
      setMovieList(list)

      //pegar o filme em destaque
      let originals = list.filter(i => i.slug === 'originals')
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length) - 1)
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      console.log(chosenInfo)
      setfeatureData(chosenInfo);
    }
    loadAll();
  },[]);
  
  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setblackHeader(true)
      } else {
        setblackHeader(false)
      }
    }
    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  })

  return (
    <div className="page">
      <Header black={blackHeader}/>
      {featureData &&
        <FeaturedMovie item={featureData}/>
      }
      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items}/>
        ))}
      </section>
      {movieList.length <= 0 &&
      <div className="loading">
        <img src="http://cdn.lowgif.com/full/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" alt="Carregando"/>
      </div>
      }
    </div>
  );
}