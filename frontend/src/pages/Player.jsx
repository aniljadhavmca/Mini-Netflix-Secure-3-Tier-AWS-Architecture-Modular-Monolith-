import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
export default function Player(){
  const{id}=useParams();
  const[url,setUrl]=useState("");
  useEffect(()=>{api.get(`/movies/stream/${id}`).then(res=>setUrl(res.data.url));},[id]);
  return(
    <>
      <Navbar/>
      <div style={{textAlign:"center",paddingTop:"50px"}}>
        <video width="900" controls>
          <source src={url} type="video/mp4"/>
        </video>
      </div>
    </>
  );
}