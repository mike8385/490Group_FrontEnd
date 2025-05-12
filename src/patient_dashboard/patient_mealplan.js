import React, { useState, useEffect } from "react"; // ✅ Add useEffect
import Patient_Navbar from "./patient_navbar";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Typography, Button, Divider, FormControl, TextField } from "@mui/material";
import food1 from "./meals/food1.png";
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';



const apiUrl = process.env.REACT_APP_API_URL;
const RoundedPanel = styled(Paper)(({ theme }) => ({
  borderRadius: '30px',
  padding: '2vw',
  height: '85vh',
  backgroundColor: '#EEF2FE',
}));

const MealPlanCard = ({ title, author, tags, onView, onManage, patientInfo, meal_plan_id }) => (
  <Box
    sx={{
      background: 'linear-gradient(109.86deg, #5889BD 6.67%, #719EC7 34.84%, #99C6DB 93.33%)',
      borderRadius: '30px',
      padding: 2,
      marginBottom: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Box>
      <Typography sx={{ fontWeight: '500px', color: 'white', fontFamily: 'Montserrat', fontSize:'1.4em' }}>{title}</Typography>
      <Typography sx={{ color: 'white', fontSize: '0.85em', fontFamily:'merriweather', fontSize:'1.2em', fontWeight: '400px' }}>Made by: {author}</Typography>
      <Typography sx={{ color: 'white', fontSize: '0.85em', fontFamily:'merriweather', fontSize:'1.2em', fontWeight: '400px' }}>Tags: {tags}</Typography>
    </Box>
    <Box display="flex" gap={1}>
      <Button 
        variant="contained" 
        onClick={() => onView(meal_plan_id)} // Pass the id here
        sx={{ backgroundColor: '#5A4AA3', fontFamily: 'Montserrat', borderRadius: '30px', textTransform: 'none', fontWeight: '400px', fontSize: '1.3em'}}
      >
        View
      </Button>
      
      {patientInfo && author.includes(patientInfo.first_name) ? (
        <Button 
          variant="contained" 
          onClick={() => onManage(meal_plan_id)} // Pass the id here if needed
          sx={{ 
            backgroundColor: '#5A4AA3', 
            fontFamily: 'Montserrat', 
            borderRadius: '30px', 
            textTransform: 'none', 
            fontWeight: '400px', 
            fontSize: '1.3em' 
          }}
        >
          Manage
        </Button>
      ) : (
        <Button 
          variant="contained" 
          disabled
          sx={{ 
            backgroundColor: '#5A4AA373',
            fontFamily: 'Montserrat', 
            borderRadius: '30px', 
            textTransform: 'none', 
            fontWeight: '400px', 
            fontSize: '1.3em',
            color: 'white',
            '&:disabled': {
              color: 'white'
            }
          }}
        >
          Manage
        </Button>
      )}
    </Box>
  </Box>
);


const MealCard = ({ title, tags, description, image, day, onAddToPlan, meal_id}) => {
        const handleClick = () => {
          if (day) {
            onAddToPlan({ title, tags, description, image, meal_id});
          }
        };
  return (
    <Box
      sx={{
        backgroundColor: '#EEF2FE',
        borderRadius: '30px',
        padding: 2,
        paddingLeft: 3,
        marginBottom: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box>
      <Typography sx={{ fontWeight: '600px', fontFamily: 'Montserrat', fontSize: '1.3em', color: '#1E1E1E'}}>{title}</Typography>
      <Box sx={{display: 'flex', flexDirection: 'row'}}>
      <Box component="img" src={food1} alt={title} sx={{height: '15vh', borderRadius: '30px', marginRight: '1vw'}} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography sx={{ fontSize: '0.8em', fontFamily: 'Merriweather', fontSize: '1em' }}>Tags: {tags}</Typography>
        <Typography sx={{ fontSize: '0.8em', fontFamily: 'Merriweather', fontSize: '1em'}}>{description}</Typography>
        <Button variant="contained" onClick={handleClick} sx={{ backgroundColor: day ? '5A8BBE' : '#5A8BBE73', marginTop: 1, borderRadius: '30px', textTransform: 'none', fontSize: '1em', fontWeight:'bold'}}> {day ? `Add to plan` : "Select a meal plan to add"}</Button>
      </Box>
      </Box>
      </Box>
    </Box>
  );
};


function Patient_Mealplan() {


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

  // Temporary mock data
  const [mealPlans, setMealPlans] = useState([]);

  useEffect(() => {
    const fetchMealPlans = async () => {
      const id = localStorage.getItem("patientId");
      if (!id) {
        console.warn("No patient ID in localStorage");
        return;
      }
      console.log("Successfully got ID", id);
      const Uid = localStorage.getItem("userId");
      if (!Uid) {
        console.warn("No user ID in localStorage");
        return;
      }
      console.log("Successfully got UID", Uid);
      try {
        const response = await fetch(`${apiUrl}/get-saved-meal-plans/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch meal plans');
        }
    
        const  saved_meal_plans  = await response.json();
        console.log(saved_meal_plans);
        if (!saved_meal_plans) {
          throw new Error('No meal plans data received');
        }
    
      // Change this in your fetchMealPlans function:
      setMealPlans(
        saved_meal_plans.map(plan => ({
          meal_plan_id: plan.meal_plan_id,
          title: plan.title || plan.meal_plan_name,
          author: plan.made_by || "Custom", // Use creator_name from backend
          tags: plan.tag || plan.description || "Custom"
        }))
      );
      } catch (error) {
        console.error("Failed to fetch meal plans:", error);
      }
    };
  
    fetchMealPlans();
  }, []);
  

  // useEffect(() => {
  //   fetch('http://127.0.0.1:5000/doctors')
  //     .then(response => response.json())
  //     .then(data => {
  //       setDoctors(data);
  //     })
  //     .catch(error => {
  //       console.error("Error fetching doctor data:", error);
  //     });
  // }, [])

    const [savedMeals, setSavedMeals] = useState([]);
  
      useEffect(() => {
  const fetchSavedMeals = async () => {
    const Uid = localStorage.getItem("userId");
    if (!Uid) return;
    
    try {
      const res = await fetch(`${apiUrl}/posts/save/${Uid}`);
      if (!res.ok) throw new Error("Failed to fetch saved meals");
      
      const saved_meals = await res.json();
      setSavedMeals(
        saved_meals.map(meal => ({
          //id: meal.meal_id, // This must match your API response
          meal_id: meal.meal_id, // Include both for compatibility
          title: meal.meal_name,
          tags: meal.tag,
          description: meal.description,
          image: meal.picture || food1
        }))
      );
              console.log("Meal Infos", saved_meals);
    } catch (error) {
      console.error("Error fetching saved meals:", error);
    }
  };
  fetchSavedMeals();
}, []);
  // const savedMeals = [
  //   {
  //     title: "Cauliflower Fried Rice",
  //     tags: "Keto",
  //     description: "Fried rice is a classic and comforting recipe that everyone loves...",
  //     image: "https://via.placeholder.com/80", // Replace with actual image URLs later
  //   },
  //   {
  //     title: "Cheesy Broccoli Cheddar Spaghetti Squash",
  //     tags: "Keto",
  //     description: "Cheesy broccoli in any form is our ultimate comfort food...",
  //     image: "https://via.placeholder.com/80",
  //   },
  //   {
  //     title: "Cheesy Bacon Ranch Chicken",
  //     tags: "Keto",
  //     description: "Bacon and ranch is an absolute match made in heaven...",
  //     image: "https://via.placeholder.com/80",
  //   },
  //   {
  //       title: "Cheesy Bacon Ranch Chicken",
  //       tags: "Keto",
  //       description: "Bacon and ranch is an absolute match made in heaven...",
  //       image: "https://via.placeholder.com/80",
  //     },
  // ];

  

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (mealPlanId) => {
    setSelectedMealPlanId(mealPlanId);
    setOpenModal(true);
    // Fetch meal plan details when opening modal
    fetchMealPlanDetails(mealPlanId);
  };
  const handleCloseModal = () => setOpenModal(false);

    const ModalContent = styled(Box)(({ theme }) => ({
        width: '85vw',
        height: '90vh',
        backgroundColor: '#EEF2FE',
        borderRadius: '30px',
        padding: '2vw',
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        alignSelf: 'center'
      }));
      
      const DayColumn = styled(Box)(({ theme }) => ({
        flex: 1,
        background: 'linear-gradient(180deg, #5889BD, #99C6DB)',
        borderRadius: '20px',
        padding: '1vh 0.5vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1vh',
      }));
      
      const MealThumbnail = ({ title, src }) => (
        <Box sx={{ textAlign: 'center' }}>
          <Box
            component="img"
            src={src}
            alt={title}
            sx={{width: '8vw', borderRadius: '20px', objectFit: 'cover' }}
          />
          <Typography sx={{ fontSize: '0.9em', fontFamily: 'Merriweather', mt: 0.5 }}>{title}</Typography>
        </Box>
      );

    const [manage, setManage] = useState(false);
    const [selectedMealPlan, setSelectedMealPlan] = useState(null);
    const [day, setDay] = React.useState('');
    const [plannedMeals, setPlannedMeals] = useState({});

    const handleAddToPlan = (meal) => {
      if (!day) return;
      
      const mealId = meal.meal_id;
      if (!mealId) {
        console.error("Meal ID is missing", meal);
        return;
      }

      setPlannedMeals(prev => {
        const updatedDayMeals = prev[day] ? [...prev[day], {
          ...meal,
          meal_id: mealId // Make sure this matches your meal object structure
        }] : [{
          ...meal,
          meal_id: mealId
        }];
        return { ...prev, [day]: updatedDayMeals };
      });
    };
    

  
    
    const handleChange = (event: SelectChangeEvent) => {
        setDay(event.target.value);
        setValues({...values, day: event.target.value});
    };

    const [values, setValues] = useState({
      day: ''
    })


    //create new plan modal
    const [title, setTitle] = React.useState("");

    const [openNewPlanModal, setOpenNewPlanModal] = React.useState(false);
    const handleOpenNewPlanModal = () => setOpenNewPlanModal(true);
    const handleCloseNewPlanModal = () => setOpenNewPlanModal(false);
    const style = {
      width: 400,
          bgcolor: '#f0f4ff',
          borderRadius: 4,
          boxShadow: 24,
          p: "6vh",
          mx: 'auto',
          mt: '10vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
    };

const handleSaveNew = async () => {
  try {
    const patientId = localStorage.getItem("patientId");
    if (!patientId) {
      alert("No patient ID found");
      return;
    }

    const response = await fetch(`${apiUrl}/create-meal-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meal_plan_name: selectedOption,
        meal_plan_title: title, // or use a different title if needed
        patient_id: patientId
      })
    });

    if (!response.ok) throw new Error('Failed to create meal plan');

    // Refresh meal plans with the correct patient ID
    const refreshed = await fetch(`${apiUrl}/get-saved-meal-plans/${patientId}`);
    const  saved_meal_plans  = await refreshed.json();
        
    setMealPlans(
      saved_meal_plans.map(plan => ({
        meal_plan_id: plan.meal_plan_id,
        title: plan.title || plan.meal_plan_name,
        author: plan.made_by || "Custom", // Use creator_name from backend
        tags: plan.tag || plan.description || "Custom"
      }))
    );

    alert("Meal plan created successfully!");
    setTitle("");
    handleCloseNewPlanModal();
  } catch (error) {
    console.error("Meal plan creation failed:", error);
    alert("Could not create meal plan.");
  }
};

  const [selectedMealPlanId, setSelectedMealPlanId] = useState(null);
  const [selectedMealPlanDetails, setSelectedMealPlanDetails] = useState(null);
  

const fetchMealPlanDetails = async (mealPlanId) => {
  try {
    const response = await fetch(`${apiUrl}/meal-plan-entries?meal_plan_id=${mealPlanId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch meal plan details");
    }
    const data = await response.json();
    console.log("API Response:", data);
    
    // Initialize empty days
    const mealsByDay = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };
    
    // Also prepare initial plannedMeals state
    const initialPlannedMeals = {};
    
    // Group meals by day
    data.forEach(meal => {
      if (meal.day_of_week && mealsByDay[meal.day_of_week]) {
        mealsByDay[meal.day_of_week].push({
          ...meal,
          title: meal.meal_name,
          image: meal.image || food1
        });
        
        // Populate initial plannedMeals
        if (!initialPlannedMeals[meal.day_of_week]) {
          initialPlannedMeals[meal.day_of_week] = [];
        }
        initialPlannedMeals[meal.day_of_week].push({
          ...meal,
          title: meal.meal_name,
          meal_id: meal.meal_id,
          image: meal.image || food1
        });
      }
    });
    
    console.log("Grouped meals:", mealsByDay);
    console.log("Initial planned meals:", initialPlannedMeals);
    
    setSelectedMealPlanDetails(mealsByDay);
    return initialPlannedMeals;
  } catch (error) {
    console.error("Error fetching meal plan details:", error);
    setSelectedMealPlanDetails({
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    });
    return {};
  }
};


  const [selectedOption, setSelectedOption] = useState(""); // ✅ Add this line

  // const [mealsDay, setMealsDay] = useState([]);

  // useEffect(() => {
  //   fetch('http://127.0.0.1:5000/doctors/meal-plan-entries')
  //     .then(response => response.json())
  //     .then(data => {
  //       setMealsDay(data);
  //       console.log("Data:", data);
  //     })
  //     .catch(error => {
  //       console.error("Error fetching doctor data:", error);
  //     });
  // }, [])


const [isSaving, setIsSaving] = useState(false);


const handleSaveMealPlan = async () => {
  setIsSaving(true);
  try {
    if (!selectedMealPlan?.meal_plan_id) {
      alert("No meal plan selected");
      return;
    }

    // Prepare all assignments
    const assignments = Object.entries(plannedMeals).flatMap(([day, meals]) => 
      meals.map(meal => ({
        meal_plan_id: selectedMealPlan.meal_plan_id,
        meal_id: meal.meal_id, // Make sure this matches your meal object
        day_of_week: day
      }))
    );

    console.log("Sending assignments:", assignments); // Debug log

    // Send requests and collect responses
    const responses = await Promise.all(
      assignments.map(assignment => 
        fetch(`${apiUrl}/assign-meal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(assignment)
        })
      )
    );

    // Check for errors
    const errors = await Promise.all(
      responses.map(async res => {
        if (!res.ok) {
          const errorData = await res.json();
          return errorData.error || `HTTP ${res.status}`;
        }
        return null;
      })
    );

    const hasErrors = errors.some(err => err !== null);
    if (hasErrors) {
      console.error("Save errors:", errors);
      throw new Error("Some meals failed to save");
    }

    alert("Meal plan saved successfully!");
  } catch (error) {
    console.error("Error saving meal plan:", error);
    alert(`Could not save meal plan: ${error.message}`);
  } finally {
    setIsSaving(false);
  }
};





  return (
    <div style={{ display: "flex" }}>
      <Patient_Navbar />
      <Box sx={{ flexGrow: 1, padding: 4, height: "92vh" }}>
        <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "medium", fontFamily: 'Montserrat', fontSize: '2em' }}>
          Meal Planning
        </Typography>
        <Box display="flex" gap={4}>
          {/*This is where the UI flag change happens, so depending on if you click on manage or not. */}
          {!manage ? (
              <RoundedPanel sx={{ width: '40%' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.4}>
                  <Typography variant="h6" sx={{fontSize: '2em'}}>Meal Plans</Typography>
                  <Button onClick={handleOpenNewPlanModal} variant="contained" sx={{ backgroundColor: '#5A8BBE', borderRadius:'30px', fontFamily:'Montserrat', textTransform: 'none', fontSize:'1.05em', marginRight: '.5vw'}}>Create Plan</Button>
                  <Modal open={openNewPlanModal} onClose={handleCloseNewPlanModal}>
                    <Box
                      sx={{
                        ...style,
                        position: 'relative', // Needed for absolute positioning of close button
                      }}
                    >
                      <IconButton
                        onClick={handleCloseNewPlanModal}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          color: 'grey.600',
                        }}
                      >
                        <CloseIcon />
                      </IconButton>

                      <Typography
                        sx={{
                          textAlign: 'center',
                          fontSize: '3vh',
                          fontWeight: 'bold',
                          mb: 2,
                        }}
                      >
                        Create New Meal Plan
                      </Typography>

                      <FormControl fullWidth>
                        <TextField
                          placeholder="Enter New Title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          fullWidth
                          size="small"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          select
                          label="Select Tag"
                          value={selectedOption}
                          onChange={(e) => setSelectedOption(e.target.value)}
                          fullWidth
                          variant="outlined"
                          sx={{ mb: 2 }}
                        >
                          <MenuItem value="" disabled>
                            Select Tag
                          </MenuItem>
                          <MenuItem value="Low_Carb">Low Carb</MenuItem>
                          <MenuItem value="Keto">Keto</MenuItem>
                          <MenuItem value="Paleo">Paleo</MenuItem>
                          <MenuItem value="Mediterranean">Mediterranean</MenuItem>
                          <MenuItem value="Vegan">Vegan</MenuItem>
                          <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                          <MenuItem value="Gluten_Free">Gluten-Free</MenuItem>
                          <MenuItem value="Dairy_Free">Dairy-Free</MenuItem>
                          <MenuItem value="Weight_Loss">Weight Loss</MenuItem>
                          <MenuItem value="Weight_Gain">Weight Gain</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </TextField>
                        
                        <Button
                          onClick={handleSaveNew}
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
                          Submit
                        </Button>
                      </FormControl>
                    </Box>
                  </Modal>

                </Box>
                  <Box className='custom-scroll' sx={{height: '70vh',overflowY: 'auto', paddingRight: '.5vw'}}>
                    {mealPlans.map((plan, index) => (
                      <MealPlanCard 
                        key={index} 
                        {...plan} 
                        meal_plan_id={plan.meal_plan_id} // Make sure this is the correct ID property from your data
                        patientInfo={patientInfo}
                        onView={handleOpenModal} // This will now receive the id
                        onManage={async (meal_plan_id) => {
                          const plan = mealPlans.find(p => p.meal_plan_id === meal_plan_id);
                          setSelectedMealPlan({...plan, meal_plan_id});
                          
                          // Fetch and set initial planned meals
                          const initialPlannedMeals = await fetchMealPlanDetails(meal_plan_id);
                          setPlannedMeals(initialPlannedMeals);
                          
                          setManage(true);
                        }}
                      />
                    ))}
                  </Box>
              </RoundedPanel>
            ) : (
                <RoundedPanel sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" sx={{ fontSize: '2em' }}>Manage Meal Plan</Typography>
                  <Button
                    onClick={() => {
                      setDay('');
                      setValues({ ...values, day: ''});
                      setManage(false);}}
                    sx={{ textTransform: 'none', fontFamily: 'Montserrat' }}>
                    ← Back to Meal Plans
                  </Button>
                </Box>
                {/* Put your Manage Plan UI here */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box>
                      <Typography sx={{ fontWeight: 500, color: '#1E1E1E', fontFamily: 'Montserrat', fontSize:'1.5em' }}>
                      {selectedMealPlan?.title}
                    </Typography>
                    <Typography sx={{ fontSize: '1.2em', fontFamily: 'Merriweather', color: '#444' }}>
                      Made by: {selectedMealPlan?.author} | Tags: {selectedMealPlan?.tags}
                    </Typography>
                  </Box>
                    <Button 
                      variant="contained" 
                      onClick={handleSaveMealPlan}
                      sx={{ 
                        backgroundColor: '#5A4AA3', 
                        marginTop: 1, 
                        borderRadius: '30px', 
                        textTransform: 'none', 
                        fontSize: '1em', 
                        fontWeight:'bold', 
                        minWidth: '150px'
                      }}
                    >
                      Save
                    </Button>                
                  </Box>
                
                {!day ? (
                <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{ fontFamily: 'Merriweather', fontSize: '1.2em' }}>
                      Day of the week:
                    </Typography>
                  </Box>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={day}
                        onChange={handleChange}
                        displayEmpty
                        renderValue={(selected) => selected ? selected : "Select Day"}
                        sx={{
                          width: '200px', /* Adjust width to match input fields */
                          height: '35px', /* Match input field height */
                          textAlign: 'center',
                          backgroundColor: 'white',
                          border: '1px solid #D9D9D9',
                          fontSize: '18px',
                          paddingLeft: '5px'
                        }}
                      >
                        <MenuItem value='Monday'>Monday</MenuItem>
                        <MenuItem value='Tuesday'>Tuesday</MenuItem>
                        <MenuItem value='Wednesday'>Wednesday</MenuItem>
                        <MenuItem value='Thursday'>Thursday</MenuItem>
                        <MenuItem value='Friday'>Friday</MenuItem>
                        <MenuItem value='Saturday'>Saturday</MenuItem>
                        <MenuItem value='Sunday'>Sunday</MenuItem>
                      </Select>
                  {/* You can show savedMeals here and allow adding/removing/reordering */}
                </Box>
                ) : (
                      <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontFamily: 'Merriweather', fontSize: '1.2em' }}>
                            {day}
                          </Typography>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={day}
                            onChange={handleChange}
                            displayEmpty
                            renderValue={(selected) => selected ? selected : "Select Day"}
                            sx={{
                              width: '200px',
                              height: '35px',
                              textAlign: 'center',
                              backgroundColor: 'white',
                              border: '1px solid #D9D9D9',
                              fontSize: '18px',
                              paddingLeft: '5px'
                            }}
                          >
                            <MenuItem value='Monday'>Monday</MenuItem>
                            <MenuItem value='Tuesday'>Tuesday</MenuItem>
                            <MenuItem value='Wednesday'>Wednesday</MenuItem>
                            <MenuItem value='Thursday'>Thursday</MenuItem>
                            <MenuItem value='Friday'>Friday</MenuItem>
                            <MenuItem value='Saturday'>Saturday</MenuItem>
                            <MenuItem value='Sunday'>Sunday</MenuItem>
                          </Select>
                        </Box>

                        {/* PLANNED MEALS BELOW DROPDOWN */}
                        <Box className="custom-scroll" sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
                          {plannedMeals[day]?.map((meal, idx) => (
                            <Box key={idx} sx={{
                              backgroundColor: '#DCEBFB',
                              borderRadius: '20px',
                              padding: '1em',
                              marginBottom: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2
                            }}>
                              <img src={food1} alt={meal.title} style={{ width: 80, height: 80, borderRadius: 20 }} />
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography sx={{ fontWeight: 'bold', fontFamily: 'Montserrat' }}>{meal.title}</Typography>
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  gap={1}
                                  mt={1}
                                  sx={{ width: 'fit-content' }}
                                >
                                  <Button
                                    size="small"
                                    variant="contained"
                                    sx={{
                                      backgroundColor: '#5A8BBE',
                                      borderRadius: '20px',
                                      textTransform: 'none',
                                      fontWeight: 'bold',
                                      fontFamily: 'Montserrat',
                                      '&:hover': {
                                        backgroundColor: '#4B79A8'
                                      }
                                    }}
                                  >
                                    Go to Meal
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => {
                                      setPlannedMeals(prev => {
                                        const filtered = prev[day].filter((_, i) => i !== idx);
                                        return { ...prev, [day]: filtered };
                                      });
                                    }}
                                    sx={{
                                      backgroundColor: '#5A8BBE',
                                      borderRadius: '20px',
                                      textTransform: 'none',
                                      fontWeight: 'bold',
                                      fontFamily: 'Montserrat',
                                      '&:hover': {
                                        backgroundColor: '#4B79A8'
                                      }
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </Box>

                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>

                )}
              </RoundedPanel>
            )}
          <RoundedPanel sx={{ width: '60%', background: 'linear-gradient(109.86deg, #5889BD 6.67%, #719EC7 34.84%, #99C6DB 93.33%)' }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontSize: '2em'}}>Saved Meals</Typography>
            <Box className = 'custom-scroll' sx={{height: '70vh', overflowY: 'auto', paddingRight: '.5vw'}}>
            {savedMeals.map((meal, index) => (
              <MealCard 
                key={index} 
                meal_id={meal.meal_id}
                title={meal.title}
                tags={meal.tags}
                description={meal.description}
                image={meal.image}
                day={day}
                onAddToPlan={handleAddToPlan}
              />
            ))}
            
            </Box>
          </RoundedPanel>
        </Box>
<Modal open={openModal} onClose={handleCloseModal} sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}}>
    <ModalContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" sx={{ fontFamily: 'Montserrat', fontSize: '2em' }}>
          {selectedMealPlan?.title || `Meal Plan #${selectedMealPlanId}`}
        </Typography>
        <IconButton onClick={handleCloseModal}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box display="flex" justifyContent="space-between" gap={2} mt={4} sx={{ flexGrow: 1 }}>
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
          <DayColumn key={day}>
            <Typography sx={{ fontWeight: '500', fontFamily: 'Montserrat', fontSize: '1.5em' }}>
              {day}
            </Typography>
            {selectedMealPlanDetails && selectedMealPlanDetails[day]?.map((meal, index) => (
              <MealThumbnail 
                key={`${day}-${index}`} 
                title={meal.meal_name} 
                src={meal.image || food1}
              />
            ))}
          </DayColumn>
        ))}
      </Box>
    </ModalContent>
</Modal>
      </Box>
    </div>
  );
}

export default Patient_Mealplan;

