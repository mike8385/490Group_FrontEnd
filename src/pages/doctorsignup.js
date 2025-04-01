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
    pharmacy_address: '',
    pharm_zip: '',
    pharm_city: '',
    pharmacy_name: ''
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

                    {/*Pharmacy side */}

            <div className="pharmacy-info">
                  <h1>Pharmacy Information</h1>
                    <div className='labels'>
                        <label htmlFor="pharmacy_name" className='pharm-name'>Pharmacy Name: </label>
                        <input type='text'
                        name='pharmacy_name'
                        className="form-control" 
                        placeholder='Enter Pharmacy Name'
                        value={values.pharmacy_name}
                        onChange={e => setValues({...values, pharmacy_name: e.target.value})}/>
                    </div>
                    <div className='labels'>
                        <label htmlFor="pharmacy_address" className='pharm-address'>Pharmacy Address: </label>
                        <input type='text'
                        name='pharmacy_address'
                        className="form-control-add" 
                        placeholder='Enter your pharmacy address'
                        value={values.pharmacy_address}
                        onChange={e => setValues({...values, pharmacy_address: e.target.value})}/>
                    </div>

                    <div className='horizontal-bar'>
                      <div className='labels'>
                          <label htmlFor="pharm_zip" className='pharm_zip-label'>Zip code: </label>
                          <input type='text'
                          name='pharm_zip'
                          className="form-control-dob" 
                          placeholder='Enter ZIP'
                          value={values.pharm_zip}
                          onChange={e => setValues({...values, pharm_zip: e.target.value})}/>
                      </div>
                      <div className='labels'>
                          <label htmlFor="pharm_city" className='dob-label'>City: </label>
                          <input type='text'
                          name='pharm_city'
                          className="form-control-gender" 
                          placeholder='Enter City'
                          value={values.pharm_city}
                          onChange={e => setValues({...values, pharm_city: e.target.value})}/>
                      </div>
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
      
        <div className="healthdiv">


        <form className="form-container">
          <div className="health-container">
          {/* Left Section: Basic Info */}
            <div className="health-info">
                <h1 className="medical-header">
                  Health and Medical Background
                </h1>

                <div className='horizontal-bar2'>
                      <div className='labels2'>
                          <label htmlFor="weight">Weight: </label>
                          <input type='text'
                          name='zip'
                          className="form-control-dob" 
                          placeholder='Enter Weight'
                          value={values.zip}
                          onChange={e => setValues({...values, weight: e.target.value})}/>
                      </div>
                      <div className='labels2'>
                          <label htmlFor="height">Height: </label>
                          <input type='text'
                          name='height'
                          className="form-control-gender" 
                          placeholder='Enter height'
                          value={values.height}
                          onChange={e => setValues({...values, height: e.target.value})}/>
                      </div>
                      <div className='labels2'>
                          <label htmlFor="active" className='active-label'>How active are you?: </label>
                          <input type='text'
                          name='state'
                          className="form-control-active" 
                          placeholder='Enter active level'
                          value={values.state}
                          onChange={e => setValues({...values, state: e.target.value})}/>
                      </div>
                      <div className='labels2'>
                          <label htmlFor="goal" className='goal-label'>Health Goals: </label>
                          <input type='text'
                          name='goal'
                          className="form-control-active" 
                          placeholder='Enter goal'
                          value={values.goal}
                          onChange={e => setValues({...values, goals: e.target.value})}/>
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
                            <Checkbox {...label}  />
                        </td>
                        <td>
                            Diabetes 
                            <Checkbox {...label}  />
                        </td>
                      </TableRow>
                      <TableRow>
                        <td>
                            Pregnant 
                            <Checkbox {...label}  />
                        </td>
                        <td>
                            Bipolar 
                            <Checkbox {...label}  />
                        </td>
                      </TableRow>
                      <TableRow>
                        <td>
                            Asthma 
                            <Checkbox {...label}  />
                        </td>
                        <td>
                            Anxiety 
                            <Checkbox {...label}  />
                        </td>
                      </TableRow>
                      <TableRow>
                        <td>
                            Epoilepsy 
                            <Checkbox {...label}  />
                        </td>
                        <td>
                            Other 
                            <Checkbox {...label}  />
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
                            <Checkbox {...label}  />
                        </td>
                        <td>
                            Eggs 
                            <Checkbox {...label}  />
                        </td>
                      </TableRow>
                      <TableRow>
                        <td>
                            Gluten 
                            <Checkbox {...label}  />
                        </td>
                        <td>
                            Vegan 
                            <Checkbox {...label}  />
                        </td>
                      </TableRow>
                      <TableRow>
                        <td>
                            Fish 
                            <Checkbox {...label}  />
                        </td>
                        <td>
                            Vegetarian 
                            <Checkbox {...label}  />
                        </td>
                      </TableRow>
                      <TableRow>
                        <td>
                            Dairy 
                            <Checkbox {...label}  />
                        </td>
                        <td>
                            Other 
                            <Checkbox {...label}  />
                        </td>
                      </TableRow>
                    </tbody>
                  </Table>
                </div>
                <div className='labels2'>
                        <label htmlFor="blood">Blood Type: </label>
                        <Select
                              className="form-control-select"
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={age}
                              onChange={handleChange}
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
        </form>


        </div>

        <div className="patienttest">

        <form className="form-container">
          <div className="info-container">
          {/* Left Section: Basic Info */}
            <div className="basic-info">
                  <h1>Other Information</h1>
                    <div className='labels'>
                        <label htmlFor="insur_name" className='pharm-address'>Insurance Name: </label>
                        <input type='text'
                        name='insur_name'
                        className="form-control" 
                        placeholder='Enter insurancen ame'
                        value={values.insur_name}
                        onChange={e => setValues({...values, insur_name: e.target.value})}/>
                    </div>
                    <div className='labels'>
                        <label htmlFor="policy" className='pharm-address'>Policy Number: </label>
                        <input type='text'
                        name='policy'
                        className="form-control" 
                        placeholder='Enter policy number'
                        value={values.policy}
                        onChange={e => setValues({...values, policy: e.target.value})}/>
                    </div>
                    {/*Normal Now */}
                    <div className='labels'>
                        <label htmlFor="exp">Exp. Date: </label>
                        <input type='text'
                        name='exp'
                        className="form-control" 
                        placeholder='Enter your exp date'
                        value={values.exp}
                        onChange={e => setValues({...values, exp: e.target.value})}/>
                    </div>
                    <div className='labels'>
                        <label htmlFor="email">Email: </label>
                        <input type='text'
                        name='email'
                        className="form-control" 
                        placeholder='Enter your email'
                        value={values.email}
                        onChange={e => setValues({...values, email: e.target.value})}/>
                    </div>
                    <div className='labels'>
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