import React, { useState, useEffect, useRef } from "react";
import Patient_Navbar from "./patient_navbar";
import { Box, Card, CardContent, Typography, Button, Avatar } from "@mui/material";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import doc1 from "./doctorim/doctor1.png";
import doc2 from "./doctorim/doctor2.png";
import doc3 from "./doctorim/doctor3.png";
import { useNavigate } from 'react-router-dom';
import { Select, MenuItem, Modal } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
const apiUrl = process.env.REACT_APP_API_URL;


/**const doctors = [
    {
      name: "Dr. Hillary Geller",
      specialization: "Nutritionist",
      experience: "4 years",
      fee: "$150",
      rating: "4.3/5",
      image: doc1,
    },
    {
      name: "Dr. Connor Life",
      specialization: "General",
      experience: "4 years",
      fee: "$120",
      rating: "4.7/5",
      image: doc2,
    },
    {
        name: "Dr. Colleen Gordon",
        specialization: "Nutritionist",
        experience: "4 years",
        fee: "$90",
        rating: "3.9/5",
        image: doc3,
      },
      {
        name: "Dr. Spencer Reid",
        specialization: "Nutritionist",
        experience: "6 years",
        fee: "$160",
        rating: "4.9/5",
        image: doc1,
      },
  ];**/

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
function Patient_Doctorlist() {
  const patientId = localStorage.getItem("patientId");
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    fetch(`${apiUrl}/doctors`)
      .then(response => response.json())
      .then(data => {
        setDoctors(data);
      })
      .catch(error => {
        console.error("Error fetching doctor data:", error);
      });
  }, [])

  //Learn More Modal
  const [openLearnMore, setOpenLearnMore] = useState(false);

  const openLearnMoreModal = () => {
    setOpenLearnMore(true);
  };
  const closeLearnMoreModal = () => {
    setOpenLearnMore(false);
  };

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);

  const openAddModal = () => {
    setOpenAdd(true);
  };
  const closeAddModal = () => {
    setOpenAdd(false);
  };
  const navigate = useNavigate();
  const handleAddDoctor = async () => {
    if (!selectedDoctor || !patient) return;
  
    try {
      const response = await fetch(`${apiUrl}/select-doctor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctor_id: selectedDoctor.doctor_id,
          patient_id: patient.patient_id,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Something went wrong while assigning doctor');
      }
  
      console.log('Doctor assigned successfully');
      closeAddModal(); // close the modal
      navigate('/patient_dashboard/patient_landing');
      // Optionally refresh data or show success message
    } catch (error) {
      console.error('Error assigning doctor:', error);
    }
  };
  
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(`${apiUrl}/patient/${patientId}`);
        if (!res.ok) throw new Error("Failed to fetch patient info");
        const data = await res.json();
        setPatient(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPatient();
  }, [patientId]);

  return (
    <div style={{ display: "flex" }}>
      <Patient_Navbar />
      <Box
        sx={{
          flexGrow: 1,
          padding: 4,
          height: "92vh",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "medium", fontFamily: 'Montserrat', marginLeft: '1vw', fontSize: '2em' }}>
          Doctors
        </Typography>

        <Box
          sx={{
            backgroundColor: "#EEF2FE",
            padding: '2vw',
            borderRadius: 10,
            width: "80vw",
            height: "80vh",
            margin: "auto",

          }}
        >
          <Box className="custom-scroll" sx={{ height: "72vh", overflowY: "auto" }}>
            {doctors.map((doc, index) => (
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
                    src={doc.doctor_picture || doc1}
                    sx={{
                      width: '18vh',
                      height: '18vh',
                      marginRight: 2,
                      borderRadius: "30px",
                      marginLeft: ".5vw",
                    }}
                  />
                  <Box>
                    <Typography variant="h5" fontWeight="medium" sx={{ fontFamily: 'Montserrat', fontSize: '1.5em' }}>
                      Dr. {doc.first_name} {doc.last_name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em' }}>
                      <strong>Specialization:</strong> {doc.specialty || "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em' }}>
                      <strong>Years of Experience:</strong> {doc.years_of_practice} years
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'Merriweather', fontSize: '1.1em' }}>
                      <strong>Appointment Fee:</strong> ${doc.payment_fee}
                    </Typography>
                    <Typography variant="body2"sx={{fontFamily: 'Merriweather', fontSize:'1.1em'}}>
                    <strong>Rating:</strong> {doc.doctor_rating}/5
                  </Typography>
                  </Box>
                </Box>

                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Button
                  onClick={() => { setSelectedDoctor(doc); setOpenLearnMore(true); }}
                  variant="contained"
                  sx={{
                    backgroundColor: "#5A4AA3",
                    borderRadius: "20px",
                    textTransform: "none",
                    fontFamily: 'Montserrat',
                    paddingRight: '2em',
                    paddingLeft: '2em',
                    marginRight: '2vw',
                    fontSize: '1.3em'
                  }}
                >
                  Learn More
                </Button>
                {patient && !patient.doctor_id && (
                  <Button
                    onClick={() => { setSelectedDoctor(doc); setOpenAdd(true); }}
                    disabled={!doc.accepting_patients}
                    variant="outlined"
                    sx={{
                      backgroundColor: doc.accepting_patients ? "#5A4AA3" : "#5A4AA361",
                      color: "white",
                      borderRadius: "20px",
                      textTransform: "none",
                      fontFamily: 'Montserrat',
                      paddingRight: '2em',
                      paddingLeft: '2em',
                      marginRight: '2vw',
                      fontSize: '1.2em',
                      marginTop: '1vh',
                      '&:hover': {
                        backgroundColor: doc.accepting_patients ? "#3b6a9e" : "#ccc"
                      }
                    }}
                  > 
                    {doc.accepting_patients ? "Add Doctor" : "Not Accepting Patients"}
                  </Button>
                )}
                </Box>

              </Paper>
            ))}

            {selectedDoctor && (
              <Modal open={openLearnMore} onClose={closeLearnMoreModal}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                  }}
                >
                  <Paper
                    sx={{
                      position: 'relative',
                      width: 600,
                      p: 4,
                      borderRadius: 3,
                      boxShadow: 5,
                      bgcolor: '#EEF2FE',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                    }}
                  >
                    {/* Close Icon */}
                    <IconButton
                      onClick={closeLearnMoreModal}
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                      }}
                    >
                      <CloseIcon />
                    </IconButton>

                    {/* Profile Image */}
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <Box
                        component="img"
                        src={selectedDoctor.doctor_picture || doc1}
                        alt="Doctor"
                        sx={{
                          maxHeight: '20vh',
                          width: '10vw',
                          borderRadius: "30px",
                          objectFit: "cover",
                          mr: 2,
                        }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="500" sx={{ fontFamily: 'Montserrat', fontSize: '1.5em', paddingBottom: '1vh' }}>
                          Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'Merriweather', color: "#000000", fontsize: '1.1em', paddingBottom: '1vh' }}>
                          <strong>Specialization:</strong> {selectedDoctor.specialty || "N/A"}
                        </Typography >
                        <Typography variant="body2" sx={{ fontFamily: 'Merriweather', color: "#000000", fontsize: '1.1em', paddingBottom: '1vh' }}>
                          <strong>Years of Experience:</strong> {selectedDoctor.years_of_practice} years
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'Merriweather', color: "#000000", fontsize: '1.1em' }}>
                          <strong>Appointment Fee:</strong> ${selectedDoctor.payment_fee}
                        </Typography>
                        {/*
                      <Typography variant="body2">
                        <strong>Rating:</strong> 4.3/5
                      </Typography>*/}
                      </Box>
                    </Box>


                    {/* Content */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>


                      <Typography variant="body2" mt={2} sx={{ fontFamily: 'Merriweather', color: "#000000", fontsize: '1.1em' }}>
                        <strong>About:</strong><br />
                        {selectedDoctor.description || "No bio provided."}
                      </Typography>
                    </Box>

                  </Paper>
                </Box>

              </Modal>
            )}

            {(selectedDoctor &&
              <Modal open={openAdd} onClose={closeAddModal} >
                                            <Box sx={{ ...style, display: 'flex', flexDirection: 'column', alignItems: "center", }}>
              
                                              <Typography sx={{ color: "black", fontSize: '2em', p: 2, textAlign: 'center', fontWeight:'500px'}}> Would you like to add Dr. {selectedDoctor.first_name} {selectedDoctor.last_name} as your new doctor?</Typography>
                                              <Button
                                                onClick={handleAddDoctor}
                                                variant="contained"
                                                sx={{
                                                  alignContent: 'center',
                                                  backgroundColor: '#50965B',
                                                  color: 'black',
                                                  borderRadius: '25px',
                                                  fontWeight: 'bold',
                                                  textTransform: 'none',
                                                  marginTop: '2vh',
                                                  marginBottom: '2vh',
                                                  width: '30vh',
                                                  fontFamily: 'Merriweather',
                                                  fontSize: '1em'
              
                                                }}
                                              >YES</Button>
                                              <Button
                                                onClick={closeAddModal}
                                                variant="contained"
                                                sx={{
                                                  backgroundColor: '#719EC7',
                                                  color: 'black',
                                                  borderRadius: '25px',
                                                  fontWeight: 'bold',
                                                  textTransform: 'none',
                                                  width: '30vh',
                                                  fontFamily: 'Merriweather',
                                                  fontSize: '1em'
                                                }}
                                              >Close
                                              </Button>
              
                                            </Box>
                                          </Modal>
            )}
          </Box>
        </Box>
      </Box>
    </div>
  );
}
export default Patient_Doctorlist;