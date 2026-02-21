import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function Player(){
  const {id}=useParams();
  const [url,setUrl]=useState("");

  useEffect(()=>{
    api.get(`/movies/stream/${id}`).then(res=>setUrl(res.data.url));
  },[id]);

  return (
    <div style={{textAlign:"center",marginTop:"20px"}}>
      <video width="800" controls>
        <source src={url} type="video/mp4"/>
      </video>
    </div>
  );
}