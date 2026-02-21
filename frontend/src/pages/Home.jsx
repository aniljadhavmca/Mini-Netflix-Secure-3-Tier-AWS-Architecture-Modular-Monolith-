import {useEffect,useState} from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
export default function Home(){
  const[movies,setMovies]=useState([]);
  useEffect(()=>{api.get("/movies").then(res=>setMovies(res.data));},[]);
  return(
    <>
      <Navbar/>
      <div className="movie-grid">
        {movies.map(movie=>(<MovieCard key={movie.id} movie={movie}/>))}
      </div>
    </>
  );
}