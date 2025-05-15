import React, { useState, useEffect, useRef } from "react";
import Doctor_Navbar from "./doctor_navbar";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import FlowerBackgroundImg from "./doctor_landing_assets/FlowerBackground.png"
import mealImg from "./doctor_landing_assets/meals.png"
import sadDoctorImg from "./doctor_landing_assets/saddoc.png"
import tempWeightImg from "./doctor_landing_assets/tempWeightImg.png"
import overviewSurveyImg from "./doctor_landing_assets/overviewSurveyImg.png"
import noSurveysImg from "./doctor_landing_assets/NoSurveys.png"
import { Select, MenuItem, InputLabel, Button, Typography, Modal, TextField, FormControl } from "@mui/material";
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import doc1 from "./doctorim/doctor1.png";
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Card, CardContent } from '@mui/material';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Plot from 'react-plotly.js';
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import doctor_shrug from "./doctor_shrug.png"
import doctor_happy from "./doctor_happy.png"
import patient_help from "./patient_help.png"
import { useTheme, useMediaQuery, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const apiUrl = process.env.REACT_APP_API_URL;


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: 30,
  height: '47vh',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  //padding: theme.spacing(2),
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));



const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#FEFEFD',
  },
  '& .MuiRating-iconHover': {
    color: '#FEFEFD',
  },
});



function Doctor_Landing() {

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackType, setSnackType] = useState("error");

  const showSnack = (msg, type = "error") => {
    setSnackMsg(msg);
    setSnackType(type);
    setSnackOpen(true);
  };
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

  const [doctorInfo, setDoctorInfo] = useState(null);



  useEffect(() => {
    const fetchDoctorInfo = async () => {
      const id = localStorage.getItem("doctorId");
      if (!id) {
        console.warn("No doctor ID in localStorage");
        return;
      }

      try {
        const res = await fetch(`${apiUrl}/doctor/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch doctor info");
        }

        const data = await res.json();
        setDoctorInfo(data);
        console.log("doctor info:", data);
      } catch (error) {
        console.error("Error fetching doctor info:", error);
      }
    };

    fetchDoctorInfo();
  }, []);

  useEffect(() => {
    if (doctorInfo && doctorInfo.accepting_patients !== undefined) {
      setToggleStatus(doctorInfo.accepting_patients == 1);
    }
  }, [doctorInfo]);

    const [userInfo, setUserInfo] = useState(null);
  
      useEffect(() => {
      const fetchUserInfo = async () => {
        const id = localStorage.getItem("doctorId");
        if (!id) {
          console.warn("No patient ID in localStorage");
          return;
        }
        try {
          const res = await fetch(`${apiUrl}/user?doctor_id=${id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch user info");
          }
          const data = await res.json();
          setUserInfo(data);
          console.log("User ID", data);
          localStorage.setItem("userId", data.user_id);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      };
      fetchUserInfo();
    }, []);




  const [value, setValue] = React.useState(2);

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const upcomingRes = await fetch(`${apiUrl}/doc-upcoming/${doctorId}`);
        const pastRes = await fetch(`${apiUrl}/doc-past/${doctorId}`);

        if (!upcomingRes.ok || !pastRes.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const upcomingData = await upcomingRes.json();
        const pastData = await pastRes.json();
        console.log("upcoming data", upcomingData);
        console.log("Past data", pastData);
        setUpcomingAppointments(upcomingData);
        setPastAppointments(pastData);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  //console.log("doctor ID:", doctorId);

  //surveys modal
  const navigate = useNavigate();
  const [openSurvey, setOpenSurvey] = useState(false);

  const openSurveysModal = () => {
    setOpenSurvey(true);
  };
  const closeSurveysModal = () => {
    setOpenSurvey(false);
  };

  //weekly survey modal
  const [openWeeklySurvey, setOpenWeeklySurvey] = useState(false);

  const openWeeklySurveysModal = () => {
    setOpenWeeklySurvey(true);
  };
  const closeWeeklySurveysModal = () => {
    setOpenWeeklySurvey(false);
  };

  //Daily survey modal
  const [openDailySurvey, setOpenDailySurvey] = useState(false);

  const openDailySurveysModal = () => {
    setOpenDailySurvey(true);
  };
  const closeDailySurveysModal = () => {
    setOpenDailySurvey(false);
  };


  const [hasSurveyData, setHasSurveyData] = useState(false);
  const [toggleStatus, setToggleStatus] = useState(null); // start as null so you know it's not loaded yet


  // Load survey status on mount
  useEffect(() => {
    const surveyFlag = localStorage.getItem('hasSurveyData');
    if (surveyFlag === 'true') {
      setHasSurveyData(true);
    } else {
      setHasSurveyData(false);
    }
  }, []);

  // Daily survey form states
  const [heartRate, setHeartRate] = useState("");
  const [waterIntake, setWaterIntake] = useState("");
  const [exerciseMinutes, setExerciseMinutes] = useState("");
  const [mealPlanFollowed, setMealPlanFollowed] = useState("");
  const [mood, setMood] = useState("");
  const [calorieIntake, setCalorieIntake] = useState("");

  const handleDailySubmit = async (e) => {
    e.preventDefault();
    const dailyData = {

      doctor_id: doctorId,
      date: new Date().toISOString().split('T')[0], // 'YYYY-MM-DD'
      water_intake: waterIntake,
      calories_consumed: calorieIntake,
      heart_rate: heartRate,
      exercise: exerciseMinutes,
      mood: mood,
      follow_plan: mealPlanFollowed ? 1 : 0, // convert to 0 or 1
    };
    //replace fetch with correct url

    try {
      const response = await fetch(`${apiUrl}/daily-survey`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dailyData),
      });

      if (response.ok) {
        localStorage.setItem('hasSurveyData', 'true');
        setHasSurveyData(true);
        console.log('Daily survey submitted successfully');
        setHeartRate("");
        setWaterIntake("");
        setExerciseMinutes("");
        setMealPlanFollowed("");
        setMood("");
        setCalorieIntake("");

        closeDailySurveysModal(); // Close modal on success
      } else {
        console.error('Failed to submit daily survey');
      }
    } catch (error) {
      console.error('Error submitting daily survey:', error);
    }
  };




  //weekly survey form information
  const [weightChange, setWeightChange] = React.useState("");
  const [weightAmount, setWeightAmount] = React.useState("");
  const [bloodPressure, setBloodPressure] = React.useState("");

  const handleWeeklySubmit = async (e) => {
    e.preventDefault();

    const weeklyData = {
      doctor_id: doctorId,
      weight_change: weightChange,
      weight_amount: weightAmount,
      blood_pressure: bloodPressure
    };
    //replace fetch with correct url
    try {
      const response = await fetch(`${apiUrl}/weekly-surveys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(weeklyData),
      });

      if (response.ok) {
        console.log('Weekly survey submitted successfully');
        closeWeeklySurveysModal(); // Close modal on success
      } else {
        console.error('Failed to submit weekly survey');
      }
    } catch (error) {
      console.error('Error submitting weekly survey:', error);
    }
  };


  //Learn More Modal
  const [openLearnMore, setOpenLearnMore] = useState(false);

  const openLearnMoreModal = () => {
    setOpenLearnMore(true);
  };
  const closeLearnMoreModal = () => {
    setOpenLearnMore(false);
  };

  const [openDeleteCurrentDoctor, setOpenDeleteCurrentDoctor] = useState(false);
  const openDeleteCurrentDoctorModal = () => {
    setOpenDeleteCurrentDoctor(true);
  };
  const closeDeleteCurrentDoctorModal = () => {
    setOpenDeleteCurrentDoctor(false);
  }


  const handleDeleteCurrentDoctor = async () => {
    try {
      const response = await fetch(`${apiUrl}/remove_doctor/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Something went wrong while deleting');
      }

      console.log('Doctor deleted successfully');
      setDoctorInfo(null);
      closeDeleteCurrentDoctorModal();  // close the modal
      // Optionally refresh data or navigate
    } catch (error) {
      console.error('Error deleting doctor:', error);
      closeDeleteCurrentDoctorModal();
    }
  };


  const [showUpcoming, setShowUpcoming] = useState(true);


  //Booking an appointment
  const [openBookAppt, setOpenBookAppt] = useState(false);

  const handleOpenBookAppt = () => {
    // Clear form state
    setApptReason('');
    setMedications('');
    setExercise('');
    setSelectedDate(new Date());
    setSelectedTime('09:00');

    setOpenBookAppt(true);
  };

  const handleCloseBookAppt = () => {
    setOpenBookAppt(false);
    setApptReason('');
    setMedications('');
    setExercise('');
    setSelectedDate(new Date());
    setSelectedTime('09:00');
  };

  const formatAppointmentDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "short",     // Thu
      year: "numeric",      // 2025
      month: "short",       // May
      day: "2-digit",       // 01
      hour: "2-digit",      // 09
      minute: "2-digit",    // 00
      hour12: true,         // AM/PM
      timeZoneName: "short" // GMT
    });
  };


  // Form fields
  const [apptReason, setApptReason] = useState('');
  const [medications, setMedications] = useState('');
  const [exercise, setExercise] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');


  const [pharmacyInfo, setPharmacyInfo] = useState("");


  useEffect(() => {
    // Commented out to avoid crash from 404
    /*
    fetch(`${apiUrl}/api/get-pharmacy`)
      .then(res => res.json())
      .then(data => {
        setPharmacyInfo(`${data.name}, ${data.address}, ${data.zip}, ${data.city}`);
      })
      .catch(err => {
        console.error("Failed to fetch pharmacy info", err);
      });
    */
  }, []);


  const handleCreateAppointment = async () => {
    // 🔁 Put this helper function anywhere above `handleCreateAppointment` (top of component is fine)
    const formatDateTimeForMySQL = (date) => {
      const pad = (n) => n.toString().padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
    };

    // 👇 Inside handleCreateAppointment
    const appointment_datetime = formatDateTimeForMySQL(
      new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}`)
    );

    const newAppointment = {
      doctor_id: doctorId,
      patient_id: patientInfo?.patient_id,  // make sure doctorInfo is loaded
      appointment_datetime,
      reason_for_visit: apptReason,
      current_medications: medications,
      exercise_frequency: exercise,
      doctor_appointment_note: "",
      accepted: 0,
      meal_prescribed: null
    };



    try {
      const response = await fetch(`${apiUrl}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment),
      });


      if (response.ok) {
        console.log("Appointment created!");

        // Refresh the appointments from backend
        const updated = await fetch(`${apiUrl}/appointmentsupcoming/${doctorId}`);
        const updatedData = await updated.json();
        setUpcomingAppointments(updatedData);

        handleCloseBookAppt();
      } else {
        console.error("Failed to create appointment.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };


  const [patientInfo, setPatientInfo] = useState(null);

  // Replace with actual doctor ID logic


  const [patientList, setPatientList] = useState([]);

  useEffect(() => {
    const fetchAllPatients = async () => {
      if (!doctorId) return;

      try {
        const res = await fetch(`${apiUrl}/doc_patients/${doctorId}`);
        if (!res.ok) throw new Error("Failed to fetch patients");

        const data = await res.json();
        setPatientList(data); // array of patient objects
        console.log("All patients:", data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchAllPatients();
  }, [doctorId]);




  //medical chart carousel
  const images = [
    tempWeightImg,
    mealImg,
    tempWeightImg,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  //Status Change API

  // const toggleDoctorStatus = async (doctorId, newStatus) => {
  //   try {
  //     const response = await fetch('http://127.0.0.1:5000/update-doctor-status', {
  //       method: 'PATCH',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ doctor_id: doctorId, status: newStatus }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       alert("Doctor status updated successfully");
  //     } else {
  //       alert(data.error || "Failed to update status");
  //     }
  //   } catch (error) {
  //     console.error("Status update error:", error);
  //     alert("An error occurred. Please try again.");
  //   }
  // };

  const toggleDoctorStatus = async (doctorId, newStatus) => {
    try {
      const response = await fetch(`${apiUrl}/doctor-accepting-status/${doctorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accepting_patients: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setToggleStatus(newStatus === 1); // update local state
        console.log("Doctor status updated");
      } else {
        showSnack(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      showSnack("An error occurred. Please try again.");
    }
  };

  const [requestedAppointments, setRequestedAppointments] = useState([]);
  useEffect(() => {
    const fetchRequestedAppointments = async () => {
      try {
        const response = await fetch(`${apiUrl}/requested-appointments/${doctorId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();
        setRequestedAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    if (doctorId) {
      fetchRequestedAppointments();
    }
  }, [doctorId]);



  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`${apiUrl}/doc-appointments-status/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accepted: newStatus }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }
  
      setRequestedAppointments((prev) =>
        prev.filter((appt) => appt.patient_appt_id !== appointmentId)
      );
      if (newStatus === 1) {
        const updatedRes = await fetch(`${apiUrl}/doc-upcoming/${doctorId}`);
        if (!updatedRes.ok) throw new Error("Failed to fetch updated upcoming appointments");
        const updatedUpcoming = await updatedRes.json();
        setUpcomingAppointments(updatedUpcoming);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:920px)');

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);  
  };











  return (

    <div style={{ display: "flex" }}>
      {/* Sidebar/Navbar */}

      <>
      {isMobile ? (
        <>
          <IconButton onClick={toggleDrawer} sx={{ position: 'fixed', bottom: 10, left: 10, zIndex: 3}}>
            <MenuIcon sx={{ color: 'white', backgroundColor: '#5b48a5', borderRadius: '100px', padding: '1px', fontSize: 32 }} />
          </IconButton>
          <Drawer anchor="left" open={open} onClose={toggleDrawer}>
            <Doctor_Navbar />
          </Drawer>
        </>
      ) : (
        <Doctor_Navbar />
      )}
    </>

      <div style={{ marginLeft: "3px", flexGrow: 1, padding: "20px" }}>
        <Box sx={{ flexGrow: 1 }}>

          <Grid container spacing={2} >
            {/* item 1 */}
            <Grid item md={7} xs={12}>
              <Item sx={{ color: 'white', background: 'linear-gradient(110deg, #5889BD 6.67%, #719EC7 34.84%, #99C6DB 93.33%)', borderRadius: 5, p: 2 }}>
                <Typography sx={{ fontFamily: 'Montserrat', fontSize: '3.5vh', textAlign: "left", mb: '1.1vh' }} >Your Information</Typography>
                <Paper
                  //elevation={3}
                  sx={{
                    //borderRadius: 5,
                    m: 0,
                    color: 'white',
                    background: 'transparent',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: 0,
                  }}
                >
                  {/* Left Section: Text, Image, Button */}
                  <Box sx={{ height: '36vh', width: '35%', borderRadius: 3, background: 'rgba(238, 242, 254, 0.10)', p: 2, }}>
                    <Paper
                      sx={{
                        color: 'white',
                        background: 'transparent',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: 0,
                        textAlign: "left",
                      }}
                    >

                      <Typography variant="h5" fontSize={'2.2vh'} fontFamily={'Montserrat'} paddingBottom={4} >
                        Change your personal information
                      </Typography>
                      <Box
                        component="img"
                        src={overviewSurveyImg}
                        alt="Survey"
                        sx={{
                          width: 90,
                          height: 90,
                          borderRadius: '50%',
                          mb: '1vh',
                          mr: '2vh',
                        }}
                      />
                    </Paper>
                    <Typography variant="body1" sx={{ width: '24vh', mb: '2vh', textAlign: 'left', fontFamily: 'Merriweather', fontSize: '1.4vh' }}>
                      If you have anything you want to update for your clients,
                      click this button and you can fix a few details.
                    </Typography>
                    <Button
                      onClick={() => navigate('/doctor_dashboard/doctor_info')} variant="contained"
                      sx={{
                        background: 'rgba(238, 242, 254, 0.10)',
                        color: 'white',
                        borderRadius: '2vh',
                        fontFamily: 'Montserrat',
                        textTransform: 'none',
                        boxShadow: 0,
                      }}
                    >
                      Edit Info <ArrowCircleRightOutlinedIcon sx={{ ml: '1vh' }} />
                    </Button>

                    {/* Survey options*/}


                  </Box>


                  {/* DailySurvey*/}


                  {/* Right Section: Chart + Arrows */}
                  <Box sx={{
                    width: '43%',
                    //backgroundColor: 'white',
                    marginRight: ' 9vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%',
                        gap: 2, // <-- fixes spacing nicely
                        textAlign: 'center'
                      }}
                    >
                      <Typography sx={{ fontFamily: 'Montserrat', fontSize: '2.4vh' }}>
                        {toggleStatus
                          ? "Looks like you're accepting patients now!"
                          : "Looks like you're not accepting patients at this time!"
                        }
                      </Typography>

                      <Box
                        component="img"
                        src={toggleStatus ? doctor_happy : noSurveysImg}
                        alt="Status Image"
                        sx={{
                          width: 'auto',
                          maxHeight: '15vh',
                          objectFit: 'contain',
                        }}
                      />

                      <Button
                        onClick={() => toggleDoctorStatus(doctorId, toggleStatus ? 0 : 1)}  // ✅ updates backend
                        variant="contained"
                        sx={{
                          background: 'rgba(238, 242, 254, 0.10)',
                          color: 'white',
                          borderRadius: '2vh',
                          fontFamily: 'Montserrat',
                          textTransform: 'none',
                          boxShadow: 0,
                          mt: '1vh'
                        }}
                      >
                        Change Status <ArrowCircleRightOutlinedIcon sx={{ ml: '1vh' }} />
                      </Button>
                    </Box>


                  </Box>

                </Paper>

              </Item>

            </Grid>
            {/* item 2 */}

            <Grid item md={5} xs={12}>
              <Item sx={{ backgroundColor: "#EEF2FE" }}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: "Montserrat", color: "#22252C", fontSize: '3.5vh', textAlign: 'left', paddingLeft: '1.5vw' }}>
                    {showUpcoming ? "Upcoming Appointments" : "Past Appointments"}
                  </Typography>
                  <Box className="custom-scroll" sx={{ height: '30vh', width: '90%', margin: 'auto', overflowY: "auto" }}>

                    {(showUpcoming ? upcomingAppointments : pastAppointments).map((appointment, index) => (
                      <Box
                        key={index}
                        sx={{
                          backgroundColor: "#d9e6f6",
                          width: "90%",
                          margin: "auto",
                          borderRadius: "30px",
                          height: "fit-content",
                          paddingTop: "1.2vh",
                          paddingBottom: "1vh",
                          marginBottom: "2vh",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="medium"
                          sx={{
                            fontFamily: "Montserrat",
                            color: "#22252C",
                            fontSize: "1.8vh",
                            textAlign: "left",
                            paddingLeft: "1vw",
                          }}
                        >
                          {formatAppointmentDate(appointment.appointment_datetime)}

                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "Merrriweather",
                            fontWeight: "bold",
                            color: "#22252C",
                            fontSize: "1.7vh",
                            textAlign: "left",
                            paddingLeft: "1vw",
                          }}
                        >
                          {appointment.patient_first_name} {appointment.patient_last_name}
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={() => navigate('/doctor_dashboard/doctor_appointment', {
                            state: { appointmentId: appointment.patient_appt_id }
                          })}
                          sx={{
                            backgroundColor: "#5A8BBE",
                            color: "#22252C",
                            textTransform: "none",
                            "&:hover": { backgroundColor: "#5A8BCF" },
                            width: "70%",
                            borderRadius: "30px",
                            fontFamily: "Merrriweather",
                            fontSize: "2vh",
                            fontWeight: "700px",
                            marginTop: "2%",
                            marginBottom: "1%",
                          }}
                        >
                          Go to Appointment
                        </Button>
                      </Box>
                    ))}

                  </Box>

                  <Box display="flex" justifyContent="center" mt={3} alignItems="center" sx={{ marginBottom: '1px', paddingBottom: '1px' }}>
                    {/* Left Arrow */}
                    <IconButton onClick={() => setShowUpcoming(!showUpcoming)} sx={{ backgroundColor: 'none', borderRadius: '50%', mx: 0.5 }}>
                      <ArrowBackIcon sx={{ color: '#5A8BBE' }} />
                    </IconButton>

                    {/* Dots */}
                    <Box display="flex" alignItems="center">
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: showUpcoming ? '#5A8BBE' : '#B5CBE5', mx: 0.5 }} />
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: showUpcoming ? '#B5CBE5' : '#5A8BBE', mx: 0.5 }} />
                    </Box>

                    {/* Right Arrow */}
                    <IconButton onClick={() => setShowUpcoming(!showUpcoming)} sx={{ backgroundColor: 'none', borderRadius: '50%', mx: 0.5 }}>
                      <ArrowForwardIcon sx={{ color: '#5A8BBE' }} />
                    </IconButton>
                  </Box>

                </Box>

              </Item>
            </Grid>

            {/* item 3 */}
            <Grid item md={4} xs={12}>
              <Item sx={{ background: "linear-gradient(110deg, #5889BD 6.67%, #719EC7 34.84%, #99C6DB 93.33%)" }}>
                <Box sx={{paddingTop: 2}}>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: "Montserrat", color: "#FEFEFD", fontSize: '3.5vh', textAlign: 'left', paddingLeft: '1.5vw' }}>
                    Meal Plans
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: "Montserrat", color: "#FEFEFD", fontSize: '2vh', textAlign: 'left', paddingLeft: '1.5vw', fontWeight: 'normal' }}>
                    Come up with a meal plan for your patients
                  </Typography>
                  <Box
                    component="img"
                    src={mealImg}
                    alt="Meal"
                    sx={{
                      maxHeight: '20vh',
                      width: '80%',
                      borderRadius: "30px",
                      objectFit: "cover",
                      mr: 2,
                    }}
                  />
                </Box>

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#5A8BBE",
                    color: "#FEFEFE",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#5A8BCF" },
                    width: "70%",
                    borderRadius: "30px",
                    fontFamily: "Montserrat",
                    fontWeight: "700px",
                    marginTop: "2%",
                    marginBottom: "1%",
                  }}
                  onClick={() => navigate('/doctor_dashboard/doctor_mealplan')}
                >
                  Go to Meal Plans
                </Button>
              </Item>
            </Grid>

            {/* item 4 */}
            <Grid item md={4} xs={12}>
              <Item sx={{
                position: "relative",
                overflow: "hidden",
                backgroundImage: `url(${FlowerBackgroundImg})`,
                backgroundColor: "lightgray",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: '100%',
                maxHeight: "47vh",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  zIndex: 1,
                }
              }}>
                <Box sx={{ position: "relative", zIndex: 2, height: '100%' }}>
                  <Box
                    sx={{
                      position: "relative", zIndex: 2, color: "white", textAlign: "left", p: 2
                    }}>
                    <Typography variant="h6" fontWeight="medium" sx={{ mb: 1, fontFamily: 'Montserrat', fontSize: '3.5vh' }}>
                      Patients
                    </Typography>
                    <Box>

                      {doctorInfo ? (
                        <>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Box
                              component="img"
                              src={patient_help}
                              alt="Doctor"
                              sx={{
                                maxHeight: '20vh',
                                width: '20vw',
                                borderRadius: "30px",
                                objectFit: "cover",
                                mr: 2,
                                fontFamily: 'Montserrat',
                                margin: 'auto'
                              }}
                            />
                          </Box>
                          {/* Learn More Model*/}



                          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>



                            <Button variant="contained" onClick={() => navigate('/doctor_dashboard/doctor_patientlist')} sx={{ color: "white", backgroundColor: "#719EC7", borderRadius: 5, textTransform: "none", fontFamily: 'Montserrat', width: '75%', margin: 'auto' }}>
                              View Patients
                            </Button>


                          </Box>
                        </>
                      ) : (<>
                        <Box>
                          <Typography sx={{ fontFamily: 'Montserrat', fontSize: '1.3em', wieght: '600px' }}>
                            Looks like you don’t have any patients yet.
                          </Typography>
                          <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            height: '100%',
                            width: '100%',
                          }}>
                            <Box
                              component="img"
                              src={sadDoctorImg} // Replace with your actual image path or import
                              alt="Sad doctor"
                              sx={{
                                maxHeight: '22vh',
                                mr: 2,
                                margin: 'auto'
                              }}
                            />
                            <Box>

                              <Button
                                onClick={() => navigate('/doctor_dashboard/doctor_doctorlist')}
                                variant="contained"
                                sx={{
                                  color: "white",
                                  borderRadius: 5,
                                  textTransform: "none",
                                  backgroundColor: "#5A8BBE",
                                  fontFamily: 'Montserrat',
                                  marginTop: '7px',
                                  fontSize: '1.3em',
                                  width: '15vw'
                                }}
                              >
                                No Patients
                              </Button>
                            </Box>
                          </Box>
                        </Box>

                      </>)}
                    </Box>
                  </Box>
                </Box>

              </Item>
            </Grid>



            {/* item 5 */}
            <Grid item md={4} xs={12}>
              <Item sx={{ background: "linear-gradient(110deg, #5889BD 6.67%, #719EC7 34.84%, #99C6DB 93.33%)", backgroundSize: "cover", fontFamily: 'Montserrat' }}>
                <Box sx={{ position: "relative", zIndex: 2, color: "white", textAlign: "left", p: 2 }}>
                  <Typography variant="h6" fontWeight="medium" sx={{ mb: 1, fontFamily: 'Montserrat', fontSize: '3.5vh' }}>
                    Requested Appointments
                  </Typography>
                  <Box className="custom-scroll" sx={{ height: '35vh', width: '90%', margin: 'auto', overflowY: "auto", borderRadius: '30px', paddingTop: '1em', paddingBottom: '1em'}}>
                    {requestedAppointments.map((appointment, index) => (
                      <Box
                        key={index}
                        sx={{
                          backgroundColor: "#d9e6f6",
                          width: "90%",
                          margin: "auto",
                          borderRadius: "30px",
                          height: "fit-content",
                          paddingTop: "1.2vh",
                          paddingBottom: "1vh",
                          marginBottom: "2vh",
                        }}
                      >
                        {/* Appointment Date */}
                        <Typography
                          variant="subtitle1"
                          fontWeight="medium"
                          sx={{
                            fontFamily: "Montserrat",
                            color: "#22252C",
                            fontSize: "1.8vh",
                            textAlign: "left",
                            paddingLeft: "1vw",
                          }}
                        >
                          {formatAppointmentDate(appointment.appointment_datetime)}
                        </Typography>

                        {/* Patient Name */}
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "Merriweather",
                            fontWeight: "bold",
                            color: "#22252C",
                            fontSize: "1.7vh",
                            textAlign: "left",
                            paddingLeft: "1vw",
                          }}
                        >
                          {appointment.patient_first_name} {appointment.patient_last_name}
                        </Typography>
                        <Box sx={{display: 'flex', textAlign: 'center', margin: 'auto', width: '100%', gap: '1em', alignItems: 'stretch', justifyContent: 'center'}}>
                        <Button
                          variant="contained"
                          onClick={() => handleUpdateStatus(appointment.patient_appt_id, 1)}
                          sx={{
                            backgroundColor: "#5A8BBE",
                            color: "#22252C",
                            textTransform: "none",
                            "&:hover": { backgroundColor: "#5A8BCF" },
                            width: "40%",
                            borderRadius: "30px",
                            fontFamily: "Montserrat",
                            fontWeight: 700,
                            marginTop: "2%",
                            fontSize: "2vh",
                            marginBottom: "1%",
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleUpdateStatus(appointment.patient_appt_id, 0)}
                          sx={{
                            backgroundColor: "#D15254",
                            color: "#22252C",
                            textTransform: "none",
                            "&:hover": { backgroundColor: "#5A8BCF" },
                            width: "40%",
                            borderRadius: "30px",
                            fontFamily: "Montserrat",
                            fontWeight: 700,
                            fontSize: "2vh",
                            marginTop: "2%",
                            marginBottom: "1%",
                          }}
                        >
                          Deny
                        </Button>
                        </Box>
                      </Box>
                    ))}

                  </Box>
                </Box>
              </Item>


            </Grid>


          </Grid>
        </Box>
      </div>
    </div>
  );
};

export default Doctor_Landing;
