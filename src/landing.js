import React, { useState, useEffect } from "react";
import "./landing.css";
import heroImage from "./assets/heroimage.png";
import patient1 from "./assets/patient1.png";
import patient2 from "./assets/patient2.png";
import patient3 from "./assets/patient3.png";

import doctor1 from "./assets/doctor1.png";
import doctor2 from "./assets/doctor2.png";
import doctor3 from "./assets/doctor3.png";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const apiUrl = process.env.REACT_APP_API_URL;

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)  
};

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
  justifyContent: 'center'
};

function ContactMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
    <Box>
      <Button
        color="inherit"
        onClick={handleClick}
        endIcon={<MoreVertIcon />}
        sx={{ fontSize: '2.3vh' }}
      >
        Contact Us
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
      
  <MenuItem onClick={() => copyToClipboard("+1 (555) 123-4567")}>
    <Typography  sx={{pr:'1vh'}} component="span">Phone: </Typography>
    <Typography  component="span" sx={{ color: 'primary.main', paddingRight:'12vh' }}>
      +1 (555) 123-4567
    </Typography>
  <ContentCopyIcon color="primary"  fontSize="small" />
      
  </MenuItem>
  <MenuItem onClick={() => copyToClipboard("contact@dpp.com")}>
    <Typography sx={{pr:'1vh'}} component="span">E-mail:  </Typography>
    <Typography component="span" sx={{ color: 'primary.main', paddingRight:'12.6vh' }}>
      contact@dpp.com
    </Typography>
    <ContentCopyIcon color="primary" fontSize="small" />

  </MenuItem>
  <MenuItem onClick={() => copyToClipboard("123 Health St, Wellness City")}>
    <Typography sx={{pr:'1vh'}} component="span">Location:  </Typography>
    <Typography component="span" sx={{ color: 'primary.main', paddingRight:'2vh' }}>
      123 Health St, Wellness City
    </Typography>
    <ContentCopyIcon color="primary" fontSize="small" />

  </MenuItem>
</Menu>

    </Box>
    </div>
  );
}

function Landing() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [openAbout, setOpenAbout] = useState(false);
  

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackType, setSnackType] = useState("error");

  const showSnack = (msg, type = "error") => {
    setSnackMsg(msg);
    setSnackType(type);
    setSnackOpen(true);
  };



  useEffect(() => {
    fetch(`${apiUrl}/doctors`)
      .then(response => response.json())
      .then(data => {
        const topDoctors = data.sort((a, b) => b.doctor_rating - a.doctor_rating).slice(0, 3);
        setDoctors(topDoctors);
      })
      .catch(error => console.error("Error fetching doctor data:", error));
  }, []);

  const handleOpenAbout = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenAbout(true);
  };

  const handleCloseAbout = () => {
    setOpenAbout(false);
    setSelectedDoctor(null);
  };
//
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [openLogin, setOpenLogin] = React.useState(false);
    const handleOpenLogin = () => setOpenLogin(true);
    const handleCloseLogin = () => setOpenLogin(false);

    const [openPatientLogin, setOpenPatientLogin] = React.useState(false);
    const handleOpenPatientLogin = () => setOpenPatientLogin(true);
    const handleClosePatientLogin = () => setOpenPatientLogin(false);

    const [openDoctorLogin, setOpenDoctorLogin] = React.useState(false);
    const handleOpenDoctorLogin = () => setOpenDoctorLogin(true);
    const handleCloseDoctorLogin = () => setOpenDoctorLogin(false);

    const [openPharmacyLogin, setOpenPharmacyLogin] = React.useState(false);
    const handleOpenPharmacyLogin = () => setOpenPharmacyLogin(true);
    const handleClosePharmacyLogin = () => setOpenPharmacyLogin(false);

    const [showPassword, setShowPassword] = useState(false);
    

      const [values, setValues] = useState({
        email: '',
        password: ''
    })
    
    const navigate = useNavigate()
    const handleLogin = async (email, password) => {
      try {
        const response = await fetch(`${apiUrl}/login-patient`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          // Save patient ID (and optionally, email or token)
          console.log("Patient ID returned from backend:", data.patient_id); // ✅ debug line
          localStorage.setItem("patientId", data.patient_id);
          localStorage.removeItem("doctorId");

          // Redirect to dashboard
          navigate("/patient_dashboard/patient_landing");
        } else {
          showSnack(data.error || "Login failed");
        }
      } catch (error) {
        console.error("Login error:", error);
        showSnack("An error occurred. Please try again.");
      }
    };

    const handleLogin2 = async (email, password) => {
      try {
        const response = await fetch(`${apiUrl}/login-doctor`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          // Save patient ID (and optionally, email or token)
          console.log("Doctor ID returned from backend:", data.doctor_id); // ✅ debug line
          localStorage.setItem("doctorId", data.doctor_id);
          localStorage.removeItem("patientId");
          // Redirect to dashboard
          navigate("/doctor_dashboard/doctor_landing");
        } else {
          showSnack(data.error || "Login failed");
        }
      } catch (error) {
        console.error("Login error:", error);
        showSnack("An error occurred. Please try again.");
      }
    };

    const handleLogin3 = async (email, password) => {
      try {
        const response = await fetch(`${apiUrl}/login-pharmacy`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          // Save patient ID (and optionally, email or token)
          localStorage.setItem("pharmacyId", data.pharmacy_id);
          // Redirect to dashboard
          navigate("/pharmacy/pharmacy_landing");
        } else {
          showSnack(data.error || "Login failed");
        }
      } catch (error) {
        console.error("Login error:", error);
        showSnack("An error occurred. Please try again.");
      }
    };


  // const [doctors, setDoctors] = useState([]);
  // useEffect(() => {
  //   fetch('http://127.0.0.1:5000/doctors')
  //     .then(response => response.json())
  //     .then(data => {
  //       // Sort by doctor_rating (descending) and take top 3
  //       const topDoctors = data
  //         .sort((a, b) => b.doctor_rating - a.doctor_rating)
  //         .slice(0, 3);
  //       setDoctors(topDoctors);
  //     })
  //     .catch(error => {
  //       console.error("Error fetching doctor data:", error);
  //     });
  // }, []);

  const [contactOpen, setContactOpen] = useState(false);

const contactInfo = {
  phone: "123-456-7890",
  email: "contact@dpp.com",
  address: "123 Healthy Way, Wellness City, HW 54321",
};

const handleCopy = (text) => {
  navigator.clipboard.writeText(text);
  showSnack("Copied to clipboard: " + text);
};

  
    useEffect(() => {
      fetch(`${apiUrl}/doctors`)
        .then(response => response.json())
        .then(data => {
          const topDoctors = data.sort((a, b) => b.doctor_rating - a.doctor_rating).slice(0, 3);
          setDoctors(topDoctors);
        })
        .catch(error => console.error("Error fetching doctor data:", error));
    }, []);

const stories = [
  {
    title: "Health Discipline",
    image: patient1,
    short: `"Three years ago, I could barely walk up a flight of stairs without gasping for air. I was borderline diabetic, Read more..."`,
    full: `"Three years ago, I could barely walk up a flight of stairs without gasping for air. I was borderline diabetic, severely overweight, and emotionally drained. I had tried every crash diet imaginable, from keto to juice cleanses, but nothing ever lasted. Then a friend told me about this clinic — how their doctors focused on sustainable meal plans tailored to your lifestyle. From the very first consultation, I felt heard. My nutritionist helped me replace shame with structure. They built me a custom plan that didn't just include what to eat, but when and why. Within six months, I had lost 40 pounds and had energy I hadn't felt in years. A year later, I ran my first 5K. I still follow the meal plan today — it's become second nature. I regained my health, my joy, and most importantly, my hope."`
  },
  {
    title: "Health to Wealth",
    image: patient2,
    short: `"I used to be the 'big guy' in the office — always smiling, but hiding a lot. I was 280 pounds, living on caffeine Read more..."`,
    full: `"I used to be the 'big guy' in the office — always smiling, but hiding a lot. I was 280 pounds, living on caffeine and junk food. I felt sluggish, insecure, and too embarrassed to ask for help. A friend practically dragged me to this clinic. I expected judgment, but what I got was support and a game plan. My doctor understood my crazy travel schedule and built a meal plan I could stick to even on the road. He taught me how to navigate hotel breakfasts and late-night cravings. The weight started coming off slowly, then steadily. Over 18 months, I dropped 90 pounds. I gained confidence, started a fitness blog, and even launched my own meal prep brand. Last year, I made my first million — and donated $100,000 back to the clinic to help others start their journey too. My transformation wasn't just physical — it changed the course of my life."`
  },
  {
    title: "Feeling Fantastic",
    image: patient3,
    short: `"My name is Rachel, and I used to eat out for almost every meal. I thought I was too far gone to change. Read more..."`,
    full: `"My name is Rachel, and I used to eat out for almost every meal. I thought I was too far gone to change. Life was hectic — long shifts, zero motivation, and comfort food everywhere. When my doctor told me my blood pressure was sky-high at just 32, I was terrified. A co-worker referred me to this clinic, and I expected another lecture. What I got instead was compassion and strategy. My dietitian worked with me to build realistic meal plans I could cook even on my busiest nights. She even included my favorite foods in healthier forms. Over 14 months, I lost 60 pounds, lowered my blood pressure, and found myself again. I sleep better, think clearer, and even cook for fun now. The clinic didn't just change my health — they gave me a second shot at living well."`
  }
];
    const [openReadMore, setOpenReadMore] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  const handleOpenReadMore = (story) => {
    setSelectedStory(story);
    setOpenReadMore(true);
  };

  const handleCloseReadMore = () => setOpenReadMore(false);
  return (
    <div id="sizeScreen">
    <div className="Landing">
    <AppBar position="static" sx={{ bgcolor: "#5889BD" }}>
  <Toolbar>
    <Typography id='signUp' sx={{ flexGrow: 1 , fontSize:'5.5vh'}}>
      D P P
    </Typography>

    <Button color="inherit" sx={{ p:'2vh',fontSize: '2.3vh' }} onClick={() => {
      const section = document.getElementById("ourStories");
      section?.scrollIntoView({ behavior: 'smooth' });
    }}>
      Our Stories
    </Button>
    <Button color="inherit" sx={{pl:'2vh',pr:'2vh', fontSize: '2.3vh' }} onClick={() => {
      const section = document.getElementById("ourDoctors");
      section?.scrollIntoView({ behavior: 'smooth' });
    }}>
      Our Doctors
    </Button>
    <ContactMenu />
  </Toolbar>
</AppBar>



      <div className="landinghero">
        <div className="herotext">
            <h3 >Have Access To A Health Professional at Any Time</h3>
            <div  className="herobuttons">
            {/*Login Buttons*/}
            <Button className="herobutton" onClick={handleOpenLogin}>Login</Button>
                <Modal
                  open={openLogin}
                  onClose={handleCloseLogin}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  {/*opens first popup asking if youre a doctor/patient*/}
                  <Box sx={{
                  ...style,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  textAlign: 'center'
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" color="black">
                      Are you a patient or a doctor?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>

                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      width: '100%',
                      alignItems: 'center'
                    }}>
                            {/*If you select patient*/}
                          <Button 
                            variant="contained" 
                            onClick={handleOpenPatientLogin}
                            sx={{
                              width: '80%',
                              borderRadius: '28px',
                              py: 1.5,
                              backgroundColor: '#5C8CC6',
                              '&:hover': { backgroundColor: '#4A76A8' }
                            }}>
                                  Patient 
                            </Button>
<Modal
  open={openPatientLogin}
  onClose={handleClosePatientLogin}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={{
    ...style,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    borderRadius: '23px',
    padding: '30px'
  }}>
    <Typography id="modal-modal-title" variant="h6" component="h2" color="black" sx={{ textAlign: 'center' }}>
      Patient Login
    </Typography>
    
    {/* Email Field */}
    <div className='labels'>
      <label className='input-group' htmlFor="email">
        Email:
        <input
          type='text'
          name='email'
          className="input-field" 
          placeholder='Enter Email'
          value={values.email}
          onChange={e => setValues({...values, email: e.target.value})}
          style={{ width: '100%', padding: '8px 12px', boxSizing: 'border-box' }}
        />
      </label>
    </div>
    
    {/* Password Field */}
    <div className='labels'>
      <label className='input-group' htmlFor="password">
        Password:
        <input
          type='password'
          name='password'
          className="input-field" 
          placeholder='Enter Password'
          value={values.password}
          onChange={e => setValues({...values, password: e.target.value})}
          style={{ width: '100%', padding: '8px 12px', boxSizing: 'border-box' }}
        />
      </label>
    </div>
    
    <Button 
      variant="contained" 
      onClick={() => handleLogin(values.email, values.password)}
      sx={{
        width: '100%',
        borderRadius: '23px',
        py: 1.5,
        backgroundColor: '#5C8CC6',
        '&:hover': { backgroundColor: '#4A76A8' },
        marginTop: '20px'
      }}
    >
      Login
    </Button>
                                    </Box>
                                  </Modal>
                                  
                          
                            {/*If you select doctor*/}
                                  <Button 
                                    variant="contained" 
                                    onClick={handleOpenDoctorLogin}
                                    sx={{
                                      width: '80%',
                                      borderRadius: '28px',
                                      py: 1.5,
                                      backgroundColor: '#5C8CC6',
                                      '&:hover': { backgroundColor: '#4A76A8' }
                                    }}
                                  > Doctor </Button>
                                  <Modal
                                    open={openDoctorLogin}
                                    onClose={handleCloseDoctorLogin}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                  >
                                    <Box sx={{
                                      ...style,
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '20px',
                                      borderRadius: '23px',
                                      padding: '30px'
                                    }}>
                                      <Typography id="modal-modal-title" variant="h6" component="h2" color="black" sx={{ textAlign: 'center' }}>
                                        Doctor Login
                                      </Typography>
                                      
                                      {/* Email Field */}
                                      <div className='labels'>
                                        <label className='input-group' htmlFor="email">
                                          Email:
                                          <input
                                            style={{ width: '100%',  padding: '8px 12px', boxSizing: 'border-box' }}
                                            type='text'
                                            name='email'
                                            className="input-field" 
                                            placeholder='Enter Email'
                                            value={values.email}
                                            onChange={e => setValues({...values, email: e.target.value})}
                                          />
                                        </label>
                                      </div>
                                      
                                      {/* Password Field */}
                                      <div className='labels'>
                                        <label className='input-group' htmlFor="password">
                                          Password:
                                          <input
                                            style={{ width: '100%',  padding: '8px 12px', boxSizing: 'border-box' }}
                                            type='password'
                                            name='password'
                                            className="input-field" 
                                            placeholder='Enter Password'
                                            value={values.password}
                                            onChange={e => setValues({...values, password: e.target.value})}
                                          />
                                          {/* <Button
                                            onClick={() => setShowPassword(!showPassword)}
                                            size="small"
                                            variant="text"
                                            className="icon-button"
                                          >
                                            {showPassword ? <VisibilityIcon/> : <VisibilityOffIcon />}
                                          </Button> */}
                                        </label>
                                      </div>
                                      
                                      <Button 
                                        variant="contained" 
                                        onClick={() => handleLogin2(values.email, values.password)}
                                        sx={{
                                          width: '100%',
                                          borderRadius: '23px',
                                          py: 1.5,
                                          backgroundColor: '#5C8CC6',
                                          '&:hover': { backgroundColor: '#4A76A8' },
                                          marginTop: '20px'
                                        }}
                                      >
                                        Login
                                      </Button>
                                    </Box>
                                  </Modal>
                          
                              <Typography 
                                id="modal-modal-title" 
                                variant="h6" 
                                component="h2" 
                                color="black"
                                sx={{
                                  width: '100%',
                                  textAlign: 'center',
                                  mt: 1,
                                  mb: 1
                                }}
                              >
                              Or logging into a pharmacy?
                              </Typography>
                          
                          {/*Selecting pharmacy*/} 
                          <Button 
                          variant="contained" 
                          onClick={handleOpenPharmacyLogin}
                          sx={{
                            width: '80%',
                            borderRadius: '28px',
                            py: 1.5,
                            backgroundColor: '#5C8CC6',
                            '&:hover': { backgroundColor: '#4A76A8' }
                          }}>
                              Pharmacy 
                          </Button>
                          <Modal
                            open={openPharmacyLogin}
                            onClose={handleClosePharmacyLogin}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box sx={{
                              ...style,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '20px',
                              borderRadius: '23px',
                              padding: '30px'
                            }}>
                              <Typography id="modal-modal-title" variant="h6" component="h2" color="black" sx={{ textAlign: 'center' }}>
                                Pharmacy Login
                              </Typography>
                              
                              {/* Email Field */}
                              <div className='labels'>
                                <label className='input-group' htmlFor="email">
                                  Email:
                                  <input
                                    type='text'
                                    name='email'
                                    className="input-field" 
                                    placeholder='Enter Email'
                                    value={values.email}
                                    onChange={e => setValues({...values, email: e.target.value})}
                                    style={{ width: '100%', padding: '8px 12px', boxSizing: 'border-box' }}
                                  />
                                </label>
                              </div>
                              
                              {/* Password Field */}
                              <div className='labels'>
                                <label className='input-group' htmlFor="password">
                                  Password:
                                  <input
                                    type='password'
                                    name='password'
                                    className="input-field" 
                                    placeholder='Enter Password'
                                    value={values.password}
                                    onChange={e => setValues({...values, password: e.target.value})}
                                    style={{ width: '100%', padding: '8px 12px', boxSizing: 'border-box' }}
                                  />
                                </label>
                              </div>
                              
                              <Button 
                                variant="contained" 
                                onClick={() => handleLogin3(values.email, values.password)}
                                sx={{
                                  width: '100%',
                                  borderRadius: '23px',
                                  py: 1.5,
                                  backgroundColor: '#5C8CC6',
                                  '&:hover': { backgroundColor: '#4A76A8' },
                                  marginTop: '20px'
                                }}
                              >
                                Login
                              </Button>
                            </Box>
                          </Modal>
                          </Box>
                    </Typography>
                  </Box>
                </Modal>

                {/*Sign Up Buttons*/}
                <Button className="herobutton" onClick={handleOpen}>Sign Up</Button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                      <Box sx={{
                        ...style,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}>
                      <Typography id="modal-modal-title" variant="h6" component="h2" color="black">
                          Are you a patient or a doctor?
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 2,
                            alignItems: 'center',
                            width: '100%'
                          }}>                 
                                     
                          <Button 
                              variant="contained" 
                              onClick={() => navigate('/patientsignup')}
                                   sx={{
                                      width: '80%',
                                      borderRadius: '28px',
                                      py: 1.5,
                                      backgroundColor: '#5C8CC6',
                                      '&:hover': { backgroundColor: '#4A76A8' }
                                    }}     
                            >
                              Patient
                            </Button>
                            <Button 
                              variant="contained" 
                              onClick={() => navigate('/doctorsignup')}
                                   sx={{
                                      width: '80%',
                                      borderRadius: '28px',
                                      py: 1.5,
                                      backgroundColor: '#5C8CC6',
                                      '&:hover': { backgroundColor: '#4A76A8' }
                                    }}     
                            >
                              Doctor
                            </Button>
                              <Typography 
                                id="modal-modal-title" 
                                variant="h6" 
                                component="h2" 
                                color="black"
                                sx={{
                                  width: '100%',
                                  textAlign: 'center',
                                  mt: 1,
                                  mb: 1
                                }}
                              >
                                Or signing up as a pharmacy?                              
                              </Typography>
                            <Button 
                              variant="contained" 
                              onClick={() => navigate('/pharmacysignup')}
                                   sx={{
                                      width: '80%',
                                      borderRadius: '28px',
                                      py: 1.5,
                                      backgroundColor: '#5C8CC6',
                                      '&:hover': { backgroundColor: '#4A76A8' }
                                    }}     
                            >
                              Pharmacy
                            </Button>
                          </Box>
                        </Typography>
                      </Box>
                </Modal>
            </div>
        </div>
        <div className="heroimage">
            <img src={heroImage} alt="doctor point" className="doctorherod"/>
        </div>
      </div>
      
      <div className="aboutdiv">
        <div className="content">
        <h4>About Us</h4>
        <hr></hr>
        <p className="abouttext">We are a specialized team of individuals trying to make sure you live a healthy life! No more struggling with weight issues, If you want the secret to a long lasting life you wont be regretting this!</p>
        </div>
      </div>

<div className="patienttest">
      <h4 id="ourStories" className="white">Patient Testimonials</h4>
      <div className="testcards">
        {stories.map((story, index) => (
          <div className="patientcard" key={index}>
            <img src={story.image} alt="patient" className="patientimage" />
            <Typography sx={{ color: 'white', fontSize: '3vh' }}>{story.title}</Typography>
            <p className="patienttext">{story.short}</p>
            <Button
              sx={{ borderColor: 'white', color: 'white', marginTop: '1.5vh' }}
              variant="outlined"
              onClick={() => handleOpenReadMore(story)}
            >
              Read More
            </Button>
          </div>
        ))}
      </div>

<Modal open={openReadMore} onClose={handleCloseReadMore} aria-labelledby="doctor-modal-title">
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: { xs: 350, sm: 450 },
      bgcolor: '#FFFFFF',
      borderRadius: 3,
      boxShadow: 24,
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      borderTop: '6px solid  #5C8CC6', // A subtle purple accent line
    }}
  >
      <Typography  variant="h5"
          fontWeight="bold"
          color="black">
            {selectedStory?.title}
          </Typography>
          <Typography variant="body1">
            {selectedStory?.full}
          </Typography>
        <Button
          variant="contained"
          onClick={handleCloseReadMore}
          sx={{
            alignSelf: 'flex-end',
            mt: 2,
            backgroundColor:'#5C8CC6',
  
          }}
        >
          Close
        </Button>
      
    
  </Box>
</Modal>

    </div>
      </div>


      
      <div className="doctortest">
      <h4 id="ourDoctors">Meet Our Top Rated Doctors</h4>
      <div className="testcards">
        {doctors.map((doc, index) => (
          <div className="patientcard" key={index}>
            <img
              src={doctor1} // Or: `data:image/jpeg;base64,${doc.doctor_picture}`
              alt={`${doc.first_name} ${doc.last_name}`}
              className="patientimage"
            />
            <p className="patienttext" id="black">
              Dr. {doc.first_name} {doc.last_name}<br />
              {doc.specialty}<br />
              Rating: {doc.doctor_rating}/5
            </p>
            <Button sx={{marginTop:'1.5vh'}} variant="outlined" onClick={() => handleOpenAbout(doc)}>Learn More</Button>
          </div>
        ))}
      </div>

      {/* MUI Modal */}
<Modal open={openAbout} onClose={handleCloseAbout} aria-labelledby="doctor-modal-title">
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: { xs: 350, sm: 450 },
      bgcolor: '#FFFFFF',
      borderRadius: 3,
      boxShadow: 24,
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      borderTop: '6px solid  #5C8CC6', // A subtle purple accent line
    }}
  >
    {selectedDoctor && (
      <>
        {/* Optional: Doctor Image */}
        {/* <img src={`data:image/jpeg;base64,${selectedDoctor.doctor_picture}`} alt="Doctor" style={{ width: '100%', borderRadius: 8, marginBottom: 16 }} /> */}

        <Typography
          id="doctor-modal-title"
          variant="h5"
          fontWeight="bold"
          color="black"
        >
          Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}
        </Typography>

        <Typography variant="subtitle1" color="#5C8CC6">
          {selectedDoctor.specialty}
        </Typography>

        <Typography variant="body1" color="text.primary">
          <strong>Description:</strong> {selectedDoctor.description}
        </Typography>

        <Typography variant="body1" color="text.primary">
          <strong>Years of Practice:</strong> {selectedDoctor.years_of_practice}
        </Typography>

        <Typography variant="body1" color="text.primary">
          <strong>Medical School:</strong> {selectedDoctor.med_school}
        </Typography>

        <Typography variant="body1" color="text.primary">
          <strong>Accepting New Patients:</strong> {selectedDoctor.accepting_patients ? "Yes" : "No"}
        </Typography>

        <Button
          variant="contained"
          onClick={handleCloseAbout}
          sx={{
            alignSelf: 'flex-end',
            mt: 2,
            backgroundColor:'#5C8CC6',
  
          }}
        >
          Close
        </Button>
      </>
    )}
  </Box>
</Modal>


    </div>
    
    (
    <Box sx={{ bgcolor: '#f5f5f5', mt: 6, pt: 4, pb: 3, fontFamily: 'Roboto, sans-serif' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 4,
            mb: 4,
          }}
        >
          {/* Branding */}
          <Box display={'flex'} flexDirection={'column'}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              DPP Wellness
            </Typography>
            <Link href="#ourStories"  underline="hover" color="text.primary" sx={{ fontSize: '1.7vh', pt:'.5vh' , pb:'.5vh'}}>
              Our Stories
            </Link>
            <Link href="#ourDoctors" underline="hover" color="text.primary" sx={{ fontSize: '1.7vh', pt:'.5vh', pb:'.5vh' }}>
              Our Doctors
            </Link>
            <Link href="#signUp" underline="hover" color="text.primary" sx={{ fontSize: '1.7vh', pt:'.5vh', pb:'.5vh' }}>
              Sign Up Today!
            </Link>
          </Box>

          {/* Contact Information */}
          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
              Contact Us
            </Typography>

            {/* Phone */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.primary">Phone:</Typography>
              <Typography variant="body2" sx={{ ml: 1, color: 'primary.main' }}>
                +1 (555) 123-4567
              </Typography>
              <Tooltip title="Copy">
                <IconButton size="small" onClick={() => copyToClipboard("+1 (555) 123-4567")}>
                  <ContentCopyIcon color='primary' fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Email */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.primary">Email:</Typography>
              <Typography variant="body2" sx={{ ml: 1, color: 'primary.main' }}>
                contact@dpp.com
              </Typography>
              <Tooltip title="Copy">
                <IconButton size="small" onClick={() => copyToClipboard("contact@dpp.com")}>
                  <ContentCopyIcon color='primary' fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Address */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.primary">Address:</Typography>
              <Typography variant="body2" sx={{ ml: 1, color: 'primary.main' }}>
                123 Health St, Wellness City
              </Typography>
              <Tooltip title="Copy">
                <IconButton size="small" onClick={() => copyToClipboard("123 Health St, Wellness City")}>
                  <ContentCopyIcon color='primary' fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Social Links */}
          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
              Follow Us
            </Typography>
            <IconButton href="https://facebook.com" target="_blank" aria-label="Facebook" size="small">
              <FacebookIcon />
            </IconButton>
            <IconButton href="https://twitter.com" target="_blank" aria-label="Twitter" size="small">
              <TwitterIcon />
            </IconButton>
            <IconButton href="https://linkedin.com" target="_blank" aria-label="LinkedIn" size="small">
              <LinkedInIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} DPP Wellness. All rights reserved.
        </Typography>
      </Container>
    </Box>

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
  );
}

export default Landing;
