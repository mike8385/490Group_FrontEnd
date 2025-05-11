import React, { useState, useEffect, useRef } from "react";
import Patient_Navbar from "./patient_navbar";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import FlowerBackgroundImg from "./patient_landing_assets/FlowerBackground.png"
import mealImg from "./patient_landing_assets/meals.png"
import sadDoctorImg from "./patient_landing_assets/saddoc.png"
import tempWeightImg from "./patient_landing_assets/tempWeightImg.png"
import overviewSurveyImg from "./patient_landing_assets/overviewSurveyImg.png"
import noSurveysImg from "./patient_landing_assets/NoSurveys.png"
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
import CalorieGraph from "../patient_medicalchart/patient_medicalchart/calorie_graph";
import WaterGraph from "../patient_medicalchart/patient_medicalchart/water_graph";
import WeightGraph from "../patient_medicalchart/patient_medicalchart/weight_graph";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { formatInTimeZone } from 'date-fns-tz';


import { useTheme, useMediaQuery, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'
import { useSurveyData } from '../patient_medicalchart/patient_medicalchart/Survey_context';

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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#EEF2FE',
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#FEFEFD',
  },
  '& .MuiRating-iconHover': {
    color: '#FEFEFD',
  },
});


function Patient_Landing() {

  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [refreshGraph, setRefreshGraph] = useState(false);
  const { dailyInfo, weeklyInfo } = useSurveyData();



  const openCancelModalFor = (appointmentId) => {
    setAppointmentToCancel(appointmentId);
    setOpenCancelModal(true);
  };

  const closeCancelModal = () => {
    setAppointmentToCancel(null);
    setOpenCancelModal(false);
  };
  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return;

    try {
      const response = await fetch(`${apiUrl}/cancel-appointment/${appointmentToCancel}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUpcomingAppointments(prev =>
          prev.filter(appt => appt.patient_appt_id !== appointmentToCancel)
        );
      } else {
        alert("Failed to cancel the appointment.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      closeCancelModal();
    }
  };


  const [patientInfo, setPatientInfo] = useState(null);


  useEffect(() => {
    const fetchPatientInfo = async () => {
      const id = localStorage.getItem("patientId");
      if (!id) {
        console.warn("No patient ID in localStorage");
        return;
      }

      try {
        const res = await fetch(`${apiUrl}/patient/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch patient info");
        }

        const data = await res.json();
        setPatientInfo(data);
        console.log("Patient info:", data);
      } catch (error) {
        console.error("Error fetching patient info:", error);
      }
    };

    fetchPatientInfo();
  }, []);


  const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
    const fetchUserInfo = async () => {
      const id = localStorage.getItem("patientId");
      if (!id) {
        console.warn("No patient ID in localStorage");
        return;
      }
      try {
        const res = await fetch(`${apiUrl}/user?patient_id=${id}`);
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
  const patientId = localStorage.getItem("patientId");
  const [overview, setOverview] = useState([]);
  const [selectedApptId, setSelectedApptId] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);

  const fetchPrescriptions = async (apptId) => {
    try {
      const res = await fetch(`${apiUrl}/patient/${apptId}/prescriptions`);
      if (!res.ok) {
        throw new Error("Failed to fetch prescriptions");
      }
      const prescriptionsData = await res.json();
      setPrescriptions(prescriptionsData);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  useEffect(() => {
    console.log("useEffect ran");
    const fetchAppointments = async () => {
      try {
        const upcomingRes = await fetch(`${apiUrl}/appointmentsupcoming/${patientId}`);
        const pastRes = await fetch(`${apiUrl}/appointmentspast/${patientId}`);

        if (!upcomingRes.ok || !pastRes.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const upcomingData = await upcomingRes.json();
        const pastData = await pastRes.json();

        setUpcomingAppointments(upcomingData);
        setPastAppointments(pastData);

        if (pastData && pastData.length > 0) {
          const apptId = pastData[0].patient_appt_id;
          setSelectedApptId(apptId);
          // Fetch prescriptions for this appointment
          await fetchPrescriptions(apptId);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId]);

  //check appointment acceptance status
  const [appointmentAccepted, setAppointmentAccepted] = useState(false);
  useEffect(() => {
    const fetchAppointmentStatus = async () => {
      try {
        const res = await fetch(`${apiUrl}/appointments/${patientId}`);
        const appointments = await res.json();
        const status = appointments.accepted;
        console.log("AppointmentStatus:", status);
        setAppointmentAccepted(status === 0);
      } catch (error) {
        console.error("Error fetching appointment status:", error);
      }
    };
    fetchAppointmentStatus();
  }, [patientId]);
  //console.log("Patient ID:", patientId);

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


  //const hasSurveyData = (dailyInfo && dailyInfo.length > 0) || (weeklyInfo && weeklyInfo.length > 0);
  const [hasSurveyData, setHasSurveyData] = useState(false);


  // Daily survey form states
  const [heartRate, setHeartRate] = useState("");
  const [waterIntake, setWaterIntake] = useState("");
  const [exerciseMinutes, setExerciseMinutes] = useState("");
  const [mealPlanFollowed, setMealPlanFollowed] = useState("");
  const [mood, setMood] = useState("");
  const [calorieIntake, setCalorieIntake] = useState("");
  const [error, setError] = useState("");

  const handleDailySubmit = async (e) => {
    e.preventDefault();
    if (
      !heartRate ||
      !waterIntake ||
      !exerciseMinutes ||
      !mealPlanFollowed ||
      !mood ||
      !calorieIntake
    ) {
      setError("Please fill in all fields.");
      return;
    }

    // Optional: check numeric fields

    setError("");
    const dailyData = {

      patient_id: patientId,
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

        closeDailySurveysModal();
        setDailySubmitted(true);
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
  const [weeklyError, setWeeklyError] = React.useState("");

  const handleWeeklySubmit = async (e) => {
    e.preventDefault();

    // Empty check
    if (
      !weightChange || !weightAmount || !bloodPressure
    ) {
      setError("All fields are required.");
      return;
    }
    if (!weightChange) {
      setWeeklyError("Please select a weight change type.");
      return;
    }

    if ((weightChange === "Gain" || weightChange === "Loss") && (!weightAmount || isNaN(parseFloat(weightAmount)) || parseFloat(weightAmount) <= 0)) {
      setWeeklyError("Please enter a valid weight amount greater than 0.");
      return;
    }


    setWeeklyError(""); // Clear previous errors
    let parsedWeightAmount = parseFloat(weightAmount) || 0;

    if (weightChange === "Loss") {
      parsedWeightAmount = -Math.abs(parsedWeightAmount);
    } else if (weightChange === "Gain") {
      parsedWeightAmount = Math.abs(parsedWeightAmount);
    } else {
      parsedWeightAmount = 0;
    }
    // 2. Calculate most recent Sunday (week_start)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const diffToSunday = dayOfWeek;   // How many days to subtract to get to last Sunday
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - diffToSunday);
    lastSunday.setHours(0, 0, 0, 0); // Reset time to 00:00:00
    console.log("patient", patientId)
    const weekStart = lastSunday.toISOString().split('T')[0]; // ✅ '2024-09-01'
    const weeklyData = {
      patient_id: patientId,
      week_start: weekStart,
      weight_change: parsedWeightAmount,
      blood_pressure: bloodPressure
    };
    //replace fetch with correct url
    try {
      const response = await fetch(`${apiUrl}/weekly-survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(weeklyData),
      });

      if (response.ok) {
        console.log('Weekly survey submitted successfully');
        // Clear form fields
        setWeightChange("");
        setWeightAmount("");
        setBloodPressure("");
        closeWeeklySurveysModal(); // Close modal on success
        setWeeklySubmitted(true);

      } else {
        console.error('Failed to submit weekly survey');
      }
    } catch (error) {
      console.error('Error submitting weekly survey:', error);
    }
  };

  //Disable Survey
  const [dailySubmitted, setDailySubmitted] = useState(false);
  const [weeklySubmitted, setWeeklySubmitted] = useState(false);
  useEffect(() => {
    const checkSurveyStatus = async () => {
      const today = new Date();
      const todayDateOnly = today.toISOString().split('T')[0]; // 'YYYY-MM-DD'
      const currentWeekStart = getWeekStart(today); // Get the start of this week (Sunday)

      try {
        // Daily survey check
        const dailyRes = await fetch(`${apiUrl}/daily-surveys/${patientId}`);
        const dailyData = await dailyRes.json();

        const hasDailyToday = dailyData.some(survey => {
          const surveyDate = new Date(survey.date);
          const surveyDateOnly = surveyDate.toISOString().split('T')[0];
          return surveyDateOnly === todayDateOnly;
        });
        console.log("Today (local):", new Date().toLocaleDateString());
        dailyData.forEach(survey => {
          console.log("Survey date:", new Date(survey.date).toLocaleDateString());
        });
        setDailySubmitted(hasDailyToday);

        // Weekly survey check
        const weeklyRes = await fetch(`${apiUrl}/weekly-surveys/${patientId}`);
        const weeklyData = await weeklyRes.json();

        const hasWeeklyThisWeek = weeklyData.some(survey => {
          const surveyWeekStart = new Date(survey.week_start);
          // Check if the week_start is within the current week (starting from Sunday)
          return surveyWeekStart.toISOString().split('T')[0] === currentWeekStart;
        });

        setWeeklySubmitted(hasWeeklyThisWeek);

      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };

    checkSurveyStatus();
  }, []);


  function getWeekStart(date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Set to Sunday (start of the week)
    startOfWeek.setHours(0, 0, 0, 0); // Set to start of the day (midnight)
    return startOfWeek.toISOString().split('T')[0]; // Return 'YYYY-MM-DD' format
  }



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
      const response = await fetch(`${apiUrl}/remove_doctor/${patientId}`, {
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
    const formatDateTimeForMySQL = (localDateStr, localTimeStr) => {
      const timeZone = 'America/New_York';
      const localDateTime = new Date(`${localDateStr}T${localTimeStr}:00`);

      // Format directly in EDT without converting to UTC
      return formatInTimeZone(localDateTime, timeZone, 'yyyy-MM-dd HH:mm:ss');
    };


    // 👇 Inside handleCreateAppointment
    const localDateStr = selectedDate.toISOString().split('T')[0];
    const appointment_datetime = formatDateTimeForMySQL(localDateStr, selectedTime);

    const newAppointment = {
      patient_id: patientId,
      doctor_id: doctorInfo?.doctor_id,  // make sure doctorInfo is loaded
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
        const updated = await fetch(`${apiUrl}/appointmentsupcoming/${patientId}`);
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


  const [doctorInfo, setDoctorInfo] = useState(null);

  // Replace with actual patient ID logic


  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const res = await fetch(`${apiUrl}/patient/${patientId}`);
        const patientData = await res.json();

        if (patientData.doctor_id) {
          const doctorRes = await fetch(`${apiUrl}/doctor/${patientData.doctor_id}`);
          const doctorData = await doctorRes.json();
          setDoctorInfo(doctorData);
        }

        // ✅ New: Fetch pharmacy info from the patient data
        if (patientData.pharmacy_id) {
          const pharmacyRes = await fetch(`${apiUrl}/pharmacy/${patientData.pharmacy_id}`);
          const pharmacyData = await pharmacyRes.json();
          const { pharmacy_name, address, zipcode, city } = pharmacyData;
          setPharmacyInfo(`${pharmacy_name}, ${address}, ${zipcode}, ${city}`);
        }
      } catch (error) {
        console.error("Failed to fetch doctor or pharmacy info:", error);
      }
    };

    fetchDoctorInfo();
  }, [patientId]);


  //medical chart carousel
  const carouselComponents = [
    <CalorieGraph refreshTrigger={refreshGraph} />,
    <Typography sx={{ fontFamily: 'Merriweather', fontSize: '2vh' }}>
      <WaterGraph refreshTrigger={refreshGraph} />,
    </Typography>,
    <Typography sx={{ fontFamily: 'Merriweather', fontSize: '2vh' }}>
      <WeightGraph refreshTrigger={refreshGraph} />,
    </Typography>
  ];

  const handlePickup = async (prescriptionId) => {
    try {
      const res = await fetch(`${apiUrl}/prescription/pickup`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prescription_id: prescriptionId }),
      });

      if (!res.ok) {
        throw new Error("Failed to update pickup status");
      }

      const result = await res.json();
      console.log(result.message);

      // Re-fetch prescriptions to update the UI
      await fetchPrescriptions(selectedApptId);
    } catch (error) {
      console.error("Pickup error:", error);
    }

  };


  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? carouselComponents.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === carouselComponents.length - 1 ? 0 : prevIndex + 1));
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const [ratingValue, setRatingValue] = useState(0);
  const [isRated, setIsRated] = useState(pastAppointments[0]?.appt_rating !== null && pastAppointments[0]?.appt_rating !== undefined);

  // Function to handle rating submission
  const handleRateAppointment = async (value) => {
    const appointmentId = pastAppointments[0]?.patient_appt_id;
    if (!appointmentId) return;

    try {
      const response = await fetch(`${apiUrl}/appointment/rate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appt_id: appointmentId,
          rating: value,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsRated(true);
        setRatingValue(value);
        setSnackbarMessage('Thank you for your feedback!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        const error = await response.json();
        setSnackbarMessage(`Failed to rate appointment: ${error.error}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }

    } catch (error) {
      console.error(error);
      setSnackbarMessage(`Failed to rate appointment: ${error.error}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (pastAppointments.length > 0) {
      const appointmentId = pastAppointments[0]?.patient_appt_id;

      const checkRatingStatus = async () => {
        try {
          const response = await fetch(`${apiUrl}/appointment/status/${appointmentId}`);
          if (response.ok) {
            const data = await response.json();
            if (data?.appt_rating) {
              setIsRated(true);
              setRatingValue(data.appt_rating);
            } else {
              setIsRated(false);
            }
          } else {
            console.error("Error fetching appointment rating status");
          }
        } catch (error) {
          console.error("Error checking rating status", error);
        }
      };

      checkRatingStatus(); // Call the function to check rating status
    }
  }, [pastAppointments]);
  const isMobile = useMediaQuery('(max-width:920px)');

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (

    <div style={{ display: "flex" }}>
      <>
        {isMobile ? (
          <>
            <IconButton onClick={toggleDrawer} sx={{ position: 'fixed', bottom: 10, left: 10, zIndex: 3 }}>
              <MenuIcon sx={{ color: 'white', backgroundColor: '#5b48a5', borderRadius: '100px', padding: '1px', fontSize: 32 }} />
            </IconButton>
            <Drawer anchor="left" open={open} onClose={toggleDrawer}>
              <Patient_Navbar />
            </Drawer>
          </>
        ) : (
          <Patient_Navbar />
        )}
      </>

      <div style={{ marginLeft: "3px", flexGrow: 1, padding: "20px" }}>
        <Box sx={{ flexGrow: 1 }}>

          <Grid container spacing={2} >
            {/* item 1 */}
            <Grid item md={7} xs={12} >
              <Item sx={{ color: 'white', background: 'linear-gradient(110deg, #5889BD 6.67%, #719EC7 34.84%, #99C6DB 93.33%)', borderRadius: 5, p: 2 }}>
                <Typography sx={{ fontFamily: 'Montserrat', fontSize: '3.5vh', textAlign: "left", mb: '1.1vh' }} >Health Overview</Typography>
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
                        Take your daily and weekly surveys
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
                      By taking your daily and weekly surveys DPP is able to create progress updates so you can
                      track your fitness journey. Take your surveys now by clicking below!
                    </Typography>
                    <Button
                      onClick={openSurveysModal}
                      variant="contained"
                      sx={{
                        background: 'rgba(238, 242, 254, 0.10)',
                        color: 'white',
                        borderRadius: '2vh',
                        fontFamily: 'Montserrat',
                        textTransform: 'none',
                        boxShadow: 0,
                      }}
                    >
                      Survey <ArrowCircleRightOutlinedIcon sx={{ ml: '1vh' }} />
                    </Button>

                    {/* Survey options*/}

                    <Modal

                      open={openSurvey}
                      onClose={closeSurveysModal}
                    //aria-labelledby="modal-modal-title"
                    //aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        {/* Close Icon */}
                        <IconButton
                          onClick={closeSurveysModal}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'grey.600', // or any color you prefer
                            zIndex: 1,
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                        <Typography sx={{ color: "black", fontSize: '4vh' }}>
                          Surveys
                        </Typography>
                        {patientInfo && (
                          <Typography sx={{ color: "black", fontSize: '2vh' }}>
                            {patientInfo.first_name} {patientInfo.last_name}
                          </Typography>)}

                        <Paper
                          sx={{
                            color: 'white',
                            background: 'transparent',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            boxShadow: 0,
                            p: 7,
                          }}
                        >
                          <Button
                            onClick={openDailySurveysModal}
                            variant="contained"
                            fullWidth
                            disabled={dailySubmitted}

                            sx={{
                              backgroundColor: '#719EC7',
                              color: 'white',
                              borderRadius: '25px',
                              fontWeight: 'bold',
                              textTransform: 'none',
                              margin: 2,
                            }}
                          >
                            Daily Survey <ArrowCircleRightOutlinedIcon sx={{ ml: 4 }} />
                          </Button>
                          {dailySubmitted && (
                            <Typography variant="body2" color="gray" sx={{ mb: 2 }}>
                              You've already submitted today's survey.
                            </Typography>
                          )}
                          <Button
                            onClick={openWeeklySurveysModal}
                            variant="contained"
                            fullWidth
                            disabled={weeklySubmitted}
                            sx={{
                              backgroundColor: '#719EC7',
                              color: 'white',
                              borderRadius: '25px',
                              fontWeight: 'bold',
                              textTransform: 'none',
                            }}
                          >
                            Weekly Survey <ArrowCircleRightOutlinedIcon sx={{ ml: 4 }} />
                          </Button>
                          {weeklySubmitted && (
                            <Typography variant="body2" color="gray">
                              You've already submitted this week's survey.
                            </Typography>
                          )}
                        </Paper>
                      </Box>
                    </Modal>
                  </Box>


                  {/* DailySurvey*/}

                  <Modal
                    open={openDailySurvey}
                    onClose={closeDailySurveysModal}
                  //aria-labelledby="modal-modal-title"
                  //aria-describedby="modal-modal-description"
                  >
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: { xs: '90%', sm: '75%', md: '60%' },
                      maxWidth: 600,
                      bgcolor: '#EEF2FE',
                      boxShadow: 24,
                      borderRadius: 3,
                      p: 3,
                      maxHeight: '85vh',
                      overflowY: 'auto',
                    }}  >
                      {/* Close Icon */}
                      <IconButton
                        onClick={closeDailySurveysModal}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          color: 'grey.600', // or any color you prefer
                          zIndex: 1,
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <Typography sx={{ color: "black", fontSize: '4vh', paddingLeft: "1.5vh" }}>
                        Daily Survey
                      </Typography>
                      {patientInfo && (
                        <Typography sx={{ color: "black", fontSize: '2vh', paddingLeft: "1.5vh" }}>
                          {patientInfo.first_name} {patientInfo.last_name}
                        </Typography>
                      )}

                      {error && (
                        <Typography color="error" sx={{ paddingLeft: "1.5vh" }}>
                          {error}
                        </Typography>
                      )}
                      <Paper
                        sx={{
                          background: "transparent",
                          boxShadow: 0,
                          p: 2,
                        }}
                      >


                        <form onSubmit={handleDailySubmit} >
                          <Typography fontSize='1.5vh' mb={1}>
                            What is your heart rate?
                          </Typography>
                          <TextField
                            fullWidth
                            placeholder="Type here"
                            value={heartRate}
                            onChange={(e) => setHeartRate(e.target.value)}
                            sx={{ mb: 2 }}
                            size="small"
                            type="number"


                          />

                          <Typography fontSize='1.5vh' mb={1}>
                            How many glasses of water did you drink?
                          </Typography>
                          <TextField
                            fullWidth
                            placeholder="Type here"
                            value={waterIntake}
                            onChange={(e) => setWaterIntake(e.target.value)}
                            sx={{ mb: 2 }}
                            size="small"
                            type="number"


                          />

                          <Typography fontSize='1.5vh' mb={1}>
                            How many minutes of exercise did you do today?
                          </Typography>
                          <TextField
                            size="small"
                            fullWidth
                            placeholder="Type here"
                            value={exerciseMinutes}
                            onChange={(e) => setExerciseMinutes(e.target.value)}
                            sx={{ mb: 2 }}
                            type="number"

                          />

                          <Typography fontSize='1.5vh' mb={1}>
                            Did you follow your meal plan today?
                          </Typography>
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <Select

                              value={mealPlanFollowed}
                              onChange={(e) => setMealPlanFollowed(e.target.value)}
                              displayEmpty
                              size="small"

                            >
                              <MenuItem value="" disabled ><em style={{ color: 'gray', opacity: 0.7 }}>Dropdown option</em></MenuItem>
                              <MenuItem value="Yes">Yes</MenuItem>
                              <MenuItem value="No">No</MenuItem>
                            </Select>
                          </FormControl>

                          <Typography fontSize='1.5vh' mb={1}>
                            How do you feel today?
                          </Typography>
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <Select
                              value={mood}
                              onChange={(e) => setMood(e.target.value)}
                              displayEmpty
                              size="small"

                            >
                              <MenuItem value="" disabled><em style={{ color: 'gray', opacity: 0.7 }}>Dropdown option</em></MenuItem>
                              <MenuItem value="Good">Good</MenuItem>
                              <MenuItem value="Okay">Okay</MenuItem>
                              <MenuItem value="Bad">Bad</MenuItem>
                            </Select>
                          </FormControl>

                          <Typography fontSize='1.5vh' mb={1}>
                            What is your calorie intake for today?
                          </Typography>
                          <TextField
                            fullWidth
                            placeholder="Type here"
                            value={calorieIntake}
                            size="small"
                            onChange={(e) => setCalorieIntake(e.target.value)}
                            sx={{ mb: 2 }}
                            type="number"
                          />

                          <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                              mt: 2,
                              backgroundColor: '#719EC7',
                              borderRadius: '25px',
                              fontWeight: 'bold',
                              textTransform: 'none',
                            }}
                          >
                            Submit
                          </Button>
                        </form>


                      </Paper>
                    </Box>
                  </Modal>


                  {/* WeeklySurvey*/}
                  <Modal
                    open={openWeeklySurvey}
                    onClose={closeWeeklySurveysModal}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: '75%', md: '60%' },
                        maxWidth: 400,
                        bgcolor: '#EEF2FE',
                        boxShadow: 24,
                        borderRadius: 3,
                        p: 3,
                        maxHeight: '90vh',
                        minHeight: '45vh',
                        overflowY: 'auto',
                      }}

                      component={Paper}
                    >
                      {/* Close Icon */}
                      <IconButton
                        onClick={closeWeeklySurveysModal}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          color: 'grey.600', // or any color you prefer
                          zIndex: 1,
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <Typography sx={{ color: "black", fontSize: '4vh' }}>
                        Weekly Survey
                      </Typography>
                      {patientInfo && (
                        <Typography sx={{ color: "black", fontSize: '2vh' }}>
                          {patientInfo.first_name} {patientInfo.last_name}
                        </Typography>
                      )}

                      {weeklyError && (
                        <Typography color="error" sx={{ mb: 2 }}>
                          {weeklyError}
                        </Typography>
                      )}

                      <form onSubmit={handleWeeklySubmit}>
                        <Typography fontSize='1.5vh' mb={1} paddingTop={2}>
                          Change in Weight
                        </Typography>

                        <Box display="flex" gap={1} mb={2} >
                          <FormControl fullWidth>
                            <Select
                              value={weightChange}
                              onChange={(e) => setWeightChange(e.target.value)}
                              displayEmpty
                              size="small"
                            >
                              <MenuItem value="" disabled><em style={{ color: 'gray', opacity: 0.7 }}>Select an Item</em></MenuItem>
                              <MenuItem value="Gain">Gain</MenuItem>
                              <MenuItem value="Loss">Loss</MenuItem>
                              <MenuItem value="No Change">No Change</MenuItem>
                            </Select>
                          </FormControl>

                          <TextField
                            placeholder="Type here"
                            value={weightAmount}
                            onChange={(e) => setWeightAmount(e.target.value)}
                            fullWidth
                            size="small"
                            type="number"

                          />
                        </Box>

                        <Typography fontSize='1.5vh' mb={1}>
                          Blood Pressure
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Type here"
                          size="small"

                          value={bloodPressure}
                          onChange={(e) => setBloodPressure(e.target.value)}
                        />

                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          sx={{
                            mt: 3,
                            backgroundColor: '#719EC7',
                            borderRadius: '25px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                          }}
                        >
                          Submit
                        </Button>
                      </form>
                    </Box>
                  </Modal>
                  {/* Right Section: Chart + Arrows */}
                  <Box sx={{
                    width: '43%',
                    //backgroundColor: 'white',
                    marginRight: ' 9vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>

                    {(dailyInfo?.length > 0 || weeklyInfo?.length > 0) ? (


                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        {/* White Card */}
                        <Box
                          sx={{
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            boxShadow: 3,
                          }}
                        >
                          <Box
                            sx={{
                              height: '28vh', // or '300px' if you prefer
                              width: '24vw',
                              borderRadius: 2,
                              overflow: 'hidden',
                            }}
                          >
                            {carouselComponents[currentIndex]}
                          </Box>



                        </Box>

                        {/* Navigation (outside the card) */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <IconButton size="small" onClick={handlePrev} sx={{ color: 'white' }}>
                            <ArrowCircleLeftOutlinedIcon fontSize="large" />
                          </IconButton>
                          {/* Dots */}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {carouselComponents.map((_, index) => (

                              <span
                                key={index}
                                style={{
                                  fontSize: '8px',
                                  color: index === currentIndex ? 'blue' : 'lightgray',
                                }}
                              >
                                ●
                              </span>
                            ))}
                          </Box>

                          <IconButton size="small" onClick={handleNext} sx={{ color: 'white' }}>
                            <ArrowCircleRightOutlinedIcon fontSize="large" />
                          </IconButton>
                        </Box>

                      </Box>


                    ) : (
                      <Box
                        sx={{
                          backgroundColor: 'white',
                          borderRadius: '20px',
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '28vh',
                          width: '24vw',
                          boxShadow: 3,
                        }}
                      >
                        <Typography sx={{ fontFamily: 'Montserrat', textAlign: 'center', fontSize: '2vh', mb: 2, color: 'black' }}>
                          Looks like you don’t have any data. Come back after filling out the surveys.
                        </Typography>
                        <Box
                          component="img"
                          src={noSurveysImg}
                          alt="Survey"
                          sx={{
                            width: '50%',
                            height: 'auto',
                            maxHeight: '10vh',
                            objectFit: 'contain'
                          }}
                        />
                      </Box>
                    )}

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
                          position: "relative"
                        }}
                      >
                        {showUpcoming && (
                          <IconButton
                            aria-label="cancel"
                            size="small"
                            onClick={() => openCancelModalFor(appointment.patient_appt_id)}
                            sx={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              color: "#555",
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        )}
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
                          {new Date(appointment.appointment_datetime).toLocaleString("en-US", {
                            timeZone: "America/New_York",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                            timeZoneName: "short"
                          })}
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
                          {appointment.doctor_name}
                        </Typography>
                        {appointment.accepted === 1 ? (
                          <Button
                            variant="contained"
                            onClick={() =>
                              navigate("/patient_dashboard/patient_appointment", {
                                state: { appointmentId: appointment.patient_appt_id },
                              })
                            }
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
                        ) : appointment.accepted === 2 ? (
                          <Typography
                            sx={{
                              color: "#C62828",
                              fontWeight: "bold",
                            }}
                          >
                            Denied
                          </Typography>
                        ) : (
                          "Pending..."
                        )}

                      </Box>
                    ))}

                  </Box>

                  <Box display="flex" justifyContent="center" alignItems="center" anchor="end">
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
                  <Modal open={openCancelModal}>
                    <Box sx={{ ...style, display: 'flex', flexDirection: 'column', alignItems: "center" }}>
                      <Typography sx={{ color: "black", fontSize: '3.5vh', p: 2 }}>
                        You are canceling this appointment.
                      </Typography>
                      <Typography sx={{ color: "black", fontSize: '3.5vh', p: 2 }}>
                        This action cannot be reversed!
                      </Typography>

                      <Button
                        onClick={handleCancelAppointment}
                        variant="contained"
                        sx={{
                          alignContent: 'center',
                          backgroundColor: '#D15254',
                          color: 'black',
                          borderRadius: '25px',
                          fontWeight: 'bold',
                          textTransform: 'none',
                          marginTop: '2vh',
                          marginBottom: '2vh',
                          width: '30vh',
                          fontFamily: 'Merriweather',
                        }}
                      >
                        Cancel Appointment
                      </Button>

                      <Button
                        onClick={closeCancelModal}
                        variant="contained"
                        sx={{
                          backgroundColor: '#719EC7',
                          color: 'white',
                          borderRadius: '25px',
                          fontWeight: 'bold',
                          textTransform: 'none',
                          width: '30vh',
                          fontFamily: 'Merriweather',
                        }}
                      >
                        Close
                      </Button>
                    </Box>
                  </Modal>

                </Box>

              </Item>
            </Grid>

            {/* item 3 */}
            <Grid item md={4} xs={12}>
              <Item sx={{ background: "linear-gradient(110deg, #5889BD 6.67%, #719EC7 34.84%, #99C6DB 93.33%)" }}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: "Montserrat", color: "#FEFEFD", fontSize: '3.5vh', textAlign: 'left', paddingLeft: '1.5vw' }}>
                    Meal Plans
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: "Montserrat", color: "#FEFEFD", fontSize: '2vh', textAlign: 'left', paddingLeft: '1.5vw', fontWeight: 'normal' }}>
                    Come up with your own plans or follow along with doctor recommendations
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
                    fontSize: '1.6vh',
                    fontWeight: "700px",
                    marginTop: "2%",
                    marginBottom: "1%",
                  }}
                  onClick={() => navigate('/patient_dashboard/patient_mealplan')}
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
                      position: "relative", zIndex: 2, color: "white", textAlign: "left", p: 2, paddingTop: 0
                    }}>
                    <Typography variant="h6" fontWeight="medium" sx={{ mb: 1, fontFamily: 'Montserrat', fontSize: '3.5vh' }}>
                      Doctors & Booking
                    </Typography>
                    <Box className="custom-scroll" sx={{
                      height: '38vh',
                      width: '100%',
                      objectFit: "cover",
                      mr: 2,
                      fontFamily: 'Montserrat',
                      overflowY: 'auto'
                    }}>

                      {doctorInfo ? (
                        <>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Box
                              component="img"
                              src={doc1}
                              alt="Doctor"
                              sx={{
                                maxHeight: '20vh',
                                width: '20vw',
                                borderRadius: "30px",
                                objectFit: "cover",
                                mr: 2,
                                fontFamily: 'Montserrat'
                              }}
                            />
                            <Box sx={{ fontFamily: 'Montserrat' }}>
                              <Typography sx={{ fontWeight: 'bold', fontSize: '1.3em' }}>
                                {doctorInfo ? `Dr. ${doctorInfo.first_name} ${doctorInfo.last_name}` : "Loading..."}
                              </Typography>

                              <Typography>
                                {doctorInfo
                                  ? doctorInfo.description.length > 75
                                    ? `${doctorInfo.description.slice(0, 75)}...`
                                    : doctorInfo.description
                                  : "Loading..."}
                              </Typography>
                              <Button onClick={openLearnMoreModal} variant="contained" sx={{ color: "white", borderRadius: 5, textTransform: "none", backgroundColor: "#5A8BBE", fontFamily: 'Montserrat', marginTop: '7px', fontSize: '1.6vh' }}>
                                Learn More
                              </Button>
                            </Box>
                          </Box>
                          {/* Learn More Model*/}

                          <Modal open={openLearnMore} onClose={closeLearnMoreModal}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100vh',
                              }}
                            >
                              <Paper
                                sx={{
                                  position: 'relative',
                                  width: 600,
                                  p: 4,
                                  borderRadius: 3,
                                  boxShadow: 5,
                                  bgcolor: '#EEF2FE',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 3,
                                }}
                              >
                                {/* Close Icon */}
                                <IconButton
                                  onClick={closeLearnMoreModal}
                                  sx={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 12,
                                  }}
                                >
                                  <CloseIcon />
                                </IconButton>

                                {/* Profile Image */}
                                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                  <Box
                                    component="img"
                                    src={doc1}
                                    alt="Doctor"
                                    sx={{
                                      maxHeight: '20vh',
                                      width: '10vw',
                                      borderRadius: "30px",
                                      objectFit: "cover",
                                      mr: 2,
                                    }}
                                  />
                                  <Box>
                                    <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Montserrat' }}>
                                      Dr. {doctorInfo.first_name} {doctorInfo.last_name}
                                    </Typography>
                                    <Typography variant="body2">
                                      <strong>Specialization:</strong> {doctorInfo.specialty || "N/A"}
                                    </Typography>
                                    <Typography variant="body2">
                                      <strong>Years of Experience:</strong> {doctorInfo.years_of_practice} years
                                    </Typography>
                                    <Typography variant="body2">
                                      <strong>Appointment Fee:</strong> {doctorInfo.payment_fee}
                                    </Typography>
                                  </Box>
                                </Box>


                                {/* Content */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>


                                  <Typography variant="body2" mt={2}>
                                    <strong>About:</strong><br />
                                    {doctorInfo.description}
                                  </Typography>
                                </Box>
                              </Paper>
                            </Box>
                          </Modal>

                          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Button
                              onClick={handleOpenBookAppt}
                              variant="contained"
                              sx={{
                                backgroundColor: '#719EC7',
                                color: 'white',
                                textTransform: 'none',
                                borderRadius: 5,
                                fontFamily: 'Montserrat',
                                fontSize: '1.6vh',
                                width: '75%',
                                margin: 'auto',
                              }}
                            >
                              Book Appointment
                            </Button>
                            <Modal open={openBookAppt} onClose={handleCloseBookAppt}>
                              <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '90%',
                                maxWidth: 500,
                                bgcolor: 'white',
                                borderRadius: '20px',
                                boxShadow: 24,
                                p: 4,
                              }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                  <Typography variant="h5" sx={{ fontFamily: 'Montserrat', fontSize: '1.6vh' }}>Book Appointment</Typography>
                                  <IconButton onClick={handleCloseBookAppt}>
                                    <CloseIcon />
                                  </IconButton>
                                </Box>

                                <Typography fontWeight="bold" mb={2}>Dr. {doctorInfo.first_name} {doctorInfo.last_name}</Typography>

                                <TextField
                                  label="Reason for Visit"
                                  fullWidth
                                  value={apptReason}
                                  onChange={(e) => setApptReason(e.target.value)}
                                  sx={{ mb: 2 }}
                                />

                                <TextField
                                  label="Current Medications"
                                  fullWidth
                                  value={medications}
                                  onChange={(e) => setMedications(e.target.value)}
                                  sx={{ mb: 2 }}
                                />

                                <TextField
                                  label="Exercise Frequency"
                                  fullWidth
                                  value={exercise}
                                  onChange={(e) => setExercise(e.target.value)}
                                  sx={{ mb: 2 }}
                                />


                                {/* Date and time selectors (replace with date picker if needed) */}
                                <Typography sx={{ fontSize: '0.9em', fontWeight: 'bold', mt: 2 }}>Pick Date</Typography>
                                <TextField
                                  type="date"
                                  fullWidth
                                  value={selectedDate.toISOString().split('T')[0]}
                                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                  sx={{ mb: 2 }}
                                />

                                <Typography sx={{ fontSize: '0.9em', fontWeight: 'bold' }}>Time</Typography>
                                <TextField
                                  type="time"
                                  fullWidth
                                  value={selectedTime}
                                  onChange={(e) => setSelectedTime(e.target.value)}
                                  sx={{ mb: 2 }}
                                />

                                <Typography sx={{ fontSize: '0.9em', fontStyle: 'italic', mb: 2 }}>
                                  Pharmacy: {pharmacyInfo || "Loading..."}
                                </Typography>


                                <Box display="flex" justifyContent="space-between">
                                  <Button
                                    onClick={handleCreateAppointment}
                                    variant="contained"
                                    sx={{
                                      backgroundColor: '#5A8BBE',
                                      borderRadius: '25px',
                                      textTransform: 'none',
                                      fontWeight: 'bold',
                                      fontFamily: 'Montserrat',
                                      width: '48%',
                                    }}
                                  >
                                    Request
                                  </Button>



                                  <Button
                                    onClick={handleCloseBookAppt}
                                    variant="contained"
                                    sx={{
                                      backgroundColor: '#D15254',
                                      borderRadius: '25px',
                                      textTransform: 'none',
                                      fontWeight: 'bold',
                                      fontFamily: 'Montserrat',
                                      width: '48%',
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </Box>
                              </Box>
                            </Modal>

                            <Button variant="contained" onClick={() => navigate('/patient_dashboard/patient_doctorlist')} sx={{ color: "white", backgroundColor: "#719EC7", borderRadius: 5, textTransform: "none", fontFamily: 'Montserrat', fontSize: '1.6vh', width: '75%', margin: 'auto' }}>
                              See More Doctors
                            </Button>
                            <Button onClick={openDeleteCurrentDoctorModal} variant="contained" sx={{ color: "white", backgroundColor: "#719EC7", borderRadius: 5, textTransform: "none", fontFamily: 'Montserrat', fontSize: '1.6vh', width: '75%', margin: 'auto' }}>
                              Delete Current Doctor
                            </Button>
                            <Modal open={openDeleteCurrentDoctor} >
                              <Box sx={{ ...style, display: 'flex', flexDirection: 'column', alignItems: "center", }}>

                                <Typography sx={{ color: "black", fontSize: '4vh', p: 2 }}> Are you sure you want to delete your current doctor? </Typography>
                                <Typography sx={{ color: "black", fontSize: '4vh', p: 2 }}> This action cannot be reveresed! </Typography>
                                <Button
                                  onClick={handleDeleteCurrentDoctor}
                                  variant="contained"
                                  sx={{
                                    alignContent: 'center',
                                    backgroundColor: '#D15254',
                                    color: 'black',
                                    borderRadius: '25px',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    marginTop: '2vh',
                                    marginBottom: '2vh',
                                    width: '30vh',
                                    fontFamily: 'Merriweather',

                                  }}
                                >DELETE</Button>
                                <Button
                                  onClick={closeDeleteCurrentDoctorModal}
                                  variant="contained"
                                  sx={{
                                    backgroundColor: '#719EC7',
                                    color: 'white',
                                    borderRadius: '25px',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    width: '30vh',
                                    fontFamily: 'Merriweather',
                                  }}
                                >Close
                                </Button>

                              </Box>
                            </Modal>
                          </Box>
                        </>
                      ) : (<>
                        <Box>
                          <Typography sx={{ fontFamily: 'Montserrat', fontSize: '1.3em', wieght: '600px' }}>
                            Looks like you don’t have a doctor set. Click on ‘Find a Doctor’ to request one!
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
                                onClick={() => navigate('/patient_dashboard/patient_doctorlist')}
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
                                Find A Doctor
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
                <Box sx={{ position: "relative", zIndex: 2, color: "white", textAlign: "left", p: 2, paddingTop: 0 }}>
                  <Typography variant="h6" fontWeight="medium" sx={{ mb: 1, fontFamily: 'Montserrat', fontSize: '3.5vh' }}>
                    Appointment Overview
                  </Typography>
                  <Box
                    className="custom-scroll"
                    sx={{
                      height: '35vh',
                      width: '100%',
                      overflowY: 'auto',
                      fontFamily: 'Montserrat',
                    }}>

                    {pastAppointments.length > 0 ? (
                      <>
                        <Typography sx={{ fontFamily: "montserrat", fontSize: '1.7vh' }}>
                          <strong>Date:</strong> {new Date(pastAppointments[0].appointment_datetime).toLocaleString()}
                        </Typography>
                        {prescriptions.map((prescription, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <Typography sx={{ fontSize: '1.7vh', fontFamily: "montserrat" }}>
                              <strong>Prescription:</strong> {prescription.medicine_name}
                            </Typography>

                            <Typography sx={{ fontSize: '1.7vh', fontFamily: "montserrat" }}>
                              <strong>Status:</strong>{' '}
                              {!prescription.filled ? (
                                // Pending, not filled yet
                                <span>Pending</span>
                              ) : prescription.picked_up ? (
                                // Filled and picked up
                                <span>Picked up</span>
                              ) : (
                                // Filled but not picked up
                                <>
                                  Ready
                                  <Button
                                    size="small"
                                    variant="contained"
                                    sx={{
                                      ml: 1,
                                      backgroundColor: '#5889BD',
                                      color: '#fff',
                                      textTransform: 'none',
                                      borderRadius: '16px',
                                      fontSize: '1.5vh',
                                      padding: '2px 12px',
                                      fontFamily: 'Montserrat',
                                      '&:hover': {
                                        backgroundColor: '#6c97c8',
                                      },
                                    }}
                                    onClick={() => handlePickup(prescription.prescription_id)}
                                  >
                                    Pick Up
                                  </Button>
                                </>
                              )}
                            </Typography>
                          </Box>
                        ))}

                        <Typography sx={{ fontSize: '1.7vh', fontFamily: "montserrat" }}>
                          <strong>Pickup Location:</strong> {pharmacyInfo}
                        </Typography>
                        <Typography sx={{ fontSize: '1.7vh', fontFamily: "montserrat" }}>
                          <strong>Diet:</strong> {pastAppointments[0].meal_prescribed || "N/A"}
                        </Typography>
                        <Typography sx={{ fontSize: '1.7vh', fontFamily: "montserrat" }}>
                          <strong>Notes:</strong> {pastAppointments[0].doctor_appointment_note || "No notes provided"}
                        </Typography>

                        <Typography component="legend" sx={{ fontSize: '1.2em', fontWeight: 'bold', mt: 2 }}>
                          Rate Your Appointment:
                        </Typography>
                        {isRated ? (
                          <Typography sx={{ fontSize: '1.7vh', fontFamily: 'montserrat' }}>
                            You rated this appointment <strong>{ratingValue}</strong> out of 5.
                          </Typography>
                        ) : (
                          <StyledRating
                            name="customized-color"
                            defaultValue={0}
                            precision={1}
                            icon={<FavoriteIcon fontSize="inherit" sx={{ fontSize: '2vw' }} />}
                            emptyIcon={<FavoriteBorderIcon fontSize="inherit" sx={{ fontSize: '2vw', color: '#FEFEFD' }} />}
                            onChange={(event, newValue) => {
                              setRatingValue(newValue);
                              handleRateAppointment(newValue);
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <Typography sx={{ fontSize: '1.9vh' }}>
                        {"Book and attend an appointment to view overview :("}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Item>


            </Grid>


          </Grid>

        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            elevation={6}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Patient_Landing;
