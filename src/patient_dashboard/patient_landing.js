import React, { useState, useEffect, useRef } from "react"; 
import Patient_Navbar from "./patient_navbar"; 
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import FlowerBackgroundImg from "./patient_landing_assets/FlowerBackground.png"
import mealImg from "./patient_landing_assets/meals.png"
import overviewSurveyImg from "./patient_landing_assets/overviewSurveyImg.png"
import noSurveysImg from "./patient_landing_assets/NoSurveys.png"
import { Select,MenuItem, InputLabel, Button, Typography, Modal, TextField, FormControl} from "@mui/material";
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import doc1 from "./doctorim/doctor1.png";
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Card, CardContent} from '@mui/material';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Plot from 'react-plotly.js';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius:30,
  height:'47vh',
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





const data = {
  appointmentDate: '01/04/25',
  prescription: 'Fakemed',
  status: 'Ready',
  pickedUp: true,
  pickupLocation: 'Newark CVS',
  diet: 'Keto',
  notes: 'Drink lots of water and avoid any heavy carbs',
  rating: 0,
};
const labelMap = {
  appointmentDate: 'Appointment Date',
  prescription: 'Prescription',
  status: 'Status',
  pickupLocation: 'Pickup Location',
  diet: 'Diet',
  notes: 'Notes',
};

function Patient_Landing() {
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("patient_id");
    if (storedId) {
      setPatientId(storedId);
      // Now use storedId to fetch data (like appointments)
    } else {
      navigate("/"); // or show login modal again
    }
  }, []);

  const [value, setValue] = React.useState(2);

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const upcomingRes = await fetch(`http://127.0.0.1:5000/appointmentsupcoming/${patientId}`);
        const pastRes = await fetch(`http://127.0.0.1:5000/appointmentspast/${patientId}`);
  
        if (!upcomingRes.ok || !pastRes.ok) {
          throw new Error("Failed to fetch appointments");
        }
  
        const upcomingData = await upcomingRes.json();
        const pastData = await pastRes.json();
  
        setUpcomingAppointments(upcomingData);
        setPastAppointments(pastData);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAppointments();
  }, [patientId]);

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
    patient_id: 1, // make sure this is defined in your component
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
    const response = await fetch('http://localhost:5000/api/daily-survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dailyData),
    });

    if (response.ok) {
      console.log('Daily survey submitted successfully');
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
    weightChange,
    weightAmount,
    bloodPressure
  };
//replace fetch with correct url
  try {
    const response = await fetch('http://localhost:5000/api/surveys/weekly', {
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
const openDeleteCurrentDoctorModal = () =>{
  setOpenDeleteCurrentDoctor(true);
};
const closeDeleteCurrentDoctorModal = () =>{
  setOpenDeleteCurrentDoctor(false);
}


const handleDeleteCurrentDoctor = async () => {
  try {
    const doctorId = null//currentDoctorId;
    const response = await fetch(`http://localhost:5000/api/delete-doctor/${doctorId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer yourToken'  // if you use auth
      },
    });

    if (!response.ok) {
      throw new Error('Something went wrong while deleting');
    }

    console.log('Doctor deleted successfully');
    closeDeleteCurrentDoctorModal();  // close the modal
    // Optionally refresh data or navigate
  } catch (error) {
    console.error('Error deleting doctor:', error);
  }
};


const [showUpcoming, setShowUpcoming] = useState(true);



//Booking an appointment
  const [openBookAppt, setOpenBookAppt] = useState(false);

  const handleOpenBookAppt = () => setOpenBookAppt(true);
  const handleCloseBookAppt = () => setOpenBookAppt(false);

  // Form fields
  const [apptReason, setApptReason] = useState('');
  const [medications, setMedications] = useState('');
  const [exercise, setExercise] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');


  const [pharmacyInfo, setPharmacyInfo] = useState("");

  useEffect(() => {
    // Replace with actual endpoint
    fetch('http://localhost:5000/api/get-pharmacy')
      .then(res => res.json())
      .then(data => {
        setPharmacyInfo(`${data.name}, ${data.address}, ${data.zip}, ${data.city}`);
      })
      .catch(err => {
        console.error("Failed to fetch pharmacy info", err);
      });
  }, []);


  


  return (

    <div style={{ display: "flex" }}>
      {/* Sidebar/Navbar */}
      <Patient_Navbar /> 

      <div style={{ marginLeft: "3px", flexGrow: 1, padding: "20px" }}>
        <Box sx={{ flexGrow: 1 }}>
          
          <Grid container spacing={2} >
            {/* item 1 */}
            <Grid item xs={7} >
            <Item sx={{ color:'white',background: 'linear-gradient(110deg, #5889BD 6.67%, #719EC7 34.84%, #99C6DB 93.33%)', borderRadius:5,p:2}}>
            <Typography sx={{ fontFamily:'Montserrat', fontSize:'3.5vh',      textAlign:"left",mb:'1.1vh'}} >Health Overview</Typography>
  <Paper
    //elevation={3}
    sx={{
      //borderRadius: 5,
      m: 0,
      color:'white',
      background:'transparent',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow:0,
    }}
  >
    {/* Left Section: Text, Image, Button */}
    <Box sx={{ height:'38vh',width: '35%', borderRadius: 3, background: 'rgba(238, 242, 254, 0.10)', p:2,}}>
     <Paper
     sx={{
      color:'white',
      background:'transparent',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow:0,
      textAlign:"left",
    }}
     >

      <Typography variant="h5" fontSize={'2.4vh'} fontFamily={'Montserrat'} paddingBottom={4} >
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
          mb: 2,
          mr:2,
        }}
      />
      </Paper>
      <Typography variant="body1" sx={{ width:'24vh', mb:'1vh',textAlign:'left', fontFamily:'Merriweather', fontSize:'1.5vh'}}>
        By taking your daily and weekly surveys DPP is able to create progress updates so you can
        track your fitness journey. Take your surveys now by clicking below!
      </Typography>
      <Button 
        onClick={openSurveysModal}
        variant="contained"
        sx={{
          background: 'rgba(238, 242, 254, 0.10)',
          color: 'white',
          borderRadius: '25px',
          fontFamily: 'Montserrat',
          textTransform: 'none',
          boxShadow:0,
        }}
      >
        Survey <ArrowCircleRightOutlinedIcon sx={{ ml: 4 }}  />
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
          <Typography  sx={{color:"black", fontSize:'4vh'}}>
            Surveys
          </Typography>
          <Typography  sx={{color:"black", fontSize:'2vh'}}>
            Jane Doe
          </Typography>
          <Paper
     sx={{
      color:'white',
      background:'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow:0,
      p:7,
    }}
     >
          <Button 
        onClick={openDailySurveysModal}
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: '#719EC7',
          color: 'white',
          borderRadius: '25px',
          fontWeight: 'bold',
          textTransform: 'none',
          margin:2,
        }}
      >
        Daily Survey <ArrowCircleRightOutlinedIcon sx={{ ml: 4 }}  />
      </Button>
      <Button 
        onClick={openWeeklySurveysModal}
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: '#719EC7',
          color: 'white',
          borderRadius: '25px',
          fontWeight: 'bold',
          textTransform: 'none',
        }}
      >
       Weekly Survey <ArrowCircleRightOutlinedIcon sx={{ ml: 4}}/>
      </Button>
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
        <Box  sx={{
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
          <Typography  sx={{color:"black", fontSize:'4vh', paddingLeft:"1.5vh"}}>
            Daily Survey
          </Typography>
          <Typography sx={{color:"black", fontSize:'2vh',paddingLeft:"1.5vh"}}>
            FirstName LastName
          </Typography>

         
          <Paper
       sx={{
        background: "transparent",
        boxShadow: 0,
        p: 2,
      }}
    >
      <form onSubmit={handleDailySubmit} >
        <Typography fontSize= '1.5vh'  mb={1}>
          What is your heart rate?
        </Typography>
        <TextField
          fullWidth
          placeholder="Type here"
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          sx={{ mb: 2 }}
          size="small"

        />
    
        <Typography fontSize= '1.5vh'  mb={1}>
          How many glasses of water did you drink?
        </Typography>
        <TextField
          fullWidth
          placeholder="Type here"
          value={waterIntake}
          onChange={(e) => setWaterIntake(e.target.value)}
          sx={{ mb: 2 }}
          size="small"

        />
    
        <Typography fontSize= '1.5vh' mb={1}>
          How many minutes of exercise did you do today?
        </Typography>
        <TextField
           size="small"
          fullWidth
          placeholder="Type here"
          value={exerciseMinutes}
          onChange={(e) => setExerciseMinutes(e.target.value)}
          sx={{ mb: 2 }}
        />
    
        <Typography fontSize= '1.5vh' mb={1}>
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
    
        <Typography fontSize= '1.5vh'  mb={1}>
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
    
        <Typography fontSize= '1.5vh' mb={1}>
          What is your calorie intake for today?
        </Typography>
        <TextField
          fullWidth
          placeholder="Type here"
          value={calorieIntake}
          size="small"
          onChange={(e) => setCalorieIntake(e.target.value)}
          sx={{ mb: 2 }}
        />
    
        <Button
          onClick={closeDailySurveysModal}
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
    minHeight:'45vh',
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
      <Typography sx={{color:"black", fontSize:'4vh'}}>
        Weekly Survey
      </Typography>

      <Typography sx={{color:"black", fontSize:'2vh'}}>
        Natasha Pena
      </Typography>

      <form onSubmit={handleWeeklySubmit}>
        <Typography fontSize= '1.5vh' mb={1} paddingTop={2}>
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
          />
        </Box>

        <Typography fontSize= '1.5vh' mb={1}>
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
          onClick={closeWeeklySurveysModal}
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
        marginRight:' 9vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>

    <Typography sx={{fontFamily:'Montserrat', textAlign:'left',fontSize:'2.4vh' }}>Looks like you don’t have any data. Come back after filling out the surveys</Typography>
    <Box
        component="img"
        src={noSurveysImg}
        alt="Survey"
        sx={{
         
        }}
      />
    </Box>
    
    {/* <Box
      sx={{
        width: '5vh',
        backgroundColor: 'white',
        borderRadius: 3,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" color="black" sx={{ mb: 1 }}>
        Weight
      </Typography>
      <Box
        component="img"
        //src="/chart-placeholder.png" // replace with actual chart
        alt="Weight Chart"
        sx={{ width: '100%', borderRadius: 2, mb: 2 }}
      >
        
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button size="small">←</Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <span>●</span>
          <span>●</span>
          <span>●</span>
        </Box>
        <Button size="small">→</Button>
      </Box>
    </Box> */}
  </Paper>

  </Item>
         
            </Grid>
            {/* item 2 */}

            <Grid item xs={5}>
              <Item sx={{backgroundColor:"#EEF2FE"}}>
                <Box>
                <Typography variant="h6" gutterBottom sx={{fontFamily: "Montserrat", color: "#22252C", fontSize: '2.5em', textAlign: 'left', paddingLeft: '1.5vw'}}>
                  {showUpcoming ? "Upcoming Appointments" : "Past Appointments"}
                </Typography>
                <Box className="custom-scroll" sx={{height: '30vh', width: '90%', margin: 'auto', overflowY: "auto"} }>

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
                        fontSize: "1.5em",
                        textAlign: "left",
                        paddingLeft: "1vw",
                      }}
                    >
                      {appointment.appointment_datetime}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "Merrriweather",
                        fontWeight: "bold",
                        color: "#22252C",
                        fontSize: "1.4em",
                        textAlign: "left",
                        paddingLeft: "1vw",
                      }}
                    >
                      {appointment.doctor_name}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#5A8BBE",
                        color: "#22252C",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#5A8BCF" },
                        width: "70%",
                        borderRadius: "30px",
                        fontFamily: "Merrriweather",
                        fontSize: "1.5em",
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

                <Box display="flex" justifyContent="center" mt={3} alignItems="center" sx={{marginBottom: '1px', paddingBottom: '1px'}}>
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
            <Grid item xs={4}>
              <Item sx={{background: "linear-gradient(110deg, #5889BD 6.67%, #719EC7 34.84%, #99C6DB 93.33%)"}}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{fontFamily: "Montserrat", color: "#FEFEFD", fontSize: '2.5em', textAlign: 'left', paddingLeft: '1.5vw'}}>
                    Meal Plans
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{fontFamily: "Montserrat", color: "#FEFEFD", fontSize: '2vh', textAlign: 'left', paddingLeft: '1.5vw', fontWeight: 'normal'}}>
                    Come up with your own plans or follow along with doctor recommendations
                  </Typography>
                  <Box
                      component="img"
                      src = {mealImg}
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
                    fontSize: "1.5em",
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
            <Grid item xs={4}>
              <Item  sx={{ 
                position: "relative",
                overflow:"hidden",
                backgroundImage: `url(${FlowerBackgroundImg})`, 
                backgroundColor: "lightgray", 
                backgroundSize: "cover",
                backgroundPosition: "center", 
                backgroundRepeat: "no-repeat",
                height:'100%',
                maxHeight:"47vh",
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
              <Box sx={{ position: "relative", zIndex: 2, height:'100%' }}>
                <Box 
                sx={{ position: "relative", zIndex: 2, color: "white", textAlign: "left", p: 2, maxHeight:"100%", overflowY:"auto",    '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transpnt',
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  borderRadius: '10px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                },}}>
                  <Typography variant="h6" fontWeight="medium" sx={{ mb: 1, fontFamily: 'Montserrat', fontSize: '2em' }}>
                    Doctors & Booking
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2}}>
                    <Box
                      component="img"
                      src = {doc1}
                      alt="Doctor"
                      sx={{
                        maxHeight: '20vh',
                        width: '20vw',
                        borderRadius: "30px",
                        objectFit: "cover",
                        mr: 2,
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium" sx={{fontFamily: 'Montserrat', fontSize: '1.5em'}}>
                        Dr. Geller
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: "0.85rem", fontFamily: 'Merriweather', fontSize: '1.2em'}}>
                        Dr. Geller has studied at an institution for some time and is very reliable and stuff.
                      </Typography>
                      <Button onClick={openLearnMoreModal} variant="contained" sx={{ color: "white", borderRadius: 5, textTransform: "none", backgroundColor: "#5A8BBE", fontFamily: 'Montserrat', marginTop: '7px', fontSize: '1.3em'}}>
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
      <Box sx={{display:'flex', flexDirection: 'row'}}>
      <Box
          component="img"
          src = {doc1}
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
      <Typography variant="h6" fontWeight="bold">
          Dr. Hillary Geller
        </Typography>
        <Typography variant="body2">
          <strong>Specialization:</strong> Nutritionist
        </Typography>
        <Typography variant="body2">
          <strong>Years of Experience:</strong> 4 years
        </Typography>
        <Typography variant="body2">
          <strong>Appointment Fee:</strong> $150
        </Typography>
        <Typography variant="body2">
          <strong>Rating:</strong> 4.3/5
        </Typography>
        </Box>
      </Box>
      
      
      {/* Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>


        <Typography variant="body2" mt={2}>
          <strong>About:</strong><br />
          Dr. Hillary Geller is a board-certified nutritionist and weight management specialist with over 10 years of experience helping patients achieve their health and fitness goals. She earned her medical degree from Johns Hopkins University and completed her residency in clinical nutrition at Harvard Medical School. Dr. Geller is passionate about creating personalized diet and exercise plans that fit each patient's lifestyle...
        </Typography>
      </Box>
    </Paper>
  </Box>
</Modal>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2}}>
                  <Button
                    onClick={handleOpenBookAppt}
                    variant="contained"
                    sx={{
                      backgroundColor: '#719EC7',
                      color: 'white',
                      textTransform: 'none',
                      borderRadius: 5,
                      fontFamily: 'Montserrat',
                      fontSize: '1.2em',
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
                        <Typography variant="h5" sx={{ fontFamily: 'Montserrat' }}>Book Appointment</Typography>
                        <IconButton onClick={handleCloseBookAppt}>
                          <CloseIcon />
                        </IconButton>
                      </Box>

                      <Typography fontWeight="bold" mb={2}>Dr. Hillary Geller</Typography>

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
                        onClick={() => {
                          const formattedDate = selectedDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: '2-digit',
                            day: '2-digit',
                          });
                          const formattedTime = selectedTime; // already in HH:MM format

                          const newAppointment = {
                            date: `${formattedDate} - ${formattedTime}`,
                            doctor: "Dr. Geller",
                            timestamp: new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}`)  // Store raw Date
                          };
                          
                          setUpcomingAppointments(prev =>
                            [...prev, newAppointment].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                          );
                          

                          // Optional: Clear fields
                          setApptReason('');
                          setMedications('');
                          setExercise('');
                          setSelectedDate(new Date());
                          setSelectedTime('09:00');

                          handleCloseBookAppt();
                        }}
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

                    <Button variant="contained" onClick={() => navigate('/patient_dashboard/patient_doctorlist')} sx={{ color: "white", backgroundColor: "#719EC7", borderRadius: 5, textTransform: "none", fontFamily: 'Montserrat', fontSize: '1.3em', width: '75%', margin: 'auto'}}>
                      See More Doctors
                    </Button>
                    <Button onClick={openDeleteCurrentDoctorModal} variant="contained" sx={{ color: "white", backgroundColor: "#719EC7", borderRadius: 5, textTransform: "none", fontFamily: 'Montserrat', fontSize: '1.3em', width: '75%', margin: 'auto'}}>
                      Delete Current Doctor
                    </Button>
                    <Modal open={openDeleteCurrentDoctor} >
                      <Box sx={{...style, display:'flex', flexDirection:'column',alignItems:"center",}}>
                     
                        <Typography sx={{color:"black", fontSize:'4vh', p:2}}> Are you sure you want to delete your current doctor? </Typography>
                        <Typography sx={{color:"black", fontSize:'4vh', p:2}}> This action cannot be reveresed! </Typography>
                        <Button
                          onClick={handleDeleteCurrentDoctor}
                          variant="contained"
                          sx={{
                            alignContent:'center',
                            backgroundColor: '#D15254',
                            color: 'black',
                            borderRadius: '25px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            marginTop:'2vh',
                            marginBottom:'2vh',
                            width:'30vh',
                            fontFamily:'Merriweather',

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
                          width:'30vh',
                          fontFamily:'Merriweather',
                        }}
                        >Close
                        </Button>

                      </Box>
                    </Modal>
                  </Box>
                </Box>
              </Box>
              
              </Item>
            </Grid>



            {/* item 5 */}
            <Grid item xs={4}>
              <Item sx={{background: "linear-gradient(110deg, #5889BD 6.67%, #719EC7 34.84%, #99C6DB 93.33%)", backgroundSize: "cover", fontFamily: 'Montserrat'}}>
                <Box sx={{ position: "relative", zIndex: 2, color: "white", textAlign: "left", p: 2}}>
                  <Typography variant="h6" fontWeight="medium" sx={{ mb: 1, fontFamily: 'Montserrat', fontSize: '2em' }}>
                      Appointment Overview
                  </Typography>

                    {Object.entries(data).map(([key, value]) => {
                      if (key === 'pickedUp' || key === 'rating') return null;

                      return (
                        <Box
                          key={key}
                          display="flex"
                          alignItems="center"
                          mt={key === 'status' ? 1 : 0}
                          mb={key === 'status' ? 1 : 0}
                        >
                          <Typography variant="body1" 
                          sx={{fontFamily: 'Montserrat', fontSize: '1.2em' }}>
                            <strong>{labelMap[key]}:</strong> {value}
                          </Typography>

                          {key === 'status' && data.pickedUp && (
                            <Button
                              size="small"
                              variant="contained"
                              sx={{
                                ml: 2,
                                backgroundColor: '#5889BD',
                                color: '#fff',
                                textTransform: 'none',
                                borderRadius: '16px',
                                fontSize: '0.75rem',
                                padding: '2px 12px',
                                fontFamily: 'Montserrat',
                                '&:hover': {
                                  backgroundColor: '#6c97c8',
                                },
                              }}
                            >
                              Picked up
                            </Button>
                          )}
                  </Box>
                );
              })}

                <Typography component="legend" sx={{fontFamily: 'Montserrat', fontSize: '1.2em', fontWeight: 'bold', marginTop: '4px'}}> Rate Your Appointment:</Typography>
                <StyledRating
                  name="customized-color"
                  defaultValue={0}
                  getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                  precision={1}
                  icon={<FavoriteIcon fontSize="inherit" sx={{ fontSize: '2vw'}}/>}
                  emptyIcon={<FavoriteBorderIcon fontSize="inherit" sx={{ fontSize: '2vw', color: '#FEFEFD' }} />}
                />
                </Box>
              </Item>

            </Grid>


          </Grid>
        </Box>
      </div>
    </div>
  );
};

export default Patient_Landing;
