import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <img src={`https://via.placeholder.com/300x450?text=${movie.title}`} alt={movie.title} />
      <div style={{padding:"10px"}}>
        <Link to={`/player/${movie.id}`} style={{color:"white",textDecoration:"none"}}>
          {movie.title}
        </Link>
      </div>
    </div>
  );
}