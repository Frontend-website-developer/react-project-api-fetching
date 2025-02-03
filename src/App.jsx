import { useEffect, useState } from "react"
import Search from "./components/Search"
import MovieCard from "./components/MovieCard";

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
  const [isloading, setisloading] = useState(false);

  const fetchMovies = async () => {
    setisloading(true);
    seterrorMessage('');
    try{
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

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

    }
    catch(error){
      console.error(`Error fetching movies ${error}`);
      seterrorMessage ('Error fetching movies, Please try again later')
    }
    finally{
      setisloading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);
  
  return(
    <main>
      <div className="pattern" />
      <div className="wrapper">
          <header>
              <img src="./hero.png" alt="Hero Banner" />
              <h1>Find <span className="text-gradient">Movies</span> You`ll Enjoy Without the Hassle</h1>
              <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
          </header>
          
          <section className="all-movies">
              <h2 className="mt-[20px]">All Movies</h2>

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
