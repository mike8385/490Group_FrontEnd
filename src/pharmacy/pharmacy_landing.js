import React, { useState, useEffect, useRef } from "react";
import Pharmacy_Navbar from "./pharmacy_navbar";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Typography } from "@mui/material";
import backImg from "./assets/purpback.png"
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const apiUrl = process.env.REACT_APP_API_URL;
const sectionStyle = {
    padding: "20px",
    borderRadius: "30px",
    backgroundColor: "#EEF2FE",
    height: "100%",

};

const gradientCardStyle = {
    ...sectionStyle,
    backgroundImage: `url(${backImg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    color: "#fff",
    backdropFilter: 'blur(100px)',
};

const mockDescriptions = [
    {
        name: "Phentermine (Adipex-P, Lomaira)",
        benefits: "Suppresses appetite, boosts metabolism, increases energy levels, promotes short-term weight loss.",
        side_effects: "Increased heart rate, insomnia, nervousness, dry mouth, dizziness, constipation, risk of dependence.",
        description: "A stimulant used short-term for weight loss by suppressing appetite and increasing energy.",
    },
    {
        name: "Semaglutide (Wegovy, Ozempic)",
        benefits: "Regulates appetite, reduces food intake, promotes weight loss, improves blood sugar levels.",
        side_effects: "Nausea, vomiting, diarrhea, constipation, risk of pancreatitis, potential thyroid tumors, injection site reactions.",
        description: "A GLP-1 receptor agonist that helps with weight loss by regulating hunger and improving metabolism.",
    },
    {
        name: "Orlistat (Alli, Xenical)",
        benefits: "Blocks fat absorption, reduces calorie intake, aids long-term weight loss, lowers cholesterol.",
        side_effects: "Oily stools, gas, frequent bowel movements, stomach pain, bloating, vitamin deficiencies.",
        description: "A fat-blocking medication that reduces calorie absorption from dietary fat to aid in weight loss.",
    },
    {
        name: "Megestrol Acetate (Megace)",
        benefits: "Stimulates appetite, helps with weight gain, treats anorexia/cachexia, increases energy levels.",
        side_effects: "Blood clot risk, fluid retention, swelling, increased blood sugar levels, hormonal imbalances.",
        description: "An appetite stimulant prescribed for severe weight loss due to medical conditions.",
    },
    {
        name: "Oxandrolone (Anavar)",
        benefits: "Increases muscle mass, promotes weight gain post-illness/surgery, enhances recovery and endurance.",
        side_effects: "Liver toxicity, cholesterol imbalance, suppressed testosterone production, acne, hair loss.",
        description: "An anabolic steroid used to promote muscle growth and weight gain after illness or surgery.",
    },
];
function Pharmacy_Landing() {
    
      const [snackOpen, setSnackOpen] = useState(false);
      const [snackMsg, setSnackMsg] = useState("");
      const [snackType, setSnackType] = useState("error");
  
      const showSnack = (msg, type = "error") => {
        setSnackMsg(msg);
        setSnackType(type);
        setSnackOpen(true);
      };
    
    const [pharmacyInfo, setPharmacyInfo] = useState(null);
    const [pharmacyStock, setPharmacyStock] = useState([]);

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

                fetch(`/stock/${id}`)
                    .then(res => res.json())
                    .then(data => {
                        if (!data.error) {
                            setPharmacyStock(data);
                        } else {
                            setPharmacyStock([]);
                        }
                    })
                    .catch(err => {
                        console.error("Error fetching pharmacy stock:", err);
                        setPharmacyStock([]);
                    });
            } catch (error) {
                console.error("Error fetching pharmacy info:", error);
            }
        };

        fetchPharmacyInfo();
    }, []);

    const [medDescriptions, setMedDescriptions] = useState([]);
    useEffect(() => {
        fetch('/all_meds').then(res => res.json()).then(setMedDescriptions);
    }, []);


    const [requests, setRequests] = useState([]);
    

    const handleFill = async (prescription_id) => {
        try {
            const response = await fetch(`${apiUrl}/prescription/fill`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prescription_id }),
            });

            if (response.ok) {
                // Mark as filled locally for now
                setRequests(prev =>
                    prev.map(req =>
                        req.prescription_id === prescription_id
                            ? { ...req, filled: true }
                            : req
                    )
                );
                const response = await fetch(`${apiUrl}/unfilled_prescriptions/${pharmacyInfo.pharmacy_id}`);
                const data = await response.json();
                setRequests(data);

                const stockRes = await fetch(`/stock/${pharmacyInfo.pharmacy_id}`);
                const stockData = await stockRes.json();
                setPharmacyStock(stockData);
            } else {
                const errorData = await response.json();
    
            if (errorData.error === "Not enough stock to fill this prescription.") {
                showSnack(`❌ Cannot fill prescription:\nRequired: ${errorData.required_quantity}, Available: ${errorData.available_stock}`);
            } else {
                showSnack(`⚠️ Error: ${errorData.error}`);
            }
            return;
            }
        } catch (error) {
            console.error("Fill error:", error);
        }
    };

    useEffect(() => {
        if (!pharmacyInfo) return;
    
        const fetchRequests = async () => {
            try {
                const response = await fetch(`${apiUrl}/unfilled_prescriptions/${pharmacyInfo.pharmacy_id}`);
                if (response.ok) {
                    const data = await response.json();
                    setRequests(data);
                } else {
                    const errorData = await response.json();
                    showSnack(`Error fetching requests: ${errorData.error}`);
                }
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };
    
        // Fetch immediately on load
        fetchRequests();
    
        // Set up interval for periodic refresh
        const intervalId = setInterval(fetchRequests, 10000); // Refresh every 10 seconds
    
        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [pharmacyInfo]);
    
    


    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Pharmacy_Navbar />

            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    padding: 3,
                    gap: 3,
                }}
            >
                <Box sx={{ flex: "0 0 45%" }}>
                    <Grid container spacing={3} sx={{ height: "100%" }}>
                        <Grid item xs={12} md={4}>
                            <Paper style={sectionStyle}>
                                <Typography variant="h6" sx={{ marginBottom: 2, fontFamily: 'Montserrat', textAlign: 'center', margin: 'auto', fontSize: '1.8em' }}>
                                    Pharmacy Inventory
                                </Typography>
                                <Box className="custom-scroll" sx={{ width: 'fit-content', textAlign: 'center', margin: 'auto', height: '35vh', overflowY: 'auto'}}>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontFamily: 'Montserrat', borderBottom: '3px' }}><strong>Medication Name</strong></TableCell>
                                                    <TableCell sx={{ fontFamily: 'Montserrat', borderBottom: '3px' }}><strong>Quantity</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {pharmacyStock.map(item => (
                                                    <TableRow key={item.medicine_id}>
                                                        <TableCell sx={{ fontFamily: 'Merriweather', borderBottom: '3px' }}>{item.medicine_name}</TableCell>
                                                        <TableCell sx={{ fontFamily: 'Merriweather', borderBottom: '3px' }}>{item.stock_count}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Paper style={gradientCardStyle}>
                                <Typography variant="h6" sx={{ marginBottom: 2, fontFamily: 'Montserrat', textAlign: 'center', margin: 'auto', fontSize: '1.8em', color: 'white' }}>
                                    Medication Requests
                                </Typography>
                                <Box className="custom-scroll" sx={{ width: 'fit-content', textAlign: 'center', margin: 'auto', height: '35vh', overflowY: 'auto'}}>
                                <TableContainer sx={{color: 'white', bordercolor: 'white', border: '1px solid white',}}>
                                <Table sx={{ borderRadius: 2,  color: 'white', bordercolor: 'white', border: '1px solid white',}}>
                                    <TableHead sx={{color: 'white', bordercolor: 'white', border: '1px solid white',}}>
                                        <TableRow sx={{color: 'white', bordercolor: 'white', border: '1px solid white',}}>
                                            <TableCell sx={{color: 'white', bordercolor: 'white', border: '1px solid white',}}><strong>Doctor Name</strong></TableCell>
                                            <TableCell sx={{color: 'white', bordercolor: 'white', border: '1px solid white',}}><strong>Patient Name</strong></TableCell>
                                            <TableCell sx={{color: 'white', bordercolor: 'white', border: '1px solid white',}}><strong>Medication</strong></TableCell>
                                            <TableCell sx={{color: 'white', bordercolor: 'white', border: '1px solid white',}}><strong>Quantity</strong></TableCell>
                                            <TableCell sx={{color: 'white', bordercolor: 'white', border: '1px solid white',}}><strong>Fill</strong></TableCell>
                                        </TableRow>
                                    </TableHead >
                                    <TableBody sx={{color: 'white', bordercolor: 'white'}}>
                                        {requests.map((req) => (
                                            <TableRow key={req.prescription_id} sx={{color: 'white', bordercolor: 'white'}}>
                                                <TableCell sx={{color: 'white', bordercolor: 'white', border: '1px solid white',}}>{req.doctor_name}</TableCell>
                                                <TableCell sx={{color: 'white', bordercolor: 'white', border: '1px solid white',}}>{req.patient_name}</TableCell>
                                                <TableCell sx={{color: 'white', bordercolor: 'white', border: '1px solid white',}}>{req.medication}</TableCell>
                                                <TableCell sx={{color: 'white', bordercolor: 'white', border: '1px solid white',}}>{req.quantity}</TableCell>
                                                <TableCell sx={{color: 'white', bordercolor: 'white', border: '1px solid white',}}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        disabled={req.filled}
                                                        onClick={() => handleFill(req.prescription_id)}
                                                    >
                                                        {req.filled ? "Filled" : "Fill"}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                </TableContainer>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ flex: "0 0 50%" }}>
                    <Paper style={{ ...sectionStyle, height: "100%", background: 'linear-gradient(109.86deg, #5889BD 6.67%, #719EC7 34.84%, #99C6DB 93.33%)', color: 'white' }}>
                        <Typography variant="h6" sx={{ marginBottom: 2, fontFamily: 'Montserrat', fontSize: '1.8em' }}>
                            Description
                        </Typography>
                        <TableContainer sx={{ borderColor: 'white', color: 'white' }}>
                            <Table sx={{ minWidth: 650, borderColor: 'white', color: 'white' }} size="small">
                                <TableHead sx={{ borderColor: 'white', color: 'white' }}>
                                    <TableRow sx={{ borderColor: 'white' }}>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'white' }}>Medication Name</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'white' }}>Benefits</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'white' }}>Side Affects</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', borderColor: 'white' }}>Description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{ borderColor: 'white', color: 'white' }}>
                                    {medDescriptions.map((med, index) => (
                                        <TableRow key={index} sx={{ borderColor: 'white', color: 'white' }}>
                                            <TableCell sx={{ color: 'white', borderColor: 'white' }}>{med.medicine_name}</TableCell>
                                            <TableCell sx={{ color: 'white', borderColor: 'white' }}>{med.benefits}</TableCell>
                                            <TableCell sx={{ color: 'white', borderColor: 'white' }}>{med.side_effects}</TableCell>
                                            <TableCell sx={{ color: 'white', borderColor: 'white' }}>{med.description}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>

                <Box sx={{ flex: "1 1 auto" }} />
            </Box>
        </div>
    );
}

export default Pharmacy_Landing;