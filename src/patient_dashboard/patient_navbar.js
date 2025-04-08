import React from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Drawer, List, ListItemButton, ListItemIcon, Avatar, Box, Divider } from "@mui/material";
import ClipBoardImg from "./nav_assets/Clipboard.png";
import DollarSignImg from "./nav_assets/Dollar sign.png";
import HeartImg from "./nav_assets/Heart.png";
import HomeImg from "./nav_assets/Home.png";
import UsersImg from "./nav_assets/Users.png";
import ProfileImg from "./nav_assets/Profile.png"
import LogoutImg from "./nav_assets/logout.png"


const sidebarItems = [
  { icon:<img src={HeartImg} className="heart" style={{ width:'7vh'}}/>, text: "Heart Chart"  },
  { icon:<img src={LogoutImg} className="heart" style={{ width:'7vh'}}/>, text: "Log Out"  },
  { icon:<img src={HomeImg} className="home_button" style={{width:'5.5vh'}}/>, text: "Medical Chart" },
  { icon:<img src={UsersImg} className="community_button" style={{width:'5.5vh'}} />, text: "Medical Chart" },
  { icon:<img src={ClipBoardImg} className="medical_chart_button" style={{width:'5.5vh'}}/>, text: "Medical Chart" },
  { icon:<img src={DollarSignImg} className="expenses_button" style={{width:'5.5vh'}}/>, text: "Medical Chart" },
  { icon:<Avatar alt="Remy Sharp" src={ProfileImg} style={{width:'7.5vh', height:'7.5vh', }} />},];





export default function Patient_Navbar() {
  const navigate = useNavigate();
  //direct to designated page
  const handleClick = (index) => {
    console.log('clicked with parameter:', index);
    
    if (index === 1) {
      navigate("/landing");
    }
    if (index === 2) {
      navigate("/patient_dashboard/patient_landing");

    }
    if (index === 3) {
      //enter path here - community page
    }
    if (index === 4) {
      //enter path here - medical charts
    }
    if (index === 5) {
      //enter path here - billing
    }
    if (index === 6) {
      //enter path here - community page profile
    }
  };
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 90,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 'fit-content',
          //backgroundColor: "#E8F0FF", // Light blue background
          display: "flex",
          alignItems: "center",
          paddingTop: '1vh',
          borderRight: "none",
        }
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, alignItems: "center"}}>
        <List sx={{height: 'fit-content', margin: 'auto'}}>
          {sidebarItems.map((item, index) => (
            <React.Fragment key={index}>
            <ListItemButton key={index} sx={{ display: "flex", justifyContent: "center", marginY: '1vh'}} onClick={() => handleClick(index)}>
              <ListItemIcon sx={{ color: "#345995", minWidth: "unset" }}>{item.icon}</ListItemIcon>
            </ListItemButton>
            {index == 1 && (
             <div style={{height:'10vh'}}></div>
            )}
            {index == 5 && (
             <div style={{height:'11vh'}}></div>
            )}
            {index ==0 ||index == 5 || index == 1 || index !=sidebarItems.length-1 && (
              <Divider sx={{width:"50%", marginY:'1vh', marginLeft:3}}/>
            )}

            
          </React.Fragment>  
          ))}
        </List>
       
      </Box>
    </Drawer>
  );
}