import React, { lazy, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./doctorsignup.css";
import Checkbox from '@mui/material/Checkbox';
import { Table, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


function Doctorsignup(){

  const [values, setValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    district: '',
    city: '',
    country: '',
    phone: '',
    dob: '',
    gender: '',
    zip: '',
    medical_number: '',
    exp: '',
    school: '',
    years: '',
    pay: '',
    specialty: ''

})

  const navigate = useNavigate()
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
   
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };
      


  return (
    <>
    <div className="SignUp">
        <div className="signupnav">
            <h2>DPP</h2>
            <h2 className="title">Doctor Signup</h2>
        </div>

        <div className="patienthero">

        <form className="form-container">
          <div className="info-container">
          {/* Left Section: Basic Info */}
            <div className="basic-info">
                  <h1>Basic Information</h1>
                    <div className='labels'>
                        <label htmlFor="first_name">First Name: </label>
                        <input type='text'
                        name='first_name'
                        className="form-control" 
                        placeholder='Enter First Name'
                        value={values.first_name}
                        onChange={e => setValues({...values, first_name: e.target.value})}/>
                    </div>
                    <div className='labels'>
                        <label htmlFor="last_name">Last Name: </label>
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
                          <label htmlFor="dob" className='dob-label'>DOB: </label>
                          <input type='text'
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
                              value={age}
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
                        <label htmlFor="phone">Phone: </label>
                        <input type='text'
                        name='phone'
                        className="form-control" 
                        placeholder='Enter your phone number'
                        value={values.phone}
                        onChange={e => setValues({...values, phone: e.target.value})}/>
                    </div>
                    <div className='labels'>
                        <label htmlFor="address">Address: </label>
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
                          <label htmlFor="zip" className='zip-label'>Zip code: </label>
                          <input type='text'
                          name='zip'
                          className="form-control-dob" 
                          placeholder='Enter ZIP'
                          value={values.zip}
                          onChange={e => setValues({...values, zip: e.target.value})}/>
                      </div>
                      <div className='labels'>
                          <label htmlFor="city" className='dob-label'>City: </label>
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

                    {/*Doctor side */}

            <div className="doctor-info">
                  <h1>Doctor Information</h1>
                    <div className='labels'>
                        <label htmlFor="medical_number" className='medical-num'>Medical License Number: </label>
                        <input type='text'
                        name='medical_number'
                        className="form-control" 
                        placeholder='Enter medical num'
                        value={values.medical_number}
                        onChange={e => setValues({...values, medical_number: e.target.value})}/>
                    </div>
                    <div className='labels'>
                        <label htmlFor="exp" className='exp'>Medical License Exp: </label>
                        <input type='text'
                        name='exp'
                        className="form-control-exp" 
                        placeholder='Enter exp'
                        value={values.exp}
                        onChange={e => setValues({...values, exp: e.target.value})}/>
                    </div>
                    <div className='labels'>
                        <label htmlFor="school" className='school'>Medical School: </label>
                        <input type='text'
                        name='school'
                        className="form-control" 
                        placeholder='Enter Medical School'
                        value={values.school}
                        onChange={e => setValues({...values, school: e.target.value})}/>
                    </div>
                    <div className='labels'>
                        <label htmlFor="years" className='years'>Years in Practice: </label>
                        <input type='text'
                        name='years'
                        className="form-control" 
                        placeholder='Enter num of years'
                        value={values.years}
                        onChange={e => setValues({...values, years: e.target.value})}/>
                    </div>
                    <div className='labels'>
                        <label htmlFor="pay" className='pay'>Payment Fee: </label>
                        <input type='text'
                        name='pay'
                        className="form-control" 
                        placeholder='Enter payment fee'
                        value={values.pay}
                        onChange={e => setValues({...values, pay: e.target.value})}/>
                    </div>
                    <div className='labels'>
                        <label htmlFor="specialty" className='pay'>Specialty: </label>
                        <input type='text'
                        name='specialty'
                        className="form-control" 
                        placeholder='Enter specialty'
                        value={values.specialty}
                        onChange={e => setValues({...values, specialty: e.target.value})}/>
                    </div>
                    

                    {/*Normal Now */}
                   
                  </div>
            </div>

        </form>
        {/* <div>
              <label htmlFor="phone">Phone:</label>
              <input type='text' name='phone' className="form-control" placeholder='Enter Phone'
              value={values.phone} onChange={e => setValues({...values, phone: e.target.value})}/>
        </div> */}

      </div>
      
       

        <div className="doctortest">

        <form className="form-container">
          <div className="info-container">
          {/* Left Section: Basic Info */}
            <div className="basic-info">
                  <h1>Other Information</h1>
                    <div className='labels2'>
                        <label htmlFor="email">Email: </label>
                        <input type='text'
                        name='email'
                        className="form-control" 
                        placeholder='Enter your email'
                        value={values.email}
                        onChange={e => setValues({...values, email: e.target.value})}/>
                    </div>
                    <div className='labels2'>
                        <label htmlFor="password">Password: </label>
                        <input type='text'
                        name='password'
                        className="form-control" 
                        placeholder='Enter your password'
                        value={values.password}
                        onChange={e => setValues({...values, password: e.target.value})}/>
                    </div>      
                    <div className='labels'> 
                      <label className='terms'>Do you Accept the terms and conditions? 
                              <Checkbox {...label}  />
                      </label>
                    </div>            
            </div>

          </div>
          
        </form>
            <div className="herotext">
            <div className="herobuttons">
            <Button className="herobutton" onClick={() => navigate('/landing')}>Sign Up </Button>
            </div>
            </div>
      </div>
        

        <div className="doctortest">

          
        </div>
            
    </div>
    </>
  );
}

export default Doctorsignup;