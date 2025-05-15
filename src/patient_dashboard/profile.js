import React, { useState, useEffect, useRef } from "react";
import Navbar from "./patient_navbar";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import GridOnIcon from '@mui/icons-material/GridOn';
import AddIcon from '@mui/icons-material/Add';
import MealCard from "./MealPlanCard"; // Make sure MealCard is exported from mealPlanCard.js
import profileBackground from "./profile_assets/profile_background.png"
import ProfileImg from "./profile_assets/profilePageImg.png"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


import { Radio, RadioGroup, Typography,Grid,Button,Box,TextField,FormControlLabel,Modal, IconButton, FormLabel, Avatar } from '@mui/material';

const apiUrl = process.env.REACT_APP_API_URL;

const Profile = () => {

      const [snackOpen, setSnackOpen] = useState(false);
      const [snackMsg, setSnackMsg] = useState("");
      const [snackType, setSnackType] = useState("error");
  
      const showSnack = (msg, type = "error") => {
        setSnackMsg(msg);
        setSnackType(type);
        setSnackOpen(true);
      };


  const [selectedTag, setSelectedTag] = useState('');
const [customTag, setCustomTag] = useState('');
  const [openCreatePost, setOpenCreatePost] = React.useState(false);

const handleOpenCreatePost = () => setOpenCreatePost(true);
const handleCloseCreatePost = () => setOpenCreatePost(false);


const [uploadedFileName, setUploadedFileName] = React.useState('');
const [patientInfo, setPatientInfo] = useState(null);
//Add post useStates
const [title, setTitle] = useState('');
const [calories, setCalories] = useState('');
const [description, setDescription] = useState('');
const [imageBase64, setImageBase64] = useState('');

const [changeTab, setChangeTab] = React.useState(0);
const handleChange = (event, newValue) => {
  setChangeTab(newValue);
};

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
const [posts, setPosts] = useState([]);
useEffect(() => {
  if (patientInfo && changeTab === 0) {
    fetchUserPosts(patientInfo.user_id);
  }
}, [changeTab, patientInfo]);


const [patientInitSurvey, setPatientInitSurvey] = useState(null);
useEffect(() => {
  const fetchInitialSurvey = async () => {
    const id =localStorage.getItem("patientId");
    if(!id){
      console.warn("No paitent ID in localStorage");
      return;
    }
    try{
      const res = await fetch(`${apiUrl}/init-patient-survey/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch patient info");
      }
      const data = await res.json();
      setPatientInitSurvey(data);
      
    }catch (error){
      console.error("Error fething patient info:", error);
    }
  };
  fetchInitialSurvey();
}, []);
const [likedPosts, setLikedPosts] = useState([]);


useEffect(() => {
  if (changeTab === 1) {
    const fetchLikedPosts = async () => {
      const patientId = localStorage.getItem("patientId");
      if (!patientId) {
        console.warn("No patient ID found in localStorage");
        return;
      }

    try {
      const response = await fetch(`${apiUrl}/posts/liked?patient_id=${patientId}`);
      const data = await response.json();

      if (data.liked_posts) {
        const postDetails = await Promise.all(
          data.liked_posts.map(async (liked) => {
            const res = await fetch(`${apiUrl}/posts/${liked.post_id}`);
            return res.json();
          })
        );

        const formattedPosts = postDetails.map(post => ({
          like_count: post.like_count,
          comment_count:post.comment_count,
          post_id: post.post_id,
          author: `${post.first_name} ${post.last_name}`,
          title: post.meal_name,
          tags: [`#${post.tag}`],
          description: post.description,
          image: `${post.picture}`,
          comments: []
        }));

        setLikedPosts(formattedPosts);
      }
    } catch (err) {
      console.error("Error fetching liked posts:", err);
    }
  };

  fetchLikedPosts();
}
}, [changeTab]);
const handleRemoveLikedPost = (postIdToRemove) => {
  setLikedPosts(prevPosts => prevPosts.filter(post => post.post_id !== postIdToRemove));
};
const [openAboutMe, setOpenAboutMe] = useState(false);
const handleOpenAboutMe = () => setOpenAboutMe(true);
const handleCloseAboutMe = () => setOpenAboutMe(false);
const fetchUserPosts = async (user_id) => {
  try {
    const res = await fetch(`${apiUrl}/posts/user/${user_id}`);
    const data = await res.json();
    const formattedPosts = data.map(post => ({
      like_count: post.like_count,
      comment_count: post.comment_count,
      post_id: post.post_id,
      author: `${post.first_name} ${post.last_name}`,
      title: post.meal_name,
      tags: [`#${post.tag}`],
      description: post.description,
      image: `${post.picture}`,
    }));
    setPosts(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

//add new post handling
const handleCreatePost = async () => {
  const user_id = patientInfo?.user_id;
  const meal_name = title;
  const meal_calories = parseInt(calories);
  const tagToSubmit = selectedTag === "Other" ? customTag : selectedTag;

  if (!user_id || !meal_name || !description || !imageBase64 || !tagToSubmit) {
    showSnack("Please fill out all fields.");
    return;
  }

  try {
    const res = await fetch(`${apiUrl}/add-post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id:user_id,
        meal_name:title,
        meal_calories:meal_calories,
        description:description,
        picture: imageBase64,
        add_tag: tagToSubmit
      })
    });
    console.log('userId',user_id);
    if (!res.ok) throw new Error("Failed to create post");

    const data = await res.json();
    console.log("Post created:", data);
    showSnack("Post successfully created!", "sucess");

    // Optional: Reset form
    setTitle('');
    setCalories('');
    setDescription('');
    setSelectedTag('');
    setCustomTag('');
    setUploadedFileName('');
    setImageBase64('');
    handleCloseCreatePost();
    fetchUserPosts(user_id); // Refresh user's posts
  } catch (error) {
    console.error("Error creating post:", error);
    showSnack("There was a problem creating the post.");
  }
};


  return (
    <Box display="flex">
      <Navbar />

      <Box sx={{ flexGrow: 1, padding: 2 }}>
        {/* Profile Header */}

<Modal open={openAboutMe} onClose={handleCloseAboutMe}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: "45vh",
      bgcolor: '#F5F7FF',
      borderRadius: '15px',
      boxShadow: 24,
      p: 3,
      textAlign: 'center'
    }}
  >
    <Typography variant="h6" sx={{ fontFamily: 'Montserrat', color: '#5E4B8B', mb: 2 }}>
      💬 About Me
    </Typography>
    <Typography sx={{ fontFamily: 'Montserrat', color: '#333', mb: 1 }}>
      <strong>Health Goal:</strong> {patientInitSurvey?.health_goals || "N/A"}
    </Typography>
    <Typography sx={{ fontFamily: 'Montserrat', color: '#333' }}>
      <strong>Favorite Food:</strong> {patientInitSurvey?.favorite_meal || "N/A"}
    </Typography>
    <Button onClick={handleCloseAboutMe} sx={{ mt: 3, bgcolor: '#A0B9DA', color: 'white', fontFamily: 'Montserrat' }}>
      Close
    </Button>
  </Box>
</Modal>

        <Box 
        sx={{
          borderTopLeftRadius:'3vh',
          borderTopRightRadius:'3vh',
          backgroundImage: `url(${profileBackground})`,
          backgroundSize: 'cover',          // Makes the image cover the whole area
          backgroundRepeat: 'no-repeat',    // Prevents tiling/repeating
          backgroundPosition: 'center',     // Centers the image
          textAlign: 'center',
          height: '25vh',                  // Make sure the Box has a height!
        }}>
          <Box sx={{padding:'4vh'}}>
            <Avatar
              src={ProfileImg}
              alt="Profile"
              sx={{ width:'15vh', height: '15vh', margin: '0 auto' }}
            />
           
           {patientInfo && patientInitSurvey &&(
  <>
    <Button onClick={handleOpenAboutMe}  sx={{ color:'white', fontFamily: 'Montserrat', fontSize: '2.5vh', textTransform: 'none' }}>ℹ️{patientInfo.first_name} {patientInfo.last_name}</Button>

  </>
)}

          </Box>
        </Box>
        <Box sx={{backgroundColor:'#EEF2FE', minHeight:'70vh'}}>
        {/* Tab Icons */}
        <Tabs value={changeTab} onChange={handleChange} aria-label="icon tabs example" centered>
      <Tab icon={<GridOnIcon />} aria-label="grid" />
      <Tab icon={<FavoriteBorderIcon />} aria-label="favorite" />
    </Tabs>

    {changeTab === 0 && (
      <>
        {/* Posts Grid */}
        <Grid container spacing={3}>
        {patientInfo && posts.slice(0, 7).map((post, index) => (
  <Grid item xs={12} sm={6} md={4} key={index}>
    <MealCard
      meal={post}
      patientInfo={{
        user_id:patientInfo.user_id,
        patient_id: patientInfo.patient_id, 
        firstName: patientInfo.first_name,
        lastName: patientInfo.last_name,
      }}
    />
  </Grid>
))}

          {/* Add New Post Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              onClick={handleOpenCreatePost}

              sx={{
                height: '55vh',
                maxWidth: '43vh',
                borderRadius: '20px',
                backgroundColor: '#A0B9DA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                cursor: 'pointer',
                color: 'white',
                textAlign: 'center',
                mx:4,
                 my:2
              }}
            >
              <Typography variant="h6" sx={{ fontFamily: 'Montserrat' }}>Add New Post</Typography>
              <AddIcon sx={{ fontSize: 40 }} />
            </Box>
          </Grid>


        </Grid></>
        
      )}
        <Modal open={openCreatePost} onClose={handleCloseCreatePost}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "65vh",
        bgcolor: '#F5F7FF',
        borderRadius: '15px',
        boxShadow: 24,
        overflow: 'hidden', // so the header is connected
      }}
    >
    {/* Header */}
    <Box sx={{ bgcolor: '#5E4B8B', p:'.5vh', display: 'flex', alignItems: 'center' }}>
      <Typography sx={{flexGrow:'1',textAlign:"center", color: 'white', fontWeight: 'bold', fontFamily: 'Montserrat' }}>
        Create Post
      </Typography>
      <IconButton onClick={handleCloseCreatePost} sx={{ color: 'white' }}>
        ✕
      </IconButton>
    </Box>

    {/* Body */}
    <Box sx={{ p: 3 }}>
{/* Upload Button and File Name */}
<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
  <Button
    variant="contained"
    component="label"
    sx={{ bgcolor: '#A0B9DA', width: '29%' ,textAlign:'center'}}
  >
    Upload Image File
<input 
  hidden 
  accept="image/*" 
  type="file" 
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
reader.onloadend = () => {
  const result = reader.result;
  if (typeof result === "string" && result.includes(',')) {
    const base64Only = result.split(',')[1]; // 👈 only get base64
    console.log('imageulr', base64Only)
    setImageBase64(base64Only);
  } else {
    console.warn("Unexpected file format for base64 image.");
  }
};
      reader.readAsDataURL(file);
    }
  }}
/>

  </Button>

  {/* File name shown to the right of button */}
  {uploadedFileName && (
    <Typography sx={{ fontSize: '0.9rem', color: '#5E4B8B', fontWeight: 'bold' }}>
      {uploadedFileName}
    </Typography>
  )}
</Box>


<Box display={"flex"}> 
<Typography sx={{ color: 'white',  fontFamily: 'Montserrat', bgcolor: '#A0B9DA', width: '44%' ,textAlign:'center', height:'6.7vh', borderRadius:'.5vh' }}>
      Title
</Typography>    
  <TextField fullWidth label="Title" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ml:2, mb: 2 }} />
</Box>


<Box sx={{mt:'2vh', mb: 2 , display:'flex'}}>
  <FormLabel component="legend" sx={{mr:'2vh',color: 'white',  fontFamily: 'Montserrat', bgcolor: '#A0B9DA', width: '30%' ,textAlign:'center', height:'6.7vh', borderRadius:'.5vh' }}>Hashtags</FormLabel>
<RadioGroup
  column
  value={selectedTag}
  onChange={(e) => setSelectedTag(e.target.value)}
>
  <FormControlLabel value="Keto" control={<Radio />} label="#Keto" />
  <FormControlLabel value="Vegan" control={<Radio />} label="#Vegan" />
  <FormControlLabel value="Paleo" control={<Radio />} label="#Paleo" />
  <FormControlLabel value="Low-Carbs" control={<Radio />} label="#Low-Carbs" />
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <FormControlLabel value="Other" control={<Radio />} label="Other" />
    {selectedTag === "Other" && (
      <TextField
        size="small"
        label="Other"
        //variant="outlined"
        value={customTag}
        onChange={(e) => setCustomTag(e.target.value)}
      />
    )}
  </Box>
</RadioGroup>

</Box>
<Box sx={{mb:'2vh'}}display={"flex"}> 
<Typography sx={{ color: 'white',  fontFamily: 'Montserrat', bgcolor: '#A0B9DA', width: '44%' ,textAlign:'center', height:'6.7vh', borderRadius:'.5vh' }}>
        Calories
</Typography>    
  <TextField fullWidth label="Number of calories" variant="outlined" value={calories}   onChange={(e) => setCalories(e.target.value)}
 sx={{ml:2, mb: 2 }} />
</Box>
<Box display={'flex'}>
<Typography sx={{ color: 'white',  fontFamily: 'Montserrat', bgcolor: '#A0B9DA', width: '45%' ,textAlign:'center', height:'6.7vh', borderRadius:'.5vh' }}>
        Description
</Typography> 
      <TextField
        fullWidth
        label="Description"
        multiline
        rows={8}
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ ml: '2vh' , mb:'2vh'}}
      />
</Box>
      <Button
        fullWidth
        variant="contained"
        onClick={handleCreatePost}
        sx={{
          bgcolor: '#A0B9DA',
          '&:hover': { bgcolor: '#8CAACF' },
          borderRadius: '10px',
          fontWeight: 'bold'
        }}
      >
        POST
      </Button>
    </Box>
  </Box>
</Modal>
{changeTab === 1 && (
  <Grid container spacing={3}>
    {likedPosts.length > 0 ? (
      likedPosts.map((post, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <MealCard
            meal={post}
            patientInfo={{
              user_id:patientInfo.user_id,
              patient_id: patientInfo.patient_id,
              firstName: patientInfo.first_name,
              lastName: patientInfo.last_name,
            }}
            removeFromLikedPosts={handleRemoveLikedPost}
          />
        </Grid>
      ))
    ) : (
      <Grid item xs={12} textAlign="center">
        <Box
          sx={{
            backgroundColor: '#F5F7FF',
            border: '2px dashed #A0B9DA',
            borderRadius: '15px',
            padding: '5vh',
            display: 'inline-block',
          }}
        >
          <FavoriteBorderIcon sx={{ fontSize: 60, color: '#A0B9DA', mb: 2 }} />
          <Typography variant="h5" sx={{ color: '#5E4B8B', fontFamily: 'Montserrat', fontWeight: 'bold' }}>
            No Liked Posts Yet
          </Typography>
          <Typography sx={{ color: '#7A7A7A', mt: 1, fontFamily: 'Montserrat' }}>
            Start exploring and like some posts!
          </Typography>
        </Box>
      </Grid>
    )}
  </Grid>
)}


      </Box>
    </Box>
    </Box>
  );
};

export default Profile;
