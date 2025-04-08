import React, { useState, useEffect, useRef } from "react"; 
import Patient_Navbar from "./patient_navbar"; 
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
function Patient_Doctorlist() {
    return(
        <div style={{ display: "flex" }}>
            <Patient_Navbar />
        </div>
    );
}
export default Patient_Doctorlist;