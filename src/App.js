import React , {useState, useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./landing";
import Patientsignup from './pages/patientsignup';
import Doctorsignup from './pages/doctorsignup';


function App() {
  const[data, setData] = useState([{}])

  useEffect(()=>{
    fetch("/members").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])
  return (
    <div>
      <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={(typeof data.members === 'undefined')?(
        <p>Loading...</p>
      ): (
        data.members.map((member, i) =>(
          <p key={i}>{member}</p>
        ))
      )} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/patientsignup" element={<Patientsignup />} />
          <Route path="/doctorsignup" element={<Doctorsignup/>} />
        </Routes>
      </div>
      </Router>
    </div>
  )
}

export default App

