import React, { useState, useEffect } from "react";
import Doctor_Navbar from "./doctor_navbar";
import { Box, Typography, Button, Avatar, Modal, Paper, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import doc1 from "./doctorim/doctor1.png"; // You can use a generic user avatar instead
const apiUrl = process.env.REACT_APP_API_URL;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#EEF2FE',
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};

function Doctor_Patientlist() {
  const doctorId = localStorage.getItem("doctorId");
  const [patients, setPatients] = useState([]);
  const [openLearnMore, setOpenLearnMore] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${apiUrl}/doc_patients/${doctorId}`)
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => console.error("Error fetching patients:", error));
  }, [doctorId]);

  const handleLearnMore = async (pat) => {
    const res = await fetch(`${apiUrl}/init-patient-survey/${pat.patient_id}`);
    const data = await res.json();
    setSelectedPatient({ ...pat, ...data });
    setOpenLearnMore(true);
  };
  

  return (
    <div style={{ display: "flex" }}>
      <Doctor_Navbar />
      <Box sx={{ flexGrow: 1, padding: 4, height: "92vh" }}>
        <Box sx={{display:'flex'}}>
          <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "medium", fontFamily: 'Montserrat', marginLeft: '1vw', fontSize: '2em' }}>
            Your Patients
          </Typography>
<Box sx={{ marginBottom: 3, marginLeft: '1vw' }}>
  <input
    type="text"
    placeholder="Search patients by name..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{
      padding: '10px 15px',
      borderRadius: '10px',
      border: '1px solid #ccc',
      width: '30vw',
      fontSize: '1em',
      fontFamily: 'Montserrat'
    }}
  />
</Box>
        </Box>  
        <Box sx={{ backgroundColor: "#EEF2FE", padding: '2vw', borderRadius: 10, width: "80vw", height: "80vh", margin: "auto" }}>
          <Box className="custom-scroll" sx={{ height: "72vh", overflowY: "auto" }}>
            {patients
  .filter(pat =>
    `${pat.first_name} ${pat.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  ).map((pat, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 2,
                  borderRadius: 10,
                  marginBottom: '3.5vh',
                  background: "linear-gradient(106deg, #5889BD 0.82%, #99C6DB 101.41%)",
                  color: "white",
                  paddingTop: '2vh',
                  paddingBottom: '2vh',
                  marginRight: '.5vw'
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={doc1}
                    sx={{
                      width: '18vh',
                      height: '18vh',
                      marginRight: 2,
                      borderRadius: "30px",
                      marginLeft: ".5vw",
                    }}
                  />
                  <Box>
                    <Typography variant="h5" sx={{ fontFamily: 'Montserrat', fontSize: '1.5em' }}>
                      {pat.first_name} {pat.last_name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em' }}>
                    <strong>Email:</strong> {pat.patient_email}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em' }}>
                    <strong>Phone:</strong> {pat.mobile_number || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em' }}>
                    <strong>Insurance Name:</strong> {pat.insurance_provider}
                    </Typography>
                    
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginRight: '2vw' }}>
                <Button
                    onClick={() => handleLearnMore(pat)}
                    variant="contained"
                    sx={{
                      backgroundColor: "#5A4AA3",
                      borderRadius: "20px",
                      textTransform: "none",
                      fontFamily: 'Montserrat',
                      paddingRight: '2em',
                      paddingLeft: '2em',
                      fontSize: '1.3em'
                    }}
                  >
                    Learn More
                  </Button>
                  <Button
                  onClick={() => {
                    localStorage.setItem("patientId", pat.patient_id); // Store patient ID
                    window.location.href = "/doctor_dashboard/doctor_patientinfo"; // Navigate to chart page
                  }}
                  variant="contained"
                  sx={{
                    backgroundColor: "#5A4AA3",
                    borderRadius: "20px",
                    textTransform: "none",
                    fontFamily: 'Montserrat',
                    paddingRight: '2em',
                    paddingLeft: '2em',
                    fontSize: '1.3em'
                  }}
                >
                  Overview
                </Button>

                </Box>

              </Paper>
            ))}

            {selectedPatient && (
              <Modal open={openLearnMore} onClose={() => setOpenLearnMore(false)}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                  <Paper sx={{ position: 'relative', width: 600, p: 4, borderRadius: 3, boxShadow: 5, bgcolor: '#EEF2FE', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <IconButton onClick={() => setOpenLearnMore(false)} sx={{ position: 'absolute', top: 12, right: 12 }}>
                      <CloseIcon />
                    </IconButton>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box
                        component="img"
                        src={doc1}
                        alt="Patient"
                        sx={{ maxHeight: '20vh', width: '10vw', borderRadius: "30px", objectFit: "cover", mr: 2 }}
                      />
                      <Box>
                      <Typography variant="h6" fontWeight="500" sx={{ fontFamily: 'Montserrat', fontSize: '1.5em', paddingBottom: '1vh' }}>
                        {selectedPatient.first_name} {selectedPatient.last_name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em', mb: 1 }}>
                      <strong>Age:</strong> {selectedPatient.dob ? Math.floor((new Date() - new Date(selectedPatient.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : "N/A"}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em', mb: 1 }}>
                        <strong>Gender:</strong> {selectedPatient.gender || "N/A"}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em', mb: 1 }}>
                        <strong>Email:</strong> {selectedPatient.patient_email}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em', mb: 1 }}>
                        <strong>Phone:</strong> {selectedPatient.mobile_number || "N/A"}
                      </Typography>
                      </Box>
                    </Box>

                    {/* Divider content below main section */}
                    <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em', mb: 1 }}>
                        <strong>Weight:</strong> {selectedPatient.weight || "N/A"} lbs
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em', mb: 1 }}>
                        <strong>Height:</strong> {selectedPatient.height || "N/A"} in
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em', mb: 1 }}>
                        <strong>Blood Type:</strong> {selectedPatient.blood_type || "N/A"}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em', mb: 1 }}>
                        <strong>Dietary Restrictions:</strong> {selectedPatient.dietary_restrictions || "None"}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em', mb: 1 }}>
                        <strong>Fitness Level:</strong> {selectedPatient.activity || "None"}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em', mb: 1 }}>
                        <strong>Goal:</strong> {selectedPatient.health_goals || "None"}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em', mb: 1 }}>
                        <strong>Insurance:</strong> {selectedPatient.insurance_provider || "N/A"}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em', mb: 1 }}>
                        <strong>Expires:</strong> {selectedPatient.insurance_expiration_date || "N/A"}
                      </Typography>
                    </Box>

                  </Paper>
                </Box>
              </Modal>
            )}
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default Doctor_Patientlist;
