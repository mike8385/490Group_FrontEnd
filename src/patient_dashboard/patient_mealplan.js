import React, { useState } from "react";
import Patient_Navbar from "./patient_navbar";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Typography, Button, Divider } from "@mui/material";
import food1 from "./meals/food1.png";
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';




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


const RoundedPanel = styled(Paper)(({ theme }) => ({
  borderRadius: '30px',
  padding: '2vw',
  height: '85vh',
  backgroundColor: '#EEF2FE',
}));


const MealPlanCard = ({ title, author, tags, onView, onManage, onDelete }) => (
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
      <Typography sx={{ fontWeight: '500', color: 'white', fontFamily: 'Montserrat', fontSize: '1.4em' }}>{title}</Typography>
      <Typography sx={{ color: 'white', fontFamily: 'Merriweather', fontSize: '1.2em' }}>Made by: {author}</Typography>
      <Typography sx={{ color: 'white', fontFamily: 'Merriweather', fontSize: '1.2em' }}>Tags: {tags}</Typography>
    </Box>
    <Box display="flex" gap={1}>
      <Button
        variant="contained"
        onClick={onView}
        sx={{
          backgroundColor: '#5A4AA3',
          fontFamily: 'Montserrat',
          borderRadius: '30px',
          textTransform: 'none',
          fontWeight: 400,
          fontSize: '1.3em',
        }}
      >
        View
      </Button>
      <Button
        variant="contained"
        onClick={onManage}
        sx={{
          backgroundColor: '#5A4AA3',
          fontFamily: 'Montserrat',
          borderRadius: '30px',
          textTransform: 'none',
          fontWeight: 400,
          fontSize: '1.3em',
        }}
      >
        Manage
      </Button>
      <Button
        variant="contained"
        onClick={onDelete}
        size="small"
        sx={{
          backgroundColor: '#A33F3F',
          fontFamily: 'Montserrat',
          borderRadius: '30px',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.75em',        // smaller text
          padding: '4px 8px',        // thinner padding
          minWidth: '64px',          // or set exact width like '50px' to make it tighter
          height: '32px',            // keeps button compact
          lineHeight: 1,
        }}
      >
        Delete
      </Button>

    </Box>
  </Box>
);


const MealCard = ({ title, tags, description, image, day, onAddToPlan}) => {
        const handleClick = () => {
          if (day) {
            onAddToPlan({ title, tags, description, image });
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
  // Temporary mock data
  const [mealPlans, setMealPlans] = useState([
    { title: "Meal plan #1", author: "Dr. Song", tags: "Keto" },
    { title: "Meal plan #2", author: "Natasha", tags: "Keto" },
  ]);
  

  const savedMeals = [
    {
      title: "Cauliflower Fried Rice",
      tags: "Keto",
      description: "Fried rice is a classic and comforting recipe that everyone loves...",
      image: "https://via.placeholder.com/80", // Replace with actual image URLs later
    },
    {
      title: "Cheesy Broccoli Cheddar Spaghetti Squash",
      tags: "Keto",
      description: "Cheesy broccoli in any form is our ultimate comfort food...",
      image: "https://via.placeholder.com/80",
    },
    {
      title: "Cheesy Bacon Ranch Chicken",
      tags: "Keto",
      description: "Bacon and ranch is an absolute match made in heaven...",
      image: "https://via.placeholder.com/80",
    },
    {
        title: "Cheesy Bacon Ranch Chicken",
        tags: "Keto",
        description: "Bacon and ranch is an absolute match made in heaven...",
        image: "https://via.placeholder.com/80",
      },
  ];

  const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => setOpenModal(true);
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



    // Manage MealPlans
    const [manage, setManage] = useState(false);
    const [selectedMealPlan, setSelectedMealPlan] = useState(null);
    const [day, setDay] = React.useState('');
    const [plannedMeals, setPlannedMeals] = useState({});

    const handleAddToPlan = (meal) => {
      if (!day) return;
    
      setPlannedMeals(prev => {
        const updatedDayMeals = prev[day] ? [...prev[day], meal] : [meal];
        return { ...prev, [day]: updatedDayMeals };
      });
    };
    


    
    const handleChange = (event: SelectChangeEvent) => {
        setDay(event.target.value);
        setValues({...values, day: event.target.value});
    };


    const [tag, setTag] = React.useState('');


    const [values, setValues] = useState({
      day: ''
    })


//Create meal plans
    const [create, setCreate] = useState(false);

    const [openCreate, setOpenCreate] = React.useState(false);
    const handleOpen = () => setOpenCreate(true);
    const handleClose = () => setOpenCreate(false);
    
    const handleChange2 = (event: SelectChangeEvent) => {
      setTag(event.target.value);
      setNewPlanData({...newPlanData, tag: event.target.value});
  };


    const [newPlanData, setNewPlanData] = useState({
      title: '',
      author: '',
      tag: ''
    });


//Delete mealplan

const handleDeleteMealPlan = (indexToDelete) => {
  const planToDelete = mealPlans[indexToDelete];

  // Frontend delete
  setMealPlans(prev => prev.filter((_, i) => i !== indexToDelete));

  // Backend delete (you'll need Flask route)
  fetch('/api/delete-mealplan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: planToDelete.title })  // or use an `id` if available
  })
  .then(res => res.json())
  .then(data => {
    console.log('Deleted from backend:', data);
  })
  .catch(err => {
    console.error('Failed to delete meal plan:', err);
  });
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
                  <Button variant="contained" onClick={handleOpen} sx={{ backgroundColor: '#5A8BBE', borderRadius:'30px', fontFamily:'Montserrat', textTransform: 'none', fontSize:'1.05em', marginRight: '.5vw'}}>Create Plan</Button>
                        <Modal
                            open={openCreate}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box sx={style}>
                              <Typography id="modal-modal-title" variant="h6" component="h2" color="black">
                                Create Plan
                              </Typography>
                                  <Button
                                    onClick={() => {
                                      setTag('');
                                      setNewPlanData({ ...values, day: ''});
                                      setCreate(false);}}
                                    sx={{ textTransform: 'none', fontFamily: 'Montserrat' }}>
                                    ← Back to Meal Plans
                                  </Button>
                                    <div className='labels'>
                                        <label className = 'def-label' htmlFor="first_name">Title: </label>
                                        <input type='text'
                                        name='title'
                                        className="form-control" 
                                        placeholder='Enter title'
                                        value={newPlanData.title}
                                        
                                        onChange={e => setNewPlanData({...newPlanData, title: e.target.value})}/>
                                    </div>
                                    <div className='labels'>
                                        <label className = 'def-label' htmlFor="first_name">Author: </label>
                                        <input type='text'
                                        name='author'
                                        className="form-control" 
                                        placeholder='Enter author'
                                        value={newPlanData.author}
                                        onChange={e => setNewPlanData({...newPlanData, author: e.target.value})}/>
                                    </div>
                                    <Box>
                                    <Typography sx={{ fontFamily: 'Merriweather', fontSize: '1.2em' }}>
                                      Tag:
                                    </Typography>
                                  </Box>
                                      <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={newPlanData.tag}
                                        onChange={handleChange2}
                                        displayEmpty
                                        renderValue={(selected) => selected ? selected : "Select Tag"}
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
                                        <MenuItem value='Keto'>Keto</MenuItem>
                                        <MenuItem value='Low-Carb Diet'>Low-Carb Diet</MenuItem>
                                        <MenuItem value='Paleo Diet'>Paleo Diet</MenuItem>
                                        <MenuItem value='Vegan'>Vegan</MenuItem>

                                      </Select>
                                      <Button
                                        variant="contained"
                                        sx={{ mt: 2, borderRadius: '30px', textTransform: 'none', fontFamily: 'Montserrat', backgroundColor: '#5A8BBE' }}
                                        onClick={() => {
                                          // 1. Add the new plan to the list
                                          const newPlan = {
                                            title: newPlanData.title,
                                            author: newPlanData.author,
                                            tags: newPlanData.tag
                                          };
                                          // If you want to dynamically store:
                                          //mealPlans.push(newPlan); // OR: setMealPlans([...mealPlans, newPlan]) if it's a state later
                                          setMealPlans(prev => [...prev, newPlan]);

                                          // 2. Reset form
                                          setNewPlanData({ title: '', author: '', tag: '' });
                                          setTag('');

                                          // 3. Close modal
                                          setOpenCreate(false);
                                        }}
                                      >
                                        Create
                                      </Button>

                            </Box>
                          </Modal>
                </Box>
                <Box className = 'custom-scroll' sx={{height: '70vh',overflowY: 'auto', paddingRight: '.5vw'}}>
                {mealPlans.map((plan, index) => (
                  <MealPlanCard
                    key={index}
                    {...plan}
                    onView={handleOpenModal}
                    onManage={() => {
                      setSelectedMealPlan(plan);
                      setManage(true);
                    }}
                    onDelete={() => handleDeleteMealPlan(index)}
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
                  <Button variant="contained" sx={{ backgroundColor: '#5A4AA3', marginTop: 1, borderRadius: '30px', textTransform: 'none', fontSize: '1em', fontWeight:'bold', minWidth: '150px'}}>Save</Button>
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
              <MealCard key={index} {...meal} day={day} onAddToPlan={handleAddToPlan}/>
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
                <Typography variant="h5" sx={{ fontFamily: 'Montserrat', fontSize: '2em' }}>Meal Plan #1</Typography>
                <IconButton onClick={handleCloseModal}>
                    <CloseIcon />
                </IconButton>
                </Box>

                <Box display="flex" justifyContent="space-between" gap={2} mt={4} sx={{ flexGrow: 1 }}>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, i) => (
                    <DayColumn key={day}>
                    <Typography sx={{ fontWeight: '500', fontFamily: 'Montserrat', fontSize: '1.5em' }}>{day}</Typography>
                    {day === "Thursday" && (
                        <>
                        <MealThumbnail title="Cauliflower Fried Rice" src={food1} />
                        <MealThumbnail title="Cheesy Broccoli Cheddar Spaghetti Squash" src={food1} />
                        </>
                    )}
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
