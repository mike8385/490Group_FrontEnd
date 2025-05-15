import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  IconButton,
  Grid,
  Divider
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import MealCardPatient from "./patient_dashboard/MealPlanCard"; // Make sure MealCardPatient is exported from mealPlanCard.js
import MealCardDoctor from "./doctor_dashboard/MealPlanCard";
import PatientNavbar from './patient_dashboard/patient_navbar';
import DoctorNavbar from './doctor_dashboard/doctor_navbar';
import CommunityImg from './community_homepage_img.png';
import food1 from "./reciepe photo.png";
const apiUrl = process.env.REACT_APP_API_URL;

export default function CommunityForum() {

  const [isDoctor, setIsDoctor] = useState(true); // 👈 clearer flag
  const MealCardComponent = isDoctor ? MealCardDoctor : MealCardPatient;

  useEffect(() => {
    console.log("localStorage snapshot:", { 
      doctorId: localStorage.getItem("doctorId"), 
      patientId: localStorage.getItem("patientId") 
    });
    
    const patientId = localStorage.getItem("patientId");
    console.log("tets",patientId)
    const doctorId = localStorage.getItem("doctorId");
    console.log("docs",doctorId)

    if (doctorId && doctorId !== 'undefined') {
      console.log('in here')
      setIsDoctor(true);  // 👈 doctor is logged in
    } else {
      setIsDoctor(false); // 👈 patient is logged in
    }
  }, []);
const [doctorUserId, setDoctorUserId] = useState(null);
useEffect(() => {
  const doctorId = localStorage.getItem("doctorId");
  const patientId = localStorage.getItem("patientId");

  if (doctorId && doctorId !== 'undefined') {
    setIsDoctor(true);

    // Fetch doctor user_id
    fetch(`${apiUrl}/user?doctor_id=${doctorId}`)
      .then(res => res.json())
      .then(data => {
        setDoctorUserId(data.user_id); // Save it to state
        console.log("Doctor user ID:", data.user_id);
      })
      .catch(err => console.error("Failed to fetch doctor user_id", err));
  } else {
    setIsDoctor(false);
  }
}, []);

const [patientInfo, setPatientInfo] = useState(null);
//if doctor fetch doctor infor
const [doctorInfo, setDoctorInfo] = useState(null);
useEffect(() => {
  const fetchPatientInfo = async () => {
    const id = localStorage.getItem("patientId");
    if (!id) {
      console.warn("No patient ID in localStorage");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/patient/${id}`);
      if (!res.ok) throw new Error("Failed to fetch patient info");
      const data = await res.json();
      setPatientInfo(data);
      console.log("Patient info:", data);
    } catch (error) {
      console.error("Error fetching patient info:", error);
    }
  };

  const fetchDoctorInfo = async () => {
    const id = localStorage.getItem("doctorId");
    if (!id) {
      console.warn("No doctor ID in localStorage");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/doctor/${id}`);
      if (!res.ok) throw new Error("Failed to fetch doctor info");
      const data = await res.json();
      setDoctorInfo(data);
      console.log("Doctor info:", data);
    } catch (error) {
      console.error("Error fetching doctor info:", error);
    }
  };

  if (isDoctor) {
    fetchDoctorInfo();
  } else {
    fetchPatientInfo();
  }
}, [isDoctor]);




const [posts, setPosts] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
const [filteredPosts, setFilteredPosts] = useState([]);
const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch(`${apiUrl}/posts`) // Update if your API base URL is different
      .then(res => res.json())
      .then(data => {
        const formattedPosts = data.map(post => ({
          like_count:post.like_count,
          comment_count:post.comment_count,
          post_id: post.post_id,
          author: `${post.first_name} ${post.last_name}`,
          title: post.meal_name,
          tags: [`#${post.tag}`],
          description: post.description,
          image: `${post.picture}`, // Assuming JPEG, adjust if needed
        }));
        setPosts(formattedPosts);
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
      });
  }, []);
  useEffect(() => {
  const query = searchQuery.toLowerCase();

  const results = posts.filter(post => {
    if (selectedCategory === "Title") {
      return post.title.toLowerCase().includes(query);
    }

    if (selectedCategory === "Tags") {
      return post.tags.some(tag => tag.toLowerCase().includes(query));
    }

    if (selectedCategory === "User") {
      return post.author.toLowerCase().includes(query);
    }

    // If "All" is selected or default
    return (
      post.title.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  setFilteredPosts(results);
}, [searchQuery, selectedCategory, posts]);



    //pagination
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 12;
const displayedPosts = (filteredPosts.length > 0 ? filteredPosts : posts);
const totalPages = Math.ceil(displayedPosts.length / itemsPerPage);
const paginatedPosts = displayedPosts.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
  return (
    
    <Box >
       {isDoctor ? <DoctorNavbar /> : <PatientNavbar />}

      <Box sx={{  p: 4 ,p: 3, display: 'flex', backgroundColor: '#e6eeff', borderRadius: '3vh', m: '3vh', minHeight: '100vh',ml:'15vh' }}>
        {/* Header */}
       
        <Box sx={{}}>
        <Box sx={{display:'flex', mb:'10vh'}}>
        <Box sx={{flexGrow:1}}>
          <Typography fontSize={52} textAlign= 'left' fontWeight="bold" color="#5889BD" >
            Community Forum
          </Typography>
          <Typography sx={{ maxWidth: '75%', mb:'3vh' }}>
            Connect with other users to blah blahblah Connect with other users to blah blahblah Connect with other users to blah blahblah
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
  <Box
    sx={{
      display: 'flex',
      gap: 0,
      mb: 4,
      borderRadius: '1vh',
      overflow: 'hidden',
      backgroundColor: 'white',
      boxShadow: 1,
      width: '500px' // adjust this as needed (try 400px–600px)
    }}
  >
<TextField
  select
  size="small"
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  sx={{
    minWidth: 120,
    backgroundColor: 'white',
    borderTopLeftRadius: '1vh',
    borderBottomLeftRadius: '1vh',
    '& fieldset': { border: 'none' }
  }}
>
  <MenuItem value="All">Categories</MenuItem>
  <MenuItem value="Title">Title</MenuItem>
  <MenuItem value="Tags">Tag</MenuItem>
  <MenuItem value="User">User</MenuItem>
</TextField>


    <TextField
      placeholder="Search ..."
      variant="outlined"
      size="small"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={{
        flexGrow: 1,
        backgroundColor: 'white',
        '& fieldset': { border: 'none' }
      }}
    />

    <Button
      variant="contained"
      sx={{
        backgroundColor: '#444',
        borderRadius: 0,
        color: 'white',
        px: 3,
        textTransform: 'none',
        fontWeight: 600,
        borderTopRightRadius: '1vh',
        borderBottomRightRadius: '1vh',
        '&:hover': { backgroundColor: '#333' }
      }}
    >
      Search
    </Button>
  </Box>
</Box>


          </Box>
          <Box
            component="img"
            src={CommunityImg}
            alt="community illustration"
            sx={{
              width: '450',
              //float: 'right',
              mt: -5,
              mr: 2,
              display: { xs: 'none', md: 'block' }
            }}
          />

          </Box>
          <Divider sx={{ height:'.1vh', width: '100%', my: 4 , background: 'rgba(0, 0, 0, 0.37)'}} />

                {/* Featured */}
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Featured
        </Typography>

<Grid container spacing={3}>
  {paginatedPosts.map((post, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <MealCardComponent
        meal={post}
        {...(!isDoctor
          ? {
              patientInfo: {
                user_id: patientInfo?.user_id,
                patient_id: patientInfo?.patient_id,
                firstName: patientInfo?.first_name,
                lastName: patientInfo?.last_name,
              }
            }
          : {
              doctorInfo: {
                user_id: isDoctor ? doctorUserId : undefined,
                doctor_id: doctorInfo?.doctor_id,
                firstName: doctorInfo?.first_name,
                lastName: doctorInfo?.last_name,
              }
            })}
      />
    </Grid>
  ))}
</Grid>


        <Box display="flex" justifyContent="center" mt={4}>
  <Pagination
    count={totalPages}
    page={currentPage}
    onChange={(event, value) => setCurrentPage(value)}
    color="primary"
  />
</Box>
        </Box>

    


      </Box>
    </Box>
  );
}

