import { useEffect, useState } from "react"
import Search from "./components/Search"
import MovieCard from "./components/MovieCard";

import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
  Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxY2E2MjhjZWMyZTk5MGY1ZjZiZjQ2OTlhMzBjYmYxZiIsIm5iZiI6MTczODUwNDQ2Ni4zMTIsInN1YiI6IjY3OWY3OTEyZTk5ZGYyM2E5ZjI2NGYxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X-mQBrAqcPAcDUmrC5z4fg3BaSOdPWYQQcv2cDwaYzY`
  } 
}

const App = () => {

  const [searchTerm, setsearchTerm] = useState();
  const [errorMessage, seterrorMessage] = useState();
  const [movie, setmovie] =useState([]);
  const [trendingMovies, settrendingMovies] =useState([]);
  const [isloading, setisloading] = useState(false);
  const [debouncedsearchTerm, setdebouncedsearchTerm] = useState();

  useDebounce(() => setdebouncedsearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '') => {
    setisloading(true);
    seterrorMessage('');
    try{
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS );

      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if(data.respose === 'false'){
        seterrorMessage(data.error || 'Failed to fetch movies');
        setmovie([]);
        return;
      }

      setmovie(data.results || []);

      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }

    }
    catch(error){
      console.error(`Error fetching movies ${error}`);
      seterrorMessage ('Error fetching movies, Please try again later')
    }
    finally{
      setisloading(false);
    }
  }

  const loadTrendingMovies = async() => {
    try{
      const movies = await getTrendingMovies();

      settrendingMovies(movies);

    }
    catch(error){
      console.error(`Error fetching trending movies ${error}`);

    }
  }

  useEffect(() => {
    fetchMovies(debouncedsearchTerm);
  }, [debouncedsearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []

  );
  
  return(
    <main>
      <div className="pattern" />
      <div className="wrapper">
          <header>
              <img src="./hero.png" alt="Hero Banner" />
              <h1>Find <span className="text-gradient">Movies</span> You`ll Enjoy Without the Hassle</h1>
              <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
          </header>
          
          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>

              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies">
              <h2>All Movies</h2>

              {isloading ? (
                <p className="text-white">Loading...</p>
              ) : errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
              ) : 
              
              <ul>
                {movie.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />                  
                ))}
              </ul>

              }
          </section>
      </div>
    </main>
  )
}


export default App
