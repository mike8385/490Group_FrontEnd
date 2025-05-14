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
import Modal from '@mui/material/Modal'; 
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import defaultAvatar from "../patient_dashboard/doctorim/doctor1.png"; // Default avatar image

const apiUrl = process.env.REACT_APP_API_URL;


/*
Add profile Photo option
Ask to include Gender, DOB, Address, Phone Number
Zipcode, City, State, Weight Height, Fitness level
Health Goals, Blood type,
Dietary Restrictions and Medical Conditions
*/


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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
    password: '',
    profile_pic: ''
  })

  const navigate = useNavigate()
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const [imageBase64, setImageBase64] = useState('');

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file type and size
  if (!file.type.match('image.*')) {
    showSnack('Please upload an image file (JPEG, PNG, etc.)');
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    showSnack('Image must be smaller than 2MB');
    return;
  }

  setUploadedFileName(file.name);
  const reader = new FileReader();
  reader.onloadend = () => {
    const result = reader.result;
    // Extract just the base64 portion
    const base64Data = result.split(',')[1];
    setValues({...values, profile_pic: base64Data});
  };
  reader.readAsDataURL(file);
};

  const [uploadedFileName, setUploadedFileName] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [blood, setBlood] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Inside your component:
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackType, setSnackType] = useState("error");

  const showSnack = (msg, type = "error") => {
    setSnackMsg(msg);
    setSnackType(type);
    setSnackOpen(true);
  };
  


  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setGender(event.target.value);
    setValues({...values, gender: event.target.value});
  };

  const handleChange2 = (event) => {
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
      showSnack("Please accept the terms and conditions.");
      return;
    }
  
    // Validate ZIP code
    if (!validateZipCode(values.zip)) {
      showSnack("Please enter a valid 5-digit ZIP code");
      return;
    }
  
    // Validate pharmacy ZIP if new pharmacy
    if (isNewPharmacy && !validateZipCode(values.pharm_zip)) {
      showSnack("Please enter a valid 5-digit pharmacy ZIP code");
      return;
    }
  
    // Validate phone number
    // Validate phone number
    if (!validatePhoneNumber(values.phone)) {
      showSnack("Please enter a valid phone number (e.g., 123-456-7890 or 1234567890)");
      return;
    }
  
    // Validate policy number
    if (!validatePolicyNumber(values.policy)) {
      showSnack("Insurance policy number must contain only numbers");
      return;
    }

    if (!validateEmail(values.email)) {
      showSnack("Please enter a valid email address (e.g., user@example.com)");
      return;
    }

    if (!validateInsuranceName(values.insur_name)) {
      showSnack("Please enter a valid insurance name (cannot be just numbers)");
      return;
    }
  
    const today = new Date();
    const dob = new Date(values.dob);
    const exp = new Date(values.exp);
  
  
    if (dob > today) {
      showSnack("Date of birth cannot be in the future.");
      return;
    }
  
    if (exp < today) {
      showSnack("Insurance expiration date must be in the future.");
      return;
    }

  
    setLoading(true);
  
    const fullData = {
      first_name: values.first_name,
      last_name: values.last_name,
      pharmacy_name: values.pharmacy_name,
      pharmacy_address: values.pharmacy_address,
      pharmacy_zipcode: values.pharm_zip,
      insurance_provider: values.insur_name,
      insurance_policy_number: values.policy,
      insurance_expiration_date: values.exp,
      patient_email: values.email,
      patient_password: values.password,
      mobile_number: values.phone,
      dob: values.dob,
      gender: values.gender,
      height: values.height,
      weight: values.weight,
      activity: values.fitness,
      health_goals: values.goal,
      dietary_restrictions: dietaryRestrictions.join(', ') || "None",
      blood_type: values.blood,
      patient_address: values.address,
      patient_zipcode: values.zip,
      patient_city: values.city,
      patient_state: values.state,
      medical_conditions: medicalConditions.join(', ') || "None",
      family_history: "None",
      past_procedures: "None",
      profile_pic: values.profile_pic || defaultAvatar
    };
    console.log("Data:", fullData);
  
    fetch(`${apiUrl}/register-patient-with-survey`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullData)
    })
      .then(res => res.json())
      .then(response => {
        if (response.message) {
          showSnack("Account and survey submitted successfully!");
          navigate('/landing');
        } else {
          throw new Error(response.error || "Something went wrong");
        }
      })
      .catch(async (error) => {
        const msg = error?.message || "Could not create user.";
        showSnack(msg);
        console.error("Error:", msg);
      })
      .finally(() => setLoading(false));
  };
  

  const [pharmacies, setPharmacies] = useState([]);
  const [isNewPharmacy, setIsNewPharmacy] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/pharmacies`)
      .then(res => res.json())
      .then(data => setPharmacies(data))
      .catch(err => console.error("Failed to fetch pharmacies", err));
  }, []);

  // Validation functions
  const validateZipCode = (zip) => {
    const usZipRegex = /^\d{5}(-\d{4})?$/;
    return usZipRegex.test(zip);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(?:\d{3}-\d{3}-\d{4}|\d{10})$/;
    return phoneRegex.test(phone);
  };

  const validatePolicyNumber = (policy) => {
    const policyRegex = /^[0-9]+$/;
    return policyRegex.test(policy);
  };

  const validateEmail = (email) => {
    // More strict email regex that prevents consecutive dots and requires proper format
    const emailRegex = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && 
           email.split('@')[0].length > 0 && 
           !email.includes('..') && 
           !email.startsWith('.') && 
           !email.split('@')[0].endsWith('.');
  };

  const validateInsuranceName = (name) => {
    // Requires at least one letter (not just numbers)
    const insuranceRegex = /^(?=.*[a-zA-Z]).+$/;
    return insuranceRegex.test(name) && name.trim().length > 0;
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
                <label htmlFor="first_name" className='input-group'>
                  First Name:
                  <input 
                    type='text'
                    name='first_name'
                    className="input-field" 
                    placeholder='Enter First Name'
                    value={values.first_name}
                    onChange={e => setValues({...values, first_name: e.target.value})}
                  />
                </label>
              </div>
                <div className='labels'>
                  <label className='input-group' htmlFor="last_name">Last Name:
                  <input type='text'
                    name='last_name'
                    className="input-field" 
                    placeholder='Enter last Name'
                    value={values.last_name}
                    onChange={e => setValues({...values, last_name: e.target.value})}/>
                  </label>
                </div>

                {/*Make the fields horizontal */}
                <div className='horizontal-bar'>
                <div className='labels'>
                  <label htmlFor="dob" className='input-group'>
                    DOB:
                    <input
                      type='date'
                      name='dob'
                      className="input-field-dob"
                      value={values.dob}
                      onChange={e => setValues({...values, dob: e.target.value})}
                      style={{ height: '35px' }}
                    />
                  </label>
                </div>
                  <div className='labels'>
                    <label htmlFor="gender" className='input-group'>
                      Gender:
                      <Select
                        className="input-field"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={gender}
                        onChange={handleChange}
                        displayEmpty
                        renderValue={(selected) => selected ? selected : "Select"}
                        sx={{
                          height: '35px',
                          borderRadius: '23px',
                          '& .MuiSelect-select': {
                            padding: '0 10px'
                          }
                        }}
                      >
                        <MenuItem value='Male'>Male</MenuItem>
                        <MenuItem value='Female'>Female</MenuItem>
                        <MenuItem value='Other'>Other</MenuItem>
                      </Select>
                    </label>
                  </div>
                </div>

                {/*Normal Now */}
                <div className='labels'>
                  <label className='input-group' htmlFor="phone">Phone: 
                  <input
                    type='tel'
                    name='phone'
                    className="input-field" 
                    placeholder='Enter phone (e.g., 123-456-7890 or 1234567890)'
                    pattern="^(?:\d{3}-\d{3}-\d{4}|\d{10})$"
                    title="Please enter a valid phone number (e.g., 123-456-7890 or 1234567890)"
                    value={values.phone}
                    onChange={e => {
                      // Auto-format as user types
                      const input = e.target.value.replace(/\D/g, ''); // Remove all non-digits
                      let formatted = input;
                      
                      // Format as 123-456-7890 if length > 3 and <= 6
                      if (input.length > 3 && input.length <= 6) {
                        formatted = `${input.slice(0, 3)}-${input.slice(3)}`;
                      } 
                      // Format as 123-456-7890 if length > 6
                      else if (input.length > 6) {
                        formatted = `${input.slice(0, 3)}-${input.slice(3, 6)}-${input.slice(6, 10)}`;
                      }
                      
                      setValues({...values, phone: formatted});
                    }}
                    maxLength="12" // 123-456-7890 is 12 chars
                    onBlur={(e) => {
                      if (!validatePhoneNumber(e.target.value)) {
                        showSnack("Please enter a valid phone number (e.g., 123-456-7890 or 1234567890)");
                      }
                    }}
                  />  
                  </label>
                </div>
                <div className='labels'>
                  <label className='input-group' htmlFor="address">Address: 
                  <input type='text'
                    name='address'
                    className="input-field" 
                    placeholder='Enter your address'
                    value={values.address}
                    onChange={e => setValues({...values, address: e.target.value})}/>
                  </label>
                </div>

                {/*Make fields horizontal again */}              
                <div className='horizontal-bar'>
                  <div className='labels'>
                    <label htmlFor="zip" className='input-group'>Zip code: 
                    <input
                      type='text'  // Changed from number to allow dashes
                      name='zip'
                      className="input-field-small" 
                      placeholder='Enter ZIP'
                      pattern="^\d{5}(-\d{4})?$"
                      title="Please enter a valid 5-digit ZIP code (optionally with 4-digit extension)"
                      value={values.zip}
                      onChange={e => setValues({...values, zip: e.target.value})}
                    />
                    </label>
                  </div>
                  <div className='labels'>
                    <label htmlFor="city" className='input-group'>City: 
                    <input type='text'
                      name='city'
                      className="input-field-small" 
                      placeholder='Enter City'
                      value={values.city}
                      onChange={e => setValues({...values, city: e.target.value})}/>
                      </label>
                  </div>
                  <div className='labels'>
                    <label htmlFor="state" className='input-group'>State:
                    <input type='text'
                      name='state'
                      className="input-field-small" 
                      placeholder='Enter state'
                      value={values.state}
                      onChange={e => setValues({...values, state: e.target.value})}/>
                      </label>
                  </div>
                </div>
              </div>

              {/*Pharmacy side */}
              {/* <div className="pharmacy-info">
                <h1>Pharmacy Information</h1>

                <div className="labels">
                  <label className="input-group">Pharmacy: 
                    <Select
                      className="input-field-select"
                      value={values.pharmacy_name}
                      onChange={(e) => {
                        const selectedName = e.target.value;
                        if (selectedName === "__new") {
                          setIsNewPharmacy(true);
                          setValues(v => ({
                            ...v,
                            pharmacy_name: "", // Clear the temporary value
                            pharmacy_address: '',
                            pharm_zip: '',
                            pharm_city: ''
                          }));
                        } else {
                          setIsNewPharmacy(false);
                          const selectedPharmacy = pharmacies.find(p => p.name === selectedName);
                          if (selectedPharmacy) {
                            setValues(v => ({
                              ...v,
                              pharmacy_name: selectedPharmacy.name,
                              pharmacy_address: selectedPharmacy.address,
                              pharm_zip: selectedPharmacy.zipcode,
                              pharm_city: selectedPharmacy.city
                            }));
                          }
                        }
                      }}
                      displayEmpty
                      renderValue={(selected) => selected ? (selected === "__new" ? "Add New Pharmacy" : selected) : "Select Pharmacy"}
                    >
                      {pharmacies.map((pharm, idx) => (
                        <MenuItem key={idx} value={pharm.name}>
                          {pharm.name}
                        </MenuItem>
                      ))}
                      <MenuItem value="__new">Add New Pharmacy</MenuItem>
                    </Select>
                  </label>
                </div>

                {isNewPharmacy && (
                  <>
                    <div className="labels">
                      <label className="input-group">
                        Pharmacy Name:
                        <input
                          type="text"
                          name="pharmacy_name"
                          className="input-field" 
                          placeholder="Enter new pharmacy name"
                          value={values.pharmacy_name}
                          onChange={e => setValues({...values, pharmacy_name: e.target.value})}
                          required
                        />
                      </label>
                    </div>
                    <div className="labels">
                      <label className="input-group">
                        Pharmacy Address:
                        <input
                          type="text"
                          name="pharmacy_address"
                          className="input-field" 
                          placeholder="Enter pharmacy address"
                          value={values.pharmacy_address}
                          onChange={e => setValues({...values, pharmacy_address: e.target.value})}
                          required
                        />
                      </label>
                    </div>
                    <div className="horizontal-bar">
                      <div className="labels">
                        <label className="input-group">
                          Zip Code:
                          <input
                            type="text"
                            name="pharm_zip"
                            className="input-field-small" 
                            placeholder="Enter ZIP"
                            value={values.pharm_zip}
                            onChange={e => setValues({...values, pharm_zip: e.target.value})}
                            pattern="^\d{5}(-\d{4})?$"
                            title="Please enter a valid 5-digit ZIP code"
                            required
                          />
                        </label>
                      </div>
                      <div className="labels">
                        <label className="input-group">
                          City:
                          <input
                            type="text"
                            name="pharm_city"
                            className="input-field-small" 
                            placeholder="Enter City"
                            value={values.pharm_city}
                            onChange={e => setValues({...values, pharm_city: e.target.value})}
                            required
                          />
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </div> */}
              <div className="pharmacy-info">
  <h1>Pharmacy Information</h1>

  <div className="labels">
    <label className="input-group">Pharmacy: 
      <Select
        className="input-field-select"
        value={values.pharmacy_name}
        onChange={(e) => {
          const selectedName = e.target.value;
          const selectedPharmacy = pharmacies.find(p => p.name === selectedName);
          if (selectedPharmacy) {
            setValues(v => ({
              ...v,
              pharmacy_name: selectedPharmacy.name,
              pharmacy_address: selectedPharmacy.address,
              pharm_zip: selectedPharmacy.zipcode,
              pharm_city: selectedPharmacy.city
            }));
          }
        }}
        displayEmpty
        renderValue={(selected) => selected ? selected : "Select Pharmacy"}
      >
        {pharmacies.map((pharm, idx) => (
          <MenuItem key={idx} value={pharm.name}>
            {pharm.name}
          </MenuItem>
        ))}
      </Select>
    </label>
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
                    <label htmlFor="weight" className="input-group">
                      Weight:
                      <input
                      sx={{color: 'black'}}
                        type="text"
                        name="weight"
                        className="input-field-weight"
                        placeholder="Enter Weight"
                        value={values.weight}
                        onChange={e => setValues({ ...values, weight: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className='labels2'>
                    <label className='input-group' htmlFor="height">Height:
                    <input type='text'
                      name='height'
                      className="input-field" 
                      placeholder='Enter height'
                      value={values.height}
                      onChange={e => setValues({...values, height: e.target.value})}/>
                      </label>
                  </div>
                  <div className='labels2'>
                    <label htmlFor="fitness" className='input-group'>Hours of Fitness: 
                    <input type='text'
                      name='fitness'
                      className="input-field-weight" 
                      placeholder='Enter active level'
                      value={values.fitness}
                      onChange={e => setValues({...values, fitness: e.target.value})}/>
                      </label>
                  </div>
                  <div className='labels2'>
                    <label htmlFor="goal" className='input-group'>Health Goals:
                    <input type='text'
                      name='goal'
                      className="input-field-weight" 
                      placeholder='Enter goal'
                      value={values.goal}
                      onChange={e => setValues({...values, goal: e.target.value})}/>
                      </label>
                  </div>
                </div>
                
                <div className="table-container">
                  <div className='medic-info'>
                    <div className='table-section'>
                    <Table sx={{boar: "None"}}>
                      <thead>
                        <TableRow>
                          <th colSpan={2}>Please Check Off All Medical Conditions</th>
                        </TableRow>
                      </thead>
                      <tbody>
                      <TableRow>
                        <td>
                          <label className="checkbox-pill">
                            Cancer 
                            <Checkbox name="Cancer" checked={medicalConditions.includes("Cancer")} onChange={(e) => handleCheckboxChange(e, "medical")}/>
                          </label>
                        </td>
                        <td>
                          <label className="checkbox-pill">
                            Diabetes 
                            <Checkbox name="Diabetes" checked={medicalConditions.includes("Diabetes")} onChange={(e) => handleCheckboxChange(e, "medical")}/>
                          </label>
                        </td>
                      </TableRow>
                      <TableRow>
                        <td>
                          <label className="checkbox-pill">
                            Pregnant 
                            <Checkbox name="Pregnant" checked={medicalConditions.includes("Pregnant")} onChange={(e) => handleCheckboxChange(e, "medical")}/>
                          </label>
                        </td>
                        <td>
                          <label className="checkbox-pill">
                            Bipolar 
                            <Checkbox name="Bipolar" checked={medicalConditions.includes("Bipolar")} onChange={(e) => handleCheckboxChange(e, "medical")}/>
                          </label>
                        </td>
                      </TableRow>
                      <TableRow>
                        <td>
                          <label className="checkbox-pill">
                            Asthma 
                            <Checkbox name="Asthma" checked={medicalConditions.includes("Asthma")} onChange={(e) => handleCheckboxChange(e, "medical")}/>
                          </label>
                        </td>
                        <td>
                          <label className="checkbox-pill">
                            Anxiety 
                            <Checkbox name="Anxiety" checked={medicalConditions.includes("Anxiety")} onChange={(e) => handleCheckboxChange(e, "medical")}/>
                          </label>
                        </td>
                      </TableRow>
                      <TableRow>
                        <td>
                          <label className="checkbox-pill">
                            Epilepsy 
                            <Checkbox name="Epilepsy" checked={medicalConditions.includes("Epilepsy")} onChange={(e) => handleCheckboxChange(e, "medical")}/>
                          </label>
                        </td>
                        <td>
                          <label className="checkbox-pill">
                            Other 
                            <Checkbox name="Other" checked={medicalConditions.includes("Other")} onChange={(e) => handleCheckboxChange(e, "medical")}/>
                          </label>
                        </td>
                      </TableRow>
                      </tbody>
                    </Table>
                    </div>
                  </div>

                  <div className='diet-info'>
                    <div className='table-section'>
                    <Table>
                      <thead>
                        <TableRow>
                          <th colSpan={2}>Please Check Off All Dietary Restrictions</th>
                        </TableRow>
                      </thead>
                      <tbody>
                      <TableRow>
                        <td>
                          <label className="checkbox-pill">
                            Nuts 
                            <Checkbox name="Nuts" checked={dietaryRestrictions.includes("Nuts")} onChange={(e) => handleCheckboxChange(e, "diet")}/>
                          </label>
                        </td>
                        <td>
                          <label className="checkbox-pill">
                            Eggs 
                            <Checkbox name="Eggs" checked={dietaryRestrictions.includes("Eggs")} onChange={(e) => handleCheckboxChange(e, "diet")}/>
                          </label>
                        </td>
                      </TableRow>
                      <TableRow>
                        <td>
                          <label className="checkbox-pill">
                            Gluten 
                            <Checkbox name="Gluten" checked={dietaryRestrictions.includes("Gluten")} onChange={(e) => handleCheckboxChange(e, "diet")}/>
                          </label>
                        </td>
                        <td>
                          <label className="checkbox-pill">
                            Vegan 
                            <Checkbox name="Vegan" checked={dietaryRestrictions.includes("Vegan")} onChange={(e) => handleCheckboxChange(e, "diet")}/>
                          </label>
                        </td>
                      </TableRow>
                      <TableRow>
                        <td>
                          <label className="checkbox-pill">
                            Fish 
                            <Checkbox name="Fish" checked={dietaryRestrictions.includes("Fish")} onChange={(e) => handleCheckboxChange(e, "diet")}/>
                          </label>
                        </td>
                        <td>
                          <label className="checkbox-pill">
                            Vegetarian 
                            <Checkbox name="Vegetarian" checked={dietaryRestrictions.includes("Vegetarian")} onChange={(e) => handleCheckboxChange(e, "diet")}/>
                          </label>
                        </td>
                      </TableRow>
                      <TableRow>
                        <td>
                          <label className="checkbox-pill">
                            Dairy 
                            <Checkbox name="Dairy" checked={dietaryRestrictions.includes("Dairy")} onChange={(e) => handleCheckboxChange(e, "diet")}/>
                          </label>
                        </td>
                        <td>
                          <label className="checkbox-pill">
                            Other 
                            <Checkbox name="Other" checked={dietaryRestrictions.includes("Other")} onChange={(e) => handleCheckboxChange(e, "diet")}/>
                          </label>
                        </td>
                      </TableRow>
                      </tbody>
                    </Table>
                    </div>
                  </div>
                  <div className='labels2'>
                    <label className='input-group' htmlFor="blood">Blood Type:
                    <Select
                      className="input-field"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={blood}
                      onChange={handleChange2}
                      displayEmpty
                      renderValue={(selected) => selected ? selected : "Select Blood Type"}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: '#EEF2FE',
                            borderRadius: 5, // rounds the dropdown menu
                            mt: 1, // optional spacing between input and menu
                          },
                        },
                      }}
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
                    </label>
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
                  <label htmlFor="insur_name" className='insurance-label'>
                    Insurance Name:
                    <input 
                      type='text'
                      name='insur_name'
                      className="insurance-input" 
                      placeholder='Enter insurance name (e.g., Blue Cross)'
                      value={values.insur_name}
                      onChange={e => setValues({...values, insur_name: e.target.value})}
                      pattern="^(?=.*[a-zA-Z]).+$"
                      title="Insurance name must contain letters (not just numbers)"
                      onBlur={(e) => {
                        if (!validateInsuranceName(e.target.value)) {
                          showSnack("Please enter a valid insurance name (cannot be just numbers)");
                        }
                      }}
                    />
                  </label>
                </div>
                <div className='labels'>
                  <label htmlFor="policy" className='insurance-label'>Policy Number: 
                  <input
                    type='text'
                    name='policy'
                    className="insurance-input" 
                    placeholder='Enter policy number (numbers only)'
                    pattern="^[0-9]+$"
                    title="Policy number must contain only numbers"
                    value={values.policy}
                    onChange={e => setValues({...values, policy: e.target.value})}
                  />
                  </label>
                </div>
                {/*Normal Now */}
                <div className='labels'>
                  <label className='input-group' htmlFor="exp">Exp. Date: 
                  <input type='date'
                    name='exp'
                    className="input-field" 
                    placeholder='Enter your exp date'
                    value={values.exp}
                    onChange={e => setValues({...values, exp: e.target.value})}/>
                    </label>
                </div>
                <div className='labels'>
                  <label className='input-group' htmlFor="email">Email: 
                  <input
                    className="input-field" 
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={e => setValues({...values, email: e.target.value})}
                    required
                    pattern="^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$"
                    title="Please enter a valid email address (e.g., user@example.com)"
                    placeholder="Enter your email"
                    onBlur={(e) => {
                      if (!validateEmail(e.target.value)) {
                        showSnack("Please enter a valid email address (e.g., user.name@example.com)");
                      }
                    }}
                  />
                  </label>
                </div>
                <div className='labels'>
                  <label className='input-group'htmlFor="password">Password: 
                  <input
                    type={showPassword ? "text" : "password"}
                    id="psw"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    name='password'
                    className="input-field"
                    placeholder='Enter your password'
                    title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                    required
                    value={values.password}
                    onChange={e => setValues({...values, password: e.target.value})}
                  />
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    size="small"
                    variant="text"
                    className="icon-button"
                  >
                    {showPassword 
                      ? <VisibilityIcon/> 
                      : <VisibilityOffIcon />}
                  </Button>
                  </label>

                </div>      
                <div className='labels'> 
                  <label className='input-group' onClick={handleOpen}>Do you Accept the terms and conditions? 
                    <Checkbox checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)}  />
                  </label>
                          <Modal
                            onClose={handleClose}
                            open={open}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box sx={style} >
                              <Typography id="modal-modal-title" variant="h5" component="h2" color="black">
                                Terms and Conditions
                              </Typography>
                              <Box className='custom-scroll' style={{height: '50vh', overflowY: 'auto'}}>
                                                  {/* <Box className="custom-scroll" sx={{ height: '30vh', width: '90%', margin: 'auto', overflowY: "auto" }}></Box> */}
                                <Typography >
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                Proin tristique vehicula elit ut commodo. Aenean et lorem dignissim, fringilla leo in,
                                fermentum ex. Pellentesque mattis neque quis egestas ultricies. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                In vehicula accumsan consectetur. Quisque dapibus venenatis tincidunt. Curabitur commodo, ex a consequat auctor, diam nibh 
                                dictum risus, nec scelerisque quam est eget sem. Etiam et posuere metus. Fusce maximus eleifend placerat.
                                Curabitur quis faucibus magna. Proin vitae imperdiet lacus. Nulla efficitur ante eu nulla rutrum,
                                a vehicula neque dapibus.
                                </p>
                                <br/>
                                Donec pretium in orci et ultricies. Donec est libero, 
                                facilisis vitae leo id, rhoncus ultricies nisl. Duis luctus, velit id finibus posuere, 
                                ligula diam egestas ex, et tincidunt est sapien id dolor. Proin et odio ac mauris sodales ultricies. 
                                Nam quis interdum leo. Nullam id porttitor dui, eget ornare sapien. Etiam ut turpis volutpat urna efficitur condimentum. 
                                Proin ligula metus, imperdiet sed neque et, vehicula cursus erat. Maecenas in nibh a quam dictum tempus efficitur non erat. 
                                Nulla sodales turpis augue, sed tempus ligula gravida et. Interdum et malesuada fames ac ante ipsum primis in faucibus. 
                                In hac habitasse platea dictumst. Pellentesque eu diam quis purus iaculis ultrices. Cras vulputate rutrum odio non convallis.
                                </Typography>
                              </Box>

                            </Box>
                          </Modal>

                </div>            
              </div>

                <div>
                    <h1>Profile Picture</h1>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Button
                              variant="contained"
                              component="label"
                              sx={{ bgcolor: '#A0B9DA', width: '100%' ,textAlign:'center', height: '100%'}}
                            >
                              Upload Image File
                          <input 
                            hidden 
                            accept="image/*" 
                            type="file" 
                            onChange={handleFileUpload}
                          />

                            </Button>

                            {/* File name shown to the right of button */}
                            {values.profile_pic ? (
                              <div style={{ marginTop: '10px' }}>
                                <img 
                                  src={values.profile_pic} 
                                  alt="Profile preview" 
                                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                                />
                              </div>
                            ) : (
                              <div style={{ marginTop: '10px' }}>
                                <img 
                                  src={defaultAvatar} 
                                  alt="Default profile" 
                                  style={{ 
                                    maxWidth: '100px', 
                                    maxHeight: '100px',
                                    borderRadius: '50%'
                                  }}
                                />
                              </div>
                            )}
                            {uploadedFileName && (
                              <Typography sx={{ fontSize: '0.9rem', color: '#5E4B8B', fontWeight: 'bold' }}>
                                {uploadedFileName}
                              </Typography>
                            )}
                          </Box>
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
        <Snackbar
          open={snackOpen}
          autoHideDuration={4000}
          onClose={() => setSnackOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert onClose={() => setSnackOpen(false)} severity={snackType} variant="filled" sx={{ width: '100%' }}>
            {snackMsg}
          </MuiAlert>
        </Snackbar>

      </div>
    </>
  );
}

export default Patientsignup;