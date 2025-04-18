import React, { lazy, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./patientsignup.css";
import Checkbox from '@mui/material/Checkbox';
import { Table, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Modal from '@mui/material';



/*
Add profile Photo option
Ask to include Gender, DOB, Address, Phone Number
Zipcode, City, State, Weight Height, Fitness level
Health Goals, Blood type,
Dietary Restrictions and Medical Conditions




*/

function Patientsignup() {
  const [values, setValues] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    gender: '',
    phone: '',
    address: '',
    zip: '',
    city: '',
    state: '',
    pharmacy_name: '',
    pharmacy_address: '',
    pharm_zip: '',
    pharm_city: '',
    weight: '',
    height: '',
    fitness: '',
    goal: '',
    blood: '',
    medical_conditions: '',
    dietary_restrictions: '',
    insur_name: '',
    policy: '',
    exp: '',
    email: '',
    password: ''
  })

  const navigate = useNavigate()
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [blood, setBlood] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);


  const [loading, setLoading] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setGender(event.target.value);
    setValues({...values, gender: event.target.value});
  };

  const handleChange2 = (event: SelectChangeEvent) => {
    setBlood(event.target.value);
    setValues({...values, blood: event.target.value});
  };

  const handleInput = (e) => {
    e.persist();
    setValues({...values, [e.target.name]: e.target.value});
  }

  const handleCheckboxChange = (event, type) => {
    const value = event.target.name;
  
    if (type === "medical") {
      setMedicalConditions(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    } else if (type === "diet") {
      setDietaryRestrictions(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    }
  };
  

  const savePatient = (e) => {
    e.preventDefault();
  
    if (!termsAccepted) {
      alert("Please accept the terms and conditions");
      return;
    }
  
    setLoading(true);
  
    // Register the patient
    const registerData = {
      first_name: values.first_name,
      last_name: values.last_name,
      pharmacy_name: values.pharmacy_name,
      pharmacy_address: values.pharmacy_address,
      pharmacy_zipcode: values.pharm_zip,
      insurance_provider: values.insur_name,
      insurance_policy_number: values.policy,
      insurance_expiration_date: values.exp,
      patient_email: values.email,
      patient_password: values.password
    };
  
    fetch("http://127.0.0.1:5000/register-patient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(registerData)
    })
      .then(res => res.json())
      .then(response => {
        if (response.message) {
          return fetch(`http://127.0.0.1:5000/login-patient`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password
            })
          });
        } else {
          throw new Error(response.error || "Registration failed");
        }
      })
      .then(res => res.json())
      .then(loginResponse => {
        if (!loginResponse.patient_id) {
          throw new Error("Unable to retrieve patient ID");
        }
  
        const patient_id = loginResponse.patient_id;
  
        // Submit the initial survey with updated fields
        const surveyData = {
          patient_id,
          mobile_number: values.phone,
          dob: values.dob,
          gender: values.gender,
          height: values.height,
          weight: values.weight,
          activity: values.fitness,  // Changed from fitness to activity
          health_goals: values.goal,  // Changed from goal to health_goals
          dietary_restrictions: dietaryRestrictions.join(', ') || "None",  // Changed from allergies
          blood_type: values.blood,
          patient_address: values.address,
          patient_zipcode: values.zip,
          patient_city: values.city,
          patient_state: values.state,
          medical_conditions: medicalConditions.join(', ') || "None",
          family_history: "None",
          past_procedures: "None",
          favorite_meal: "None"  // New field
        };
  
        return fetch("http://127.0.0.1:5000/init-patient-survey", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(surveyData)
        });
      })
      .then(res => res.json())
      .then(surveyResponse => {
        if (surveyResponse.message) {
          alert("Account created and survey submitted!");
          navigate('/landing');
        } else {
          throw new Error(surveyResponse.error || "Survey failed");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert(error.message);
      })
      .finally(() => setLoading(false));
  };


  return (
    <>
      <div className="SignUp">
        <div className="signupnav">
          <h2>DPP</h2>
          <h2 className="title">Patient Signup</h2>
        </div>

        <form className="form-container" onSubmit={savePatient}>
          <div className="signuptop">
            <div className="info-container">
              {/* Left Section: Basic Info */}
              <div className="basic-info">
                <h1>Basic Information</h1>
                <div className='labels'>
                  <label className='def-label' htmlFor="first_name">First Name: </label>
                  <input type='text'
                    name='first_name'
                    className="form-control" 
                    placeholder='Enter First Name'
                    value={values.first_name}
                    onChange={e => setValues({...values, first_name: e.target.value})}/>
                </div>
                <div className='labels'>
                  <label className='def-label' htmlFor="last_name">Last Name: </label>
                  <input type='text'
                    name='last_name'
                    className="form-control" 
                    placeholder='Enter last Name'
                    value={values.last_name}
                    onChange={e => setValues({...values, last_name: e.target.value})}/>
                </div>

                {/*Make the fields horizontal */}
                <div className='horizontal-bar'>
                  <div className='labels'>
                    <label htmlFor="dob" className='short-label'>DOB: </label>
                    <input type='date'
                      name='dob'
                      className="form-control-dob" 
                      placeholder='Enter DOB'
                      value={values.dob}
                      onChange={e => setValues({...values, dob: e.target.value})}/>
                  </div>
                  <div className='labels'>
                    <label htmlFor="gender" className='gender-label'>Gender: </label>
                    <Select
                      className="form-control-select"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={gender}
                      onChange={handleChange}
                      displayEmpty
                      renderValue={(selected) => selected ? selected : "Select Gender"}
                    >
                      <MenuItem value='Male'>Male</MenuItem>
                      <MenuItem value='Female'>Female</MenuItem>
                      <MenuItem value='Other'>Other</MenuItem>
                    </Select>
                  </div>
                </div>

                {/*Normal Now */}
                <div className='labels'>
                  <label className='def-label' htmlFor="phone">Phone: </label>
                  <input type='text'
                    name='phone'
                    className="form-control" 
                    placeholder='Enter your phone number'
                    value={values.phone}
                    onChange={e => setValues({...values, phone: e.target.value})}/>
                </div>
                <div className='labels'>
                  <label className='def-label' htmlFor="address">Address: </label>
                  <input type='text'
                    name='address'
                    className="form-control" 
                    placeholder='Enter your address'
                    value={values.address}
                    onChange={e => setValues({...values, address: e.target.value})}/>
                </div>

                {/*Make fields horizontal again */}              
                <div className='horizontal-bar'>
                  <div className='labels'>
                    <label htmlFor="zip" className='def-label'>Zip code: </label>
                    <input type='text'
                      name='zip'
                      className="form-control-dob" 
                      placeholder='Enter ZIP'
                      value={values.zip}
                      onChange={e => setValues({...values, zip: e.target.value})}/>
                  </div>
                  <div className='labels'>
                    <label htmlFor="city" className='short-label'>City: </label>
                    <input type='text'
                      name='city'
                      className="form-control-gender" 
                      placeholder='Enter City'
                      value={values.city}
                      onChange={e => setValues({...values, city: e.target.value})}/>
                  </div>
                  <div className='labels'>
                    <label htmlFor="state" className='gender-label'>State: </label>
                    <input type='text'
                      name='state'
                      className="form-control-gender" 
                      placeholder='Enter state'
                      value={values.state}
                      onChange={e => setValues({...values, state: e.target.value})}/>
                  </div>
                </div>
              </div>

              {/*Pharmacy side */}
              <div className="pharmacy-info">
                <h1>Pharmacy Information</h1>
                <div className='labels'>
                  <label htmlFor="pharmacy_name" className='long-label'>Pharmacy Name: </label>
                  <input type='text'
                    name='pharmacy_name'
                    className="form-control" 
                    placeholder='Enter Pharmacy Name'
                    value={values.pharmacy_name}
                    onChange={e => setValues({...values, pharmacy_name: e.target.value})}/>
                </div>
                <div className='labels'>
                  <label htmlFor="pharmacy_address" className='long-label'>Pharmacy Address: </label>
                  <input type='text'
                    name='pharmacy_address'
                    className="form-control-add" 
                    placeholder='Enter your pharmacy address'
                    value={values.pharmacy_address}
                    onChange={e => setValues({...values, pharmacy_address: e.target.value})}/>
                </div>

                <div className='horizontal-bar'>
                  <div className='labels'>
                    <label htmlFor="pharm_zip" className='def-label'>Zip code: </label>
                    <input type='text'
                      name='pharm_zip'
                      className="form-control-dob" 
                      placeholder='Enter ZIP'
                      value={values.pharm_zip}
                      onChange={e => setValues({...values, pharm_zip: e.target.value})}/>
                  </div>
                  <div className='labels'>
                    <label htmlFor="pharm_city" className='short-label'>City: </label>
                    <input type='text'
                      name='pharm_city'
                      className="form-control-gender" 
                      placeholder='Enter City'
                      value={values.pharm_city}
                      onChange={e => setValues({...values, pharm_city: e.target.value})}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
      
          <div className="healthdiv">
            <div className="health-container">
              <div className="health-info">
                <h1 className="medical-header">
                  Health and Medical Background
                </h1>

                <div className='horizontal-bar2'>
                  <div className='labels2'>
                    <label className='def-label'htmlFor="weight">Weight: </label>
                    <input type='text'
                      name='weight'
                      className="form-control-dob" 
                      placeholder='Enter Weight'
                      value={values.weight}
                      onChange={e => setValues({...values, weight: e.target.value})}/>
                  </div>
                  <div className='labels2'>
                    <label className='def-label' htmlFor="height">Height: </label>
                    <input type='text'
                      name='height'
                      className="form-control-gender" 
                      placeholder='Enter height'
                      value={values.height}
                      onChange={e => setValues({...values, height: e.target.value})}/>
                  </div>
                  <div className='labels2'>
                    <label htmlFor="fitness" className='active-label'>Hours of Fitness?: </label>
                    <input type='text'
                      name='fitness'
                      className="form-control-active" 
                      placeholder='Enter active level'
                      value={values.fitness}
                      onChange={e => setValues({...values, fitness: e.target.value})}/>
                  </div>
                  <div className='labels2'>
                    <label htmlFor="goal" className='goal-label'>Health Goals: </label>
                    <input type='text'
                      name='goal'
                      className="form-control-active" 
                      placeholder='Enter goal'
                      value={values.goal}
                      onChange={e => setValues({...values, goal: e.target.value})}/>
                  </div>
                </div>
                
                <div className="table-container">
                  <div className='medic-info'>
                    <Table>
                      <thead>
                        <TableRow>
                          <th colSpan={2}>Please Check Off All Medical Conditions</th>
                        </TableRow>
                      </thead>
                      <tbody>
                        <TableRow>
                          <td>
                            Cancer 
                            <Checkbox name="Cancer" checked={medicalConditions.includes("Cancer")} onChange={(e) => handleCheckboxChange(e, "medical")}/>
                          </td>
                          <td>
                            Diabetes 
                            <Checkbox name="Diabetes" checked={medicalConditions.includes("Diabetes")} onChange={(e) => handleCheckboxChange(e, "medical")}  />
                          </td>
                        </TableRow>
                        <TableRow>
                          <td>
                            Pregnant 
                            <Checkbox name="Pregnant" checked={medicalConditions.includes("Pregnant")} onChange={(e) => handleCheckboxChange(e, "medical")}  />
                          </td>
                          <td>
                            Bipolar 
                            <Checkbox name="Bipolar" checked={medicalConditions.includes("Bipolar")} onChange={(e) => handleCheckboxChange(e, "medical")} />
                          </td>
                        </TableRow>
                        <TableRow>
                          <td>
                            Asthma 
                            <Checkbox name="Asthma" checked={medicalConditions.includes("Asthma")} onChange={(e) => handleCheckboxChange(e, "medical")}  />
                          </td>
                          <td>
                            Anxiety 
                            <Checkbox name="Anxiety" checked={medicalConditions.includes("Anxiety")} onChange={(e) => handleCheckboxChange(e, "medical")}  />
                          </td>
                        </TableRow>
                        <TableRow>
                          <td>
                            Epilepsy 
                            <Checkbox name="Epilepsy" checked={medicalConditions.includes("Epilepsy")} onChange={(e) => handleCheckboxChange(e, "medical")}  />
                          </td>
                          <td>
                            Other 
                            <Checkbox name="Other" checked={medicalConditions.includes("Other")} onChange={(e) => handleCheckboxChange(e, "medical")}  />
                          </td>
                        </TableRow>
                      </tbody>
                    </Table>
                  </div>

                  <div className='diet-info'>
                    <Table>
                      <thead>
                        <TableRow>
                          <th colSpan={2}>Please Check Off All Dietary Restrictions</th>
                        </TableRow>
                      </thead>
                      <tbody>
                        <TableRow>
                          <td>
                            Nuts 
                            <Checkbox name="Nuts" checked={dietaryRestrictions.includes("Nuts")} onChange={(e) => handleCheckboxChange(e, "diet")} />
                            </td>
                          <td>
                            Eggs 
                            <Checkbox name="Eggs" checked={dietaryRestrictions.includes("Eggs")} onChange={(e) => handleCheckboxChange(e, "diet")}  />
                          </td>
                        </TableRow>
                        <TableRow>
                          <td>
                            Gluten 
                            <Checkbox name="Gluten" checked={dietaryRestrictions.includes("Gluten")} onChange={(e) => handleCheckboxChange(e, "diet")} />
                          </td>
                          <td>
                            Vegan 
                            <Checkbox name="Vegan" checked={dietaryRestrictions.includes("Vegan")} onChange={(e) => handleCheckboxChange(e, "diet")}  />
                          </td>
                        </TableRow>
                        <TableRow>
                          <td>
                            Fish 
                            <Checkbox name="Fish" checked={dietaryRestrictions.includes("Fish")} onChange={(e) => handleCheckboxChange(e, "diet")}  />
                          </td>
                          <td>
                            Vegetarian 
                            <Checkbox name="Vegetarian" checked={dietaryRestrictions.includes("Vegetarian")} onChange={(e) => handleCheckboxChange(e, "diet")}  />
                          </td>
                        </TableRow>
                        <TableRow>
                          <td>
                            Dairy 
                            <Checkbox name="Dairy" checked={dietaryRestrictions.includes("Dairy")} onChange={(e) => handleCheckboxChange(e, "diet")}  />
                          </td>
                          <td>
                            Other 
                            <Checkbox name="Other" checked={dietaryRestrictions.includes("Other")} onChange={(e) => handleCheckboxChange(e, "diet")}  />
                          </td>
                        </TableRow>
                      </tbody>
                    </Table>
                  </div>
                  <div className='labels2'>
                    <label className='def-label' htmlFor="blood">Blood Type: </label>
                    <Select
                      className="form-control-select"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={blood}
                      onChange={handleChange2}
                      displayEmpty
                      renderValue={(selected) => selected ? selected : "Select Blood Type"}
                    >
                      <MenuItem value='A+'>A+</MenuItem>
                      <MenuItem value='A-'>A-</MenuItem>
                      <MenuItem value='AB+'>AB+</MenuItem>
                      <MenuItem value='AB-'>AB-</MenuItem>
                      <MenuItem value='B+'>B+</MenuItem>
                      <MenuItem value='B-'>B-</MenuItem>
                      <MenuItem value='O+'>O+</MenuItem>
                      <MenuItem value='O-'>O-</MenuItem>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="patienttest">
            <div className="info-container">
              <div className="basic-info">
                <h1>Other Information</h1>
                <div className='labels'>
                  <label htmlFor="insur_name" className='long-label'>Insurance Name: </label>
                  <input type='text'
                    name='insur_name'
                    className="form-control" 
                    placeholder='Enter insurance name'
                    value={values.insur_name}
                    onChange={e => setValues({...values, insur_name: e.target.value})}/>
                </div>
                <div className='labels'>
                  <label htmlFor="policy" className='long-label'>Policy Number: </label>
                  <input type='text'
                    name='policy'
                    className="form-control" 
                    placeholder='Enter policy number'
                    value={values.policy}
                    onChange={e => setValues({...values, policy: e.target.value})}/>
                </div>
                {/*Normal Now */}
                <div className='labels'>
                  <label className='def-label' htmlFor="exp">Exp. Date: </label>
                  <input type='date'
                    name='exp'
                    className="form-control" 
                    placeholder='Enter your exp date'
                    value={values.exp}
                    onChange={e => setValues({...values, exp: e.target.value})}/>
                </div>
                <div className='labels'>
                  <label className='def-label' htmlFor="email">Email: </label>
                  <input type='text'
                    name='email'
                    className="form-control" 
                    placeholder='Enter your email'
                    value={values.email}
                    onChange={e => setValues({...values, email: e.target.value})}/>
                </div>
                <div className='labels'>
                  <label className='def-label'htmlFor="password">Password: </label>
                  <input type='password'
                    name='password'
                    className="form-control" 
                    placeholder='Enter your password'
                    value={values.password}
                    onChange={e => setValues({...values, password: e.target.value})}/>
                </div>      
                <div className='labels'> 
                  <label className='terms'>Do you Accept the terms and conditions? 
                    <Checkbox checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)}  />
                  </label>

                </div>            
              </div>
            </div>

            <div className="signuptext">
              <div className="signupbuttons">
                <Button type='submit' className="herobutton">Sign Up</Button>
                <Button className="herobutton" onClick={() => navigate('/landing')}> Back </Button>

              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Patientsignup;