import React, { useState, useEffect, useRef } from "react"; 
import Patient_Navbar from "../../patient_dashboard/patient_navbar";
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Tabs, Tab, Box, Paper, Typography, Button } from '@mui/material';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import Plot from 'react-plotly.js';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const apiUrl = process.env.REACT_APP_API_URL;






function Patient_Chart() {

    const [activeTab, setActiveTab] = useState(0);
    const [chartTab, setChartTab] = useState(0);
    const [dailyInfo, setDailyInfo] = useState(null);
    const [weeklyInfo, setWeeklyInfo] = useState(null);
    const patientId = localStorage.getItem("patientId");
    const [isEditing, setIsEditing] = useState(false);
    const [originalPatientInfo, setOriginalPatientInfo] = useState(null);
    const [dailyGraphIndex, setDailyGraphIndex] = useState(0);
    const [weeklyGraphIndex, setWeeklyGraphIndex] = useState(0);

    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMsg, setSnackMsg] = useState("");
    const [snackType, setSnackType] = useState("error");

    const showSnack = (msg, type = "error") => {
      setSnackMsg(msg);
      setSnackType(type);
      setSnackOpen(true);
    };


      


    const [patientInfo, setPatientInfo] = useState({
        first_name: '',
        last_name: '',
        dob: '',
        gender: '',
        height: '',
        weight: '',
        blood_type: '',
        dietary_restrictions: '',
        medical_conditions: '',
        family_history: '',
        past_procedures: '',
        mobile_number: '',
        patient_address: '',
        patient_zipcode: '',
        patient_city: '',
        patient_state: '',
        patient_email: '',
        patient_id: null
      });
    
    
      useEffect(() => {
        const fetchDailyInfo = async () => {
          const id = localStorage.getItem("patientId");
          if (!id) return;
      
          try {
            const res = await fetch(`${apiUrl}/daily-surveys/${patientId}`);
            const data = await res.json();
      
            // Sort by date just to be safe
            const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
            setDailyInfo(sorted);
          } catch (error) {
            console.error("Error fetching patient survey info:", error);
          }
        };
        fetchDailyInfo();
      }, []);
      

      useEffect(() => {
        const fetchWeeklyInfo = async () => {
          const id = localStorage.getItem("patientId");
          if (!id) {
            console.warn("No patient ID in localStorage");
            return;
          }
      
          try {
            const res = await fetch(`${apiUrl}/weekly-surveys/${patientId}`);
            if (!res.ok) {
              throw new Error("Failed to fetch patient info");
            }
      
            const data = await res.json();
            setWeeklyInfo(data);
            console.log("Patient info Weekly:", data);
          } catch (error) {
            console.error("Error fetching patient servey info:", error);
          }
        };
        fetchWeeklyInfo();
    }, []);

    useEffect(() => {
        const fetchPatientInfo = async () => {
          try {
            const res = await fetch(`${apiUrl}/init-patient-survey/${patientId}`);
            if (!res.ok) throw new Error("Failed to fetch patient info");
            const data = await res.json();
            setPatientInfo(data);
            setOriginalPatientInfo(data);  // store original
            
            console.log("Chart:", data);
          } catch (error) {
            console.error("Error fetching patient info:", error);
          }
        };
        fetchPatientInfo();
      }, [patientId]);
      

      const weightChartData = {
        x: weeklyInfo?.map(entry =>
          new Date(entry.week_start).toISOString().split("T")[0]
        ),
        y: weeklyInfo?.map(entry => entry.weight_change),
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: 'blue' },
        name: 'Weight Change'
      };
      
      const systolicData = {
        x: weeklyInfo?.map(entry =>
          new Date(entry.week_start).toISOString().split("T")[0]
        ),
        y: weeklyInfo?.map(entry => parseInt(entry.blood_pressure.split('/')[0])),
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: 'red' },
        name: 'Systolic BP'
      };
      
      const diastolicData = {
        x: weeklyInfo?.map(entry =>
          new Date(entry.week_start).toISOString().split("T")[0]
        ),
        y: weeklyInfo?.map(entry => parseInt(entry.blood_pressure.split('/')[1])),
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: 'green' },
        name: 'Diastolic BP'
      };
      

    // DAILY CHART DATA
    const dailyDates = dailyInfo?.map(entry =>
        new Date(entry.date).toISOString().split("T")[0]
      );
      
    const waterIntakeData = {
        x: dailyDates,
        y: dailyInfo?.map(entry => entry.water_intake),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Water Intake (cups)',
        marker: { color: 'blue' }
        };

    const caloriesData = {
        x: dailyDates,
        y: dailyInfo?.map(entry => entry.calories_consumed),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Calories Consumed',
        marker: { color: 'orange' }
        };

    const heartRateData = {
        x: dailyDates,
        y: dailyInfo?.map(entry => entry.heart_rate),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Heart Rate',
        marker: { color: 'red' }
        };


        const formatDate = (rawDate) => {
            const date = new Date(rawDate);
            const year = date.getFullYear();
            const month = (`0${date.getMonth() + 1}`).slice(-2); // add leading zero
            const day = (`0${date.getDate()}`).slice(-2);
            return `${year}-${month}-${day}`;
          };
          

          const handleSave = async () => {
            // Validate phone number
            if (!validatePhoneNumber(patientInfo.mobile_number)) {
              showSnack("Please enter a valid phone number (e.g., 123-456-7890 or 1234567890)");
              return;
            }
          
            // Validate email
            if (!validateEmail(patientInfo.patient_email)) {
              showSnack("Please enter a valid email address (e.g., user@example.com)");
              return;
            }
          
            // Validate ZIP code
            if (!validateZipCode(patientInfo.patient_zipcode)) {
              showSnack("Please enter a valid 5-digit ZIP code");
              return;
            }
          
            // Validate gender
            if (!validateGender(patientInfo.gender)) {
              showSnack("Gender must be Male, Female, or Other");
              return;
            }
          
            try {
              const payload = {
                first_name: patientInfo.first_name,
                last_name: patientInfo.last_name,
                patient_id: patientInfo.patient_id,
                email: patientInfo.patient_email,
                phone: patientInfo.mobile_number,
                gender: patientInfo.gender,
                height: patientInfo.height,
                weight: patientInfo.weight,
                dietary_restrictions: patientInfo.dietary_restrictions,
                activity: 0,
                health_conditions: patientInfo.medical_conditions,
                family_history: patientInfo.family_history,
                past_procedures: patientInfo.past_procedures,
                address: patientInfo.patient_address,
                zipcode: patientInfo.patient_zipcode,
                city: patientInfo.patient_city,
                state: patientInfo.patient_state
              };
              
              const response = await fetch(`${apiUrl}/edit-patient`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
              });
          
              const result = await response.json();
              if (!response.ok) throw new Error(result.error || "Failed to update patient");
          
              showSnack("Patient information updated successfully!", "success");
              setIsEditing(false);
            } catch (err) {
              console.error("Update error:", err);
              showSnack(err.message || "Error updating patient info.");
            }
          };
 
          
          const dailyCharts = [
            {
              title: "Water Intake (cups)",
              data: [waterIntakeData]
            },
            {
              title: "Calories Consumed",
              data: [caloriesData]
            },
            {
              title: "Heart Rate",
              data: [heartRateData]
            }
          ];
          
          const weeklyCharts = [
            {
              title: "Weight Change",
              data: [weightChartData]
            },
            {
              title: "Systolic BP",
              data: [systolicData]
            },
            {
              title: "Diastolic BP",
              data: [diastolicData]
            }
          ];
          
          
          // Validation functions
          const validatePhoneNumber = (phone) => {
            const phoneRegex = /^(?:\d{3}-\d{3}-\d{4}|\d{10})$/;
            return phoneRegex.test(phone);
          };

          const validateEmail = (email) => {
            const emailRegex = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
            return emailRegex.test(email) && 
                  email.split('@')[0].length > 0 && 
                  !email.includes('..') && 
                  !email.startsWith('.') && 
                  !email.split('@')[0].endsWith('.');
          };

          const validateZipCode = (zip) => {
            const usZipRegex = /^\d{5}(-\d{4})?$/;
            return usZipRegex.test(zip);
          };

          const validateGender = (gender) => {
            return ['Male', 'Female', 'Other'].includes(gender);
          };


    return(
        <div>
            <Patient_Navbar/>
            <Box sx={{ 
                mt: 5,  // Adds margin-top
                px: 20,  // Horizontal padding
                width: '100%',
                height: '100%',
                maxWidth: 1500,  // Increased from 600
                mx: 'auto'
            }}>
                <Paper sx={{ p: 3, maxWidth: 1500, height: 700, mx: 'auto', display: 'flex', flexDirection: 'column' }}>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, borderBottom: '1px solid #ccc', height: 50}}>
                {/* Medical Chart tab (left) */}
                <Tab
                    label="Medical Chart"
                    onClick={() => setActiveTab(0)}
                    sx={{
                    background: activeTab === 0 ? '#EEF2FE' : 'transparent',
                    borderBottom: activeTab === 0 ? '2px solid #1976d2' : 'none',
                    borderRadius: '4px 4px 0 0',
                    textTransform: 'none',
                    fontWeight: activeTab === 0 ? 'bold' : 'normal'
                    }}
                />

                {/* Graphs tab (right) */}
                <Tab
                    label="Graphs"
                    onClick={() => setActiveTab(1)}
                    sx={{
                    background: activeTab === 1 ? '#9FBDDC' : 'transparent',
                    borderBottom: activeTab === 1 ? '2px solid #1976d2' : 'none',
                    borderRadius: '4px 4px 0 0',
                    textTransform: 'none',
                    fontWeight: activeTab === 1 ? 'bold' : 'normal'
                    }}
                />
                </Box>

                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 3 }}>
                {activeTab === 0 && (
                    <Box sx={{background: '#EEF2FE', flexGrow: 1, p: 3 }}>
                        <Typography variant="h6" gutterBottom>Medical Chart</Typography>

                        <Grid container spacing={4}>
                            {/* LEFT COLUMN */}
                            <Grid item xs={12} md={6}>
                            <Typography>
                                <strong>Patient Name:</strong>{" "}
                                {isEditing ? (
                                    <>
                                    <input
                                        style={{ marginRight: '8px' }}
                                        value={patientInfo?.first_name || ''}
                                        onChange={(e) =>
                                        setPatientInfo({ ...patientInfo, first_name: e.target.value })
                                        }
                                    />
                                    <input
                                        value={patientInfo?.last_name || ''}
                                        onChange={(e) =>
                                        setPatientInfo({ ...patientInfo, last_name: e.target.value })
                                        }
                                    />
                                    </>
                                ) : (
                                    `${patientInfo.first_name || ''} ${patientInfo.last_name || ''}`
                                )}
                            </Typography>
                            <Typography><strong>DOB: </strong>{new Date(patientInfo.dob).toLocaleDateString()}</Typography>
                            <Typography><strong>Gender: </strong>
                            {isEditing ? (
                                <input
                                value={patientInfo.gender}
                                onChange={(e) =>
                                    setPatientInfo({ ...patientInfo, gender: e.target.value })
                                }
                                />
                            ) : (
                                patientInfo.gender
                            )}                            
                            </Typography>
                            <Typography>
                            <strong>Height:</strong>{" "}
                            {isEditing ? (
                                <input
                                value={patientInfo.height}
                                onChange={(e) =>
                                    setPatientInfo({ ...patientInfo, height: e.target.value })
                                }
                                />
                            ) : (
                                patientInfo.height
                            )}
                            </Typography>
                            <Typography>
                            <strong>Weight: </strong>
                            {isEditing ? (
                                <input
                                value={patientInfo.weight}
                                onChange={(e) => setPatientInfo({ ...patientInfo, weight: e.target.value })}
                                />
                            ) : (
                                patientInfo.weight
                            )}
                            </Typography>
                            <Typography><strong>Blood Type: </strong>{patientInfo.blood_type}</Typography>
                            <Typography>
                            <strong>Dietary Restrictions: </strong>
                            {isEditing ? (
                                <input
                                value={patientInfo.dietary_restrictions}
                                onChange={(e) => setPatientInfo({ ...patientInfo, dietary_restrictions: e.target.value })}
                                />
                            ) : (
                                patientInfo.dietary_restrictions
                            )}
                            </Typography>
                            {/* <Typography><strong>Fitness Level: </strong> </Typography> */}
                            <Typography>
                            <strong>Health Conditions: </strong>
                            {isEditing ? (
                                <input
                                value={patientInfo.medical_conditions}
                                onChange={(e) => setPatientInfo({ ...patientInfo, medical_conditions: e.target.value })}
                                />
                            ) : (
                                patientInfo.medical_conditions
                            )}
                            </Typography>
                            <Typography>
                            <strong>Family History: </strong>
                            {isEditing ? (
                                <input
                                value={patientInfo.family_history}
                                onChange={(e) => setPatientInfo({ ...patientInfo, family_history: e.target.value })}
                                />
                            ) : (
                                patientInfo.family_history
                            )}
                            </Typography>
                            <Typography>
                            <strong>Past Procedures: </strong>
                            {isEditing ? (
                                <input
                                value={patientInfo.past_procedures}
                                onChange={(e) => setPatientInfo({ ...patientInfo, past_procedures: e.target.value })}
                                />
                            ) : (
                                patientInfo.past_procedures
                            )}
                            </Typography>
                            <Button
                            variant="outlined"
                            sx={{ mt: 2 }}
                            onClick={() => {
                                if (isEditing) {
                                // Revert to original values when canceling
                                setPatientInfo(originalPatientInfo);
                                } else {
                                // Take a snapshot before entering edit mode
                                setOriginalPatientInfo(patientInfo);
                                }
                                setIsEditing(!isEditing);
                            }}
                            >
                            {isEditing ? "Cancel" : "Edit"}
                            </Button>


                                    {isEditing && (
                                    <Button variant="contained" sx={{ mt: 2, ml: 2 }} onClick={handleSave}>
                                        Save
                                    </Button>
                                    )}                            </Grid>

                            {/* RIGHT COLUMN */}
                            <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography>
                            <strong>Phone:</strong>{" "}
                            {isEditing ? (
                                <input
                                value={patientInfo.mobile_number}
                                onChange={(e) => setPatientInfo({ ...patientInfo, mobile_number: e.target.value })}
                                />
                            ) : (
                                patientInfo.mobile_number
                            )}
                            </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography>
                            <strong>Address:</strong>{" "}
                            {isEditing ? (
                                <input
                                value={patientInfo.patient_address}
                                onChange={(e) => setPatientInfo({ ...patientInfo, patient_address: e.target.value })}
                                />
                            ) : (
                                patientInfo.patient_address
                            )}
                            </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography>
                              <strong>Zip code:</strong>{" "}
                              {isEditing ? (
                                <input
                                  value={patientInfo.patient_zipcode}
                                  onChange={(e) => setPatientInfo({ ...patientInfo, patient_zipcode: e.target.value })}
                                  onBlur={(e) => {
                                    if (!validateZipCode(e.target.value)) {
                                      showSnack("Please enter a valid 5-digit ZIP code");
                                    }
                                  }}
                                />
                              ) : (
                                patientInfo.patient_zipcode
                              )}
                            </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography>
                            <strong>City:</strong>{" "}
                            {isEditing ? (
                                <input
                                value={patientInfo.patient_city}
                                onChange={(e) => setPatientInfo({ ...patientInfo, patient_city: e.target.value })}
                                />
                            ) : (
                                patientInfo.patient_city
                            )}
                            </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography>
                              <strong>Email:</strong>{" "}
                              {isEditing ? (
                                <input
                                  value={patientInfo.patient_email}
                                  onChange={(e) => setPatientInfo({ ...patientInfo, patient_email: e.target.value })}
                                  onBlur={(e) => {
                                    if (!validateEmail(e.target.value)) {
                                      showSnack("Please enter a valid email address (e.g., user@example.com)");
                                    }
                                  }}
                                />
                              ) : (
                                patientInfo.patient_email
                              )}
                            </Typography>
                            </Box>

                            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography><strong>Insurance:</strong> Aetna</Typography>
                                <Button variant="outlined" size="small">Edit</Button>
                            </Box> */}
                            </Grid>
                        </Grid>
                        </Box>
                    )}

                    {activeTab === 1 && (
                        <Box sx={{background: '#9FBDDC', flexGrow: 1, p: 3 }}>
                            <Box sx={{ ml: 4 }}>  {/* Adjust "4" to how much space you want */}
                            <Typography variant="h6" gutterBottom>Health Graphs</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, borderBottom: '1px solid #ccc', height: 50}}>
                                    {/* Medical Chart tab (left) */}
                                    <Tab
                                        label="Daily Data"
                                        onClick={() => setChartTab(0)}
                                        sx={{
                                        background: chartTab === 0 ? '#EEF2FE' : 'transparent',
                                        borderBottom: chartTab === 0 ? '2px solid #9976d2' : 'none',
                                        borderRadius: '4px 4px 0 0',
                                        textTransform: 'none',
                                        fontWeight: chartTab === 0 ? 'bold' : 'normal'
                                        }}
                                    />

                                    {/* Graphs tab (right) */}
                                    <Tab
                                        label="Weekly Data"
                                        onClick={() => setChartTab(1)}
                                        sx={{
                                        background: chartTab === 1 ? '#EEF2FE' : 'transparent',
                                        borderBottom: chartTab === 1 ? '2px solid #9976d2' : 'none',
                                        borderRadius: '4px 4px 0 0',
                                        textTransform: 'none',
                                        fontWeight: chartTab === 1 ? 'bold' : 'normal'
                                        }}
                                    />
                                </Box>
                                {chartTab === 0 && (
                                    <>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                    <Button
                                        variant={dailyGraphIndex === 0 ? "contained" : "outlined"}
                                        onClick={() => setDailyGraphIndex(0)}
                                    >
                                        Water
                                    </Button>
                                    <Button
                                        variant={dailyGraphIndex === 1 ? "contained" : "outlined"}
                                        onClick={() => setDailyGraphIndex(1)}
                                    >
                                        Calories
                                    </Button>
                                    <Button
                                        variant={dailyGraphIndex === 2 ? "contained" : "outlined"}
                                        onClick={() => setDailyGraphIndex(2)}
                                    >
                                        Heart Rate
                                    </Button>
                                    </Box>

                                    <Plot
                                    data={dailyCharts[dailyGraphIndex].data}
                                    layout={{
                                        width: 700,
                                        height: 400,
                                        title: { text: dailyCharts[dailyGraphIndex].title },
                                        xaxis: { title: 'Date' },
                                        yaxis: { title: 'Values' }
                                    }}
                                    />

                                    </>
  
                                )} 
                                {chartTab === 1 && (
                                        <>
                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        <Button
                                        variant={weeklyGraphIndex === 0 ? "contained" : "outlined"}
                                        onClick={() => setWeeklyGraphIndex(0)}
                                        >
                                        Weight
                                        </Button>
                                        <Button
                                        variant={weeklyGraphIndex === 1 ? "contained" : "outlined"}
                                        onClick={() => setWeeklyGraphIndex(1)}
                                        >
                                        Systolic
                                        </Button>
                                        <Button
                                        variant={weeklyGraphIndex === 2 ? "contained" : "outlined"}
                                        onClick={() => setWeeklyGraphIndex(2)}
                                        >
                                        Diastolic
                                        </Button>
                                    </Box>

                                    <Plot
                                    data={weeklyCharts[weeklyGraphIndex].data}
                                    layout={{
                                        title: { text: weeklyCharts[weeklyGraphIndex].title },
                                        width: 700,
                                        height: 400,
                                        xaxis: {
                                        title: 'Week Start',
                                        tickformat: "%b %d, %Y",
                                        tickangle: -45,
                                        type: 'date'
                                        },
                                        yaxis: { title: 'Values' }
                                    }}
                                    />

                                    </>

                                )}
                            </Box>
                                {/* Your Plotly charts would go here */}
                        </Box>
                    )}
                </Box>
                </Paper>
            </Box>
            <Snackbar
              open={snackOpen}
              autoHideDuration={4000}
              onClose={() => setSnackOpen(false)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <MuiAlert onClose={() => setSnackOpen(false)} severity={snackType} variant="filled" sx={{ width: '100%' }}>
                {snackMsg}
              </MuiAlert>
            </Snackbar>
        </div>
    );

}

export default Patient_Chart;