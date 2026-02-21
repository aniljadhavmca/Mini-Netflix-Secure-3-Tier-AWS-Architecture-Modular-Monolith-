export default function Navbar(){
  const logout=()=>{localStorage.removeItem("token");window.location.href="/";};
  return(
    <div className="navbar">
      <div className="logo">MiniFlix</div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}