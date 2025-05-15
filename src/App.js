import React , {useState, useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./landing";
import Patient_Landing from "./patient_dashboard/patient_landing";
import Patientsignup from './patient_signup/patientsignup';
import Doctorsignup from './doctor_signup/doctorsignup';
import Pharmacysignup from './pharmacy_signup/pharmacysignup';
import Patient_Doctorlist from './patient_dashboard/patient_doctorlist';
import Patient_Billing from './patient_dashboard/patient_billing';
import Patient_Mealplan from './patient_dashboard/patient_mealplan';
import Pharmacy_Stock from './pharmacy/pharmacy_stock'
import Pharmacy_Landing from './pharmacy/pharmacy_landing'
import Pharmacy_PickUp from './pharmacy/pharmacy_pickup'
import Patient_Chart from './patient_medicalchart/patient_medicalchart/patient_medicalchart';
import MealPlanCard from './patient_dashboard/MealPlanCard';
import Profile from './patient_dashboard/profile';
import Patient_Appointment from './patient_dashboard/patient_appointment';
import Community_Homepage from './community_homepage';
import Doctor_Landing from "./doctor_dashboard/doctor_landing";
import Doctor_Patientlist from './doctor_dashboard/doctor_patientlist';
import Doctor_Appointment from './doctor_dashboard/doctor_appointment';
import Doctor_Mealplan from './doctor_dashboard/doctor_mealplan';
import Doctor_Info from './doctor_dashboard/doctor_info';
import Doctor_Profile from './doctor_dashboard/profile';
import DoctorPatientInfo from './doctor_dashboard/doctor_patientinfo';
import { SurveyProvider } from './patient_medicalchart/patient_medicalchart/Survey_context';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


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
    <SurveyProvider>
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
          <Route index element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/patient_dashboard/patient_landing" element={<Patient_Landing />} />
          <Route path="/patient_dashboard/patient_doctorlist" element={<Patient_Doctorlist />} />
          <Route path="/patient_dashboard/patient_billing" element={<Patient_Billing />} />
          <Route path="/pharmacy/pharmacy_stock" element={<Pharmacy_Stock />} />
          <Route path="/pharmacy/pharmacy_landing" element={<Pharmacy_Landing />} />
          <Route path="/pharmacy/pharmacy_pickup" element={<Pharmacy_PickUp />} />
          <Route path="/patientsignup" element={<Patientsignup />} />
          <Route path="/doctorsignup" element={<Doctorsignup/>} />
          <Route path="/pharmacysignup" element={<Pharmacysignup/>} />
          <Route path="/patient_medicalchart/patient_medicalchart" element={<Patient_Chart/>} />
          <Route path="/patient_dashboard/patient_mealplan" element={<Patient_Mealplan/>} />
          <Route path="/MealPlanCard" element={<MealPlanCard/>} />
          <Route path="/patient_dashboard/profile" element={<Profile/>} />
          <Route path="/patient_dashboard/patient_appointment" element={<Patient_Appointment/>} />
          <Route path="/community_homepage" element={<Community_Homepage/>} />
          <Route path="/doctor_dashboard/doctor_landing" element={<Doctor_Landing />} />
          <Route path="/doctor_dashboard/doctor_patientlist" element={<Doctor_Patientlist />} />
          <Route path="/doctor_dashboard/doctor_appointment" element={<Doctor_Appointment/>} />
          <Route path="/doctor_dashboard/doctor_info" element={<Doctor_Info/>}/>
          <Route path="/doctor_dashboard/doctor_mealplan" element={<Doctor_Mealplan/>}/>
          <Route path="/doctor_dashboard/profile" element={<Doctor_Profile/>}/>
          <Route path="/doctor_dashboard/doctor_patientinfo" element={<DoctorPatientInfo/> }/>
          
        </Routes>
      </div>
      </Router>
    </div>
    </SurveyProvider>
  )
}

export default App

