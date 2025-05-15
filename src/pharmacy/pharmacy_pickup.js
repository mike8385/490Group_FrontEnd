import React, { useState, useEffect, useRef } from "react";
import Pharmacy_Navbar from "./pharmacy_navbar";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const apiUrl = process.env.REACT_APP_API_URL;

const PharmacyPickUp = () => {
    const [pharmacyInfo, setPharmacyInfo] = useState(null);
    const [pickupList, setPickupList] = useState([]);

    useEffect(() => {
        const fetchPharmacyInfo = async () => {
            const id = localStorage.getItem("pharmacyId");
            if (!id) {
                console.warn("No pharmacy ID in localStorage");
                return;
            }

            try {
                const res = await fetch(`${apiUrl}/pharmacy/${id}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch patient info");
                }

                const data = await res.json();
                setPharmacyInfo(data);
                console.log("Pharmacy info:", data);

                const pickupRes = await fetch(`${apiUrl}/pickup/${id}`);
                if (!pickupRes.ok) throw new Error("Failed to fetch pickup data");

                const pickupData = await pickupRes.json();
                setPickupList(pickupData);
            } catch (error) {
                console.error("Error fetching pharmacy info:", error);
            }
        };

        fetchPharmacyInfo();
    }, []);
    return (
        <div style={{ display: "flex" }}>
            <Pharmacy_Navbar />
            <div style={{ marginLeft: "3px", flexGrow: 1, padding: "20px" }}>
                <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#EEF2FE", height: "90vh", marginTop: "5vh", paddingTop: "0px", paddingLeft: 0, paddingRight: 0, borderTopLeftRadius: 30, borderTopRightRadius: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, width: "80vw", margin: 'auto' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FFF', fontFamily: "Montserrat", width: "100%", backgroundColor: "#5889BD", borderTopLeftRadius: 30, borderTopRightRadius: 30, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingBottom: '1vh', paddingTop: '1vh' }}>
                        Pick Up
                    </Typography>
                    <Box className="custom-scroll" sx={{ overflowY: "auto", height: "80vh", width: 'fit-content', textAlign: 'center', margin: 'auto', marginTop: '1vh'}}>
                        <TableContainer >
                            <Table sx={{maxHeight: '70vh', background: '#F4F9FE61'}}>
                                <TableHead>
                                    <TableRow >
                                        <TableCell sx={{borderColor:'black'}}><strong>Patient Name</strong></TableCell>
                                        <TableCell sx={{borderColor:'black'}}><strong>Medication Name</strong></TableCell>
                                        <TableCell sx={{borderColor:'black'}}><strong>Quantity</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pickupList.length > 0 ? (
                                        pickupList.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{borderColor:'black'}}>{item.patient_name}</TableCell>
                                                <TableCell sx={{borderColor:'black'}}>{item.medicine_name}</TableCell>
                                                <TableCell sx={{borderColor:'black'}}>{item.quantity}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">No medications ready for pickup.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>


                </Box>
            </div>
        </div>
    );
};

export default PharmacyPickUp;