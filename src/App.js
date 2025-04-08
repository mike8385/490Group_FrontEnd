import React , {useState, useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./landing";
import Patient_Landing from "./patient_dashboard/patient_landing";
import Patientsignup from './patient_signup/patientsignup';
import Doctorsignup from './doctor_signup/doctorsignup';
import Patient_Doctorlist from './patient_dashboard/patient_doctorlist';

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
          <Route path="/patient_dashboard/patient_landing" element={<Patient_Landing />} />
          <Route path="/patient_dashboard/patient_doctorlist" element={<Patient_Doctorlist />} />
          <Route path="/patientsignup" element={<Patientsignup />} />
          <Route path="/doctorsignup" element={<Doctorsignup/>} />
        </Routes>
      </div>
      </Router>
    </div>
  )
}

export default App

