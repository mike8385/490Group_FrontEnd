import React from "react";
import Patient_Navbar from "./patient_navbar"; 
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import FlowerBackgroundImg from "./patient_landing_assets/FlowerBackground.png"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius:30,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  padding: 183,
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

function Patient_Landing() {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar/Navbar */}
      <Patient_Navbar /> 

      <div style={{ marginLeft: "3px", flexGrow: 1, padding: "20px" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2} >
            <Grid item xs={7}>
              <Item sx={{background: "linear-gradient(110deg, #5889BD 6.67%, #719EC7 34.84%, #99C6DB 93.33%)"}}>xs=7</Item>
            </Grid>
            <Grid item xs={5}>
              <Item sx={{backgroundColor:"#EEF2FE"}}>xs=5</Item>
            </Grid>
            <Grid item xs={4}>
              <Item sx={{background: "linear-gradient(110deg, #5889BD 6.67%, #719EC7 34.84%, #99C6DB 93.33%)"}}>xs=4</Item>
            </Grid>
            <Grid item xs={4}>
              <Item  sx={{ 
    position: "relative",
    overflow:"hidden",
    backgroundImage: `url(${FlowerBackgroundImg})`, 
    backgroundColor: "lightgray", 
    backgroundSize: "cover",
    backgroundPosition: "center", 
    backgroundRepeat: "no-repeat",
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
  }}><Box sx={{ position: "relative", zIndex: 2 }}>xs=4</Box></Item>
            </Grid>
            <Grid item xs={4}>
              <Item sx={{background: "linear-gradient(110deg, #5889BD 6.67%, #719EC7 34.84%, #99C6DB 93.33%)", backgroundSize: "cover",}}>xs=4</Item>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
}

export default Patient_Landing;
