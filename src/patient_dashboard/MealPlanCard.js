import React, { useState,useRef, useEffect } from 'react';
import {
  Card, Box,CardHeader, CardMedia, CardContent, CardActions,
  IconButton, Typography, Collapse, Avatar, Chip, TextField, Button
} from '@mui/material';
import testImage from './reciepe photo.png'
import { Favorite, ExpandMore, ChatBubbleOutline } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton as MuiIconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
const apiUrl = process.env.REACT_APP_API_URL;


export default function MealPlanCard({ meal, patientInfo, removeFromLikedPosts }) {
  console.log("Meal object:", meal);

  const {
    image = '',
    title = 'Untitled',
    tags = [' #Test'],
    description = 'No description available.No description available.No description available.No description available.No description available.No description available.No description available.No description available.No description available.No description available.No description available.No description available.No description available.No description available.No description available.No description',
    author = 'Unknown',
    likes: initialLikes = 0,
    comments: initialcomments = [
      { firstName: 'John', lastName: 'Doe', text: 'hi' },
      { firstName: 'Jane', lastName: 'Smith', text: 'hello' },
    ],
        fullRecipe = '',
    user = {},
    ingredients = [],
    directions = [],
  } = meal || {};

  //const [expanded, setExpanded] = useState(false);
  //const [likes, setLikes] = useState(meal.likes);
  const [comments, setComments] = useState(meal.comments || []);
  const [newComment, setNewComment] = useState("");
  const [commentCount, setCommentCount]= useState(0);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
const [liked, setLiked] = useState( false);
  const [added, setAdded] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [expanded, setExpanded] = useState(false);

const handleExpandClick = async () => {
  setExpanded(!expanded);
  const post_id = meal.post_id;

  if (!commentsLoaded) {
    try {
      const response = await fetch(`${apiUrl}/posts/comment/${post_id}`);
      const data = await response.json();

      if (response.ok) {
        const formattedComments = data.map(comment => ({
          firstName: comment.first_name,
          lastName: comment.last_name,
          text: comment.comment_text,
          created_at: comment.created_at
        }));

        setComments(formattedComments);
        setCommentsLoaded(true);
      } else {
        console.error("Failed to load comments:", data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }
};
  //const handleLike = () => setLikes(likes + 1);

  const handleAddComment = async () => {
  const post_id=meal.post_id
  const user_id = patientInfo.user_id
  console.log('here', user_id);
  if (newComment.trim() === "") return;
  const commentData = {
    post_id: post_id,
    user_id: user_id,  
    comment_text: newComment
  };

  try {
    const response = await fetch(`${apiUrl}/posts/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commentData)
    });

    const data = await response.json();

    if (response.status === 201) {
      const newCommentObj = {
        post_id:post_id,
        firstName: patientInfo.firstName,
        lastName: patientInfo.lastName,
        text: newComment,
        created_at: new Date().toISOString()  // or use data.created_at if returned
      };
      console.log("successfully added comment to backend")

      setComments([newCommentObj, ...comments]);
      setNewComment("");
      
      //add code ot chnage the comment count in the database
      const updatedPostRes = await fetch(`${apiUrl}/posts/${post_id}`);
      const updatedPost = await updatedPostRes.json();

      if (updatedPostRes.ok && updatedPost.comment_count !== undefined) {
        setCommentCount(updatedPost.comment_count);
      }else {
      console.error("Failed to add comment:", data);
      }
    } else {
      console.error("Failed to add comment:", data);
    }
  } catch (error) {
    console.error("Error while adding comment:", error);
  }
};

useEffect(() => {
  if (meal.comment_count !== undefined) {
    setCommentCount(meal.comment_count);
  }
  if (meal.like_count !== undefined) {
    setLikeCount(meal.like_count);
  }
}, [meal.comment_count, meal.like_count]);


useEffect(() => {
  const post_id = meal?.post_id;
  const user_id = patientInfo?.user_id;
  if (!post_id || !user_id) return;

  const checkIfLiked = async () => {
    try {
      const response = await fetch(`${apiUrl}/posts/is-liked`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          post_id,
          user_id: user_id
        })
      });

      const data = await response.json();
      if (response.ok) {
        setLiked(data.is_liked);
      } else {
        console.error("Failed to fetch liked status:", data);
        setLiked(false);
      }
    } catch (error) {
      console.error("Error checking if post is liked:", error);
      setLiked(false);
    }
  };

  checkIfLiked();
}, [meal?.post_id, patientInfo?.user_id]);

  

const handleLike = async () => {
    
    const post_id = meal.post_id;
    const patient_id = patientInfo.patient_id; // assuming this is passed correctly
  

    if (!post_id || !patient_id) {
      console.error("Missing post_id or patient_id");
   
      return;
    }
    const wasLiked = liked;
    setLiked(!wasLiked)
    try {
      if(!wasLiked){
        
          console.log('Sending like request:', {
          post_id: meal.post_id,
          patient_id: patientInfo?.patient_id,
          "doctor_id": null,
        });      const response = await fetch(`${apiUrl}/posts/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            post_id: post_id,
            patient_id:patient_id,
            doctor_id: null,
          }),
        });
    
        const data = await response.json();
        
        if (response.status === 201) {
    
          //setLiked(true);
          console.log("Post  successfully liked:", data);

          const updatedPostRes = await fetch(`${apiUrl}/posts/${post_id}`);
          const updatedPost = await updatedPostRes.json();

          if (updatedPostRes.ok && updatedPost.like_count !== undefined) {
            setLikeCount(updatedPost.like_count);
          }
         else {
          console.error("Failed to update like:", data);
        }

        }else {
          console.error("Like failed:", data);
        }
      }else {
      // Unliking the post
      const response = await fetch(`${apiUrl}/posts/unlike`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: post_id,
          patient_id: patient_id,
          doctor_id: null,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        const updatedPostRes = await fetch(`${apiUrl}/posts/${post_id}`);
      const updatedPost = await updatedPostRes.json();

        if (updatedPostRes.ok && updatedPost.like_count !== undefined) {
          setLikeCount(updatedPost.like_count);
        }
      else {
        console.error("Failed to update like:", data);
      }
        console.log("Post unliked successfully:", data);
        localStorage.removeItem(`liked-${post_id}`);
        if (typeof removeFromLikedPosts === 'function') {
          removeFromLikedPosts(post_id);
        }
      } else {
        console.error("Unlike failed:", data);
      }
    }
    } catch (error) {
      console.error("Error while liking post:", error);
    }
  };
  

const commentInputRef = useRef(null);
const handleCommentIcon = () => {
  handleOpenModal(); // Make sure to call the function (add parentheses)
  
  // Focus after a short delay to ensure modal has rendered
  setTimeout(() => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, 100);
};
useEffect(() => {
  const checkIfSaved = async () => {
    const post_id = meal?.post_id;
    const user_id = patientInfo?.patient_id;

    if (!post_id || !user_id) return;

    try {
      const response = await fetch(`${apiUrl}/posts/is-saved`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ post_id, user_id })
      });

      const data = await response.json();
      if (response.ok) {
        setAdded(data.is_saved);
      } else {
        console.error("Failed to check saved state:", data);
      }
    } catch (error) {
      console.error("Error checking saved state:", error);
    }
  };

  checkIfSaved();
}, [meal?.post_id, patientInfo?.patient_id]);

const handleAddToMealPlan = async () => {
  const post_id = meal?.post_id;
  const user_id = patientInfo?.user_id;

  if (!post_id || !user_id) {
    console.error("Missing post_id or user_id");
    return;
  }

  try {
    if (!added) {
      // Save the meal
      const response = await fetch(`${apiUrl}/posts/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ post_id, user_id })
      });

      const data = await response.json();

      if (response.ok) {
        setAdded(true);
        console.log("Meal saved:", data);
      } else {
        console.error("Failed to save meal:", data);
      }
    } else {
      // Unsaving logic (DELETE request — you need a backend endpoint for this)
      const response = await fetch(`${apiUrl}/posts/unsave`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ post_id, user_id })
      });

      const data = await response.json();

      if (response.ok) {
        setAdded(false);
        console.log("Meal unsaved:", data);
      } else {
        console.error("Failed to unsave meal:", data);
      }
    }
  } catch (error) {
    console.error("Error while toggling saved state:", error);
  }
};


  //Modal to View Full Reciepe
const [openModal, setOpenModal] = useState(false);
const handleOpenModal = () => {
  setOpenModal(true);
  handleExpandClick();
};
const handleCloseModal = () => setOpenModal(false);

  return (
    <>
    <Card sx={{ maxWidth: '43vh', height:'55vh', mx:4, my:2 }}>
  
      <CardMedia component="img"  image={testImage} style={{padding:4}} alt={title} />
      
      <CardContent>
      <div style={{ marginBottom: 8 }}>
      <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 600, cursor:'pointer' }} onClick={handleOpenModal} >{title}</Typography>
      <Box mt={1} display="flex" alignItems="center" gap={1}>

    {tags.map(tag => (
        <Typography sx={{ fontSize: '0.9em', color: '#777' }}>{tag}</Typography>
       ))}
    </Box>  
     </div>      
     <Typography
  sx={{
    flexGrow:1,
    maxHeight: '7vh',
    minHeight:'7vh',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 5, // Adjust the number of visible lines
    WebkitBoxOrient: 'vertical',
    mt: 1, 
    fontSize: '0.9em'
  }}
>
  {description}
</Typography>

<Box flexGrow={1} mt={3} display="flex" alignItems="center" gap={1}>
        {<Avatar sx={{height:'3vh', width:'3vh'}} src={user.avatar} />}
        
          <Typography
            onClick={handleExpandClick}
            sx={{flexGrow:1,fontSize: '0.8em', cursor: 'pointer' }}
          >
            {author}
          </Typography>
        
         <IconButton onClick={handleAddToMealPlan}
  sx={{
    backgroundColor: added ? 'lightgrey' : 'transparent', // 👈
  
  }}
>
  <LibraryAddOutlinedIcon color={'action'} />
          </IconButton>
          <Box position="relative" display="inline-flex">
  <IconButton onClick={handleLike}>
    {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
  </IconButton>
  
    <Typography
      variant="caption"
      sx={{
         position: 'absolute',
        top: 2,
        right: 2,
        fontSize: '0.7rem',
        backgroundColor: 'transparent',
        borderRadius: '50%',
        padding: '0 4px',
      }}
    >
      {likeCount}
    </Typography>
  
</Box>

<Box position="relative" display="inline-flex">
 
  <IconButton onClick={handleCommentIcon}>
    <ChatBubbleOutline />
  </IconButton>
  
    <Typography
      variant="caption"
      sx={{
        position: 'absolute',
        right: -1,
        fontSize: '0.7rem',
        backgroundColor: 'transparent',
        borderRadius: '50%',
        px: 0.5,
      }}
    >
      {commentCount}
    </Typography>
  
</Box>
        </Box>


      </CardContent>
  
    </Card>
<Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">


  <DialogContent
    sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '95vh',
      p: 0,
    }}
  >
    {/* Fixed Image at Top */}
    <CardMedia
      component="img"
      image={testImage}
      alt={title}
      sx={{ width: '100%', maxHeight: '40vh', objectFit: 'cover' }}
    />

    {/* Scrollable Description */}
    <Box
      className='custom-scroll'
      sx={{
        overflowY: 'auto',
        flexGrow: 1,
        px: 2,
        py: 1,
      }}
    >
    <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 600, cursor:'pointer' }} >{title}</Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {tags.join(' ')}
      </Typography>
      <Typography paragraph sx={{ fontSize: '0.9em' }}>
        {description}
      </Typography>
    </Box>

    {/* Scrollable Comments Section */}
    <Box
      sx={{
        borderTop: '1px solid #ccc',
        px: 2,
        py: 1,
        maxHeight: '25vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Comments
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
        <Box position="relative" display="inline-flex">
        <IconButton onClick={handleAddToMealPlan}
  sx={{
    backgroundColor: added ? 'lightgrey' : 'transparent', // 👈
  
  }}
>
  <LibraryAddOutlinedIcon color={'action'} />
          </IconButton>     
  <IconButton onClick={handleLike}>
    {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
  </IconButton>
    <Typography
      variant="caption"
      sx={{
        position: 'absolute',
        top: 2,
        right: 2,
        fontSize: '0.7rem',
        backgroundColor: 'transparent',
        borderRadius: '50%',
        padding: '0 4px',
      }}
    >
      {likeCount}
    </Typography>
 
</Box>
<Box position="relative" display="inline-flex">
  <IconButton onClick={handleExpandClick}>
    <ChatBubbleOutline />
  </IconButton>
    <Typography
      variant="caption"
      sx={{
        position: 'absolute',
        right: -1,
        fontSize: '0.7rem',
        backgroundColor: 'transparent',
        borderRadius: '50%',
        px: 0.5,
      }}
    >
      {commentCount}
    </Typography>
  
</Box>
        </Box>
      </Box>

      {/* Comments List */}
      <Box
        className='custom-scroll'
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          mb: 1,
          pr: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
{comments.map((comment) => (
  <Box
    key={comment.comment_id}
    sx={{
      backgroundColor: '#f5f5f5',
      p: 1,
      borderRadius: 2,
      fontSize: '0.9em',
      display:'flex',
    }}
  >
    <Typography  sx={{ fontWeight: 'bold', pr:'1vh' }}>
      {comment.firstName} {comment.lastName}
    </Typography>
    <Typography >{comment.text || comment.comment_text}</Typography>
  </Box>
))}

      </Box>

      {/* Input */}
      <Box display="flex" gap={1}>
        <TextField
        inputRef={commentInputRef}
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleAddComment}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Post
        </Button>
      </Box>
    </Box>
  </DialogContent>
</Dialog>


</>  
  );
  

}