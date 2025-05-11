import React, { useState, useEffect, useRef } from "react"; 
import Doctor_Navbar from "./doctor_navbar"; 
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { TextField, Typography, IconButton, Avatar} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import doc1 from "./doctorim/doctor1.png";
import pat1 from "./nav_assets/Profile.png"
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { io } from "socket.io-client";

const apiUrl = process.env.REACT_APP_API_URL;
const socket = io(`${apiUrl}`);


const buttonStyle = {
  borderRadius: "30px",
  border: "none",
  backgroundColor: "#5889BD",
  color: "#EEF2FE",
  // backgroundColor: "#86e88d",
  // color: "#5889BD",
  textAlign: "center",
  fontFamily: "Montserrat",
  fontSize: "0.9rem", // Avoid extremely small .45em
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)", // use `boxShadow` instead of `filter`
  padding: "5px 10px",
  fontWeight: 600,
  width: "10vw",
  height: "5vh",
  marginLeft: "1vw",
  "&:hover": {
    backgroundColor: "#dce3fa",
  }
};



const Panel = styled(Paper)(({ theme }) => ({
    backgroundColor: '#EEF2FE',
    padding: '20px',
    borderRadius: '20px',
    height: '90vh',
    overflowY: 'auto'
}));

const ChatBubble = ({ text, time, isUser, avatar }) => {
    return (
      <Box
        display="flex"
        flexDirection={isUser ? "row-reverse" : "row"}
        alignItems="flex-end"
        mb={2}
      >
        {/* Avatar */}
        <Avatar
          src={avatar}
          sx={{
            width: 36,
            height: 36,
            mx: 1,
            alignSelf: "flex-end",
          }}
        />
  
        {/* Message Bubble */}
        <Box
          bgcolor= '#EEF2FE'
          borderRadius={isUser ? "20px 20px 0 20px" : "20px 20px 20px 0"}
          p={1.5}
          maxWidth="75%"
          boxShadow={1}
        >
          <Typography variant="body2" sx={{ color: "#000", fontSize: "1.2em", fontFamily: "Merriweather" }}>
            {text}
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            display="block"
            textAlign={isUser ? "right" : "left"}
          >
            {time}
          </Typography>
        </Box>
      </Box>
    );
  };

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

function Doctor_Appointment() {

  const location = useLocation();
  const { appointmentId } = location.state || {};
  
  const [appointmentData, setAppointmentData] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showInput, setShowInput] = useState(true);
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);


  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);
  
    useEffect(() => {
      socket.on('receive_message', (data) => {
        setChatMessages(prev => [...prev, data]);
      });
    
      return () => {
        socket.off('receive_message');
      };
    }, []);
  
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    
    useEffect(() => {
      if (userId && appointmentId) {
        fetchChat();
      }
    }, [userId, appointmentId]);
  
    const fetchChat = async () => {
      try {
        const res = await fetch(`${apiUrl}/chat/${appointmentId}`);
        if (!res.ok) throw new Error("Failed to load chat");
    
        const data = await res.json();
        console.log("Data sender ID:", data.sender_id, "| Patient user ID:", userId);
        const mapped = data.map(msg => ({
          text: msg.message,
          timestamp: msg.sent_at,
          sender: msg.sender_id === userId ? "doctor" : "patient"
        }));
        setChatMessages(mapped);
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        console.log("appointmentId:", appointmentId);
        const res = await fetch(`${apiUrl}/single_appointment/${appointmentId}`);
        if (!res.ok) throw new Error("Failed to fetch appointment details");
  
        const data = await res.json();
        const formattedData = {
          doctor: data.doctor_name,
          patientName: data.patient_name,
          age: data.age,
          gender: data.gender,
          height: data.survey_height,
          weight: data.survey_weight,
          allergies: data.allergies,
          conditions: data.conditions,
          dietary_restrictions: data.dietary_restrictions,
          dob : data.dob,
          gender : data.survey_gender,
          reason: data.reason_for_visit,
          notes: data.doctor_appointment_note || "Not available until after appointment",
          prescription: data.current_medications || "Not available until after appointment",
          mealPlan: data.meal_prescribed || "Not available until after appointment",
          appointmentDate: new Date(data.appointment_datetime)
        };
  
        setAppointmentData(formattedData);
                
        // Check if the appointment is within 1 day
        const currentDate = new Date();
        const diffInTime = formattedData.appointmentDate.getTime() - currentDate.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24); // Convert milliseconds to days
        
        // Set visibility of input box
        setShowInput(diffInDays > 0 && diffInDays < 5);
      } catch (error) {
        console.error("Error fetching appointment:", error);
      }
    };
    const fetchUserId = async () => {
      const id = localStorage.getItem("doctorId");
      console.log("doctorId from localStorage:", id); 
      if (!id) {
        console.warn("No doctor ID in localStorage");
        return;
      }
      try {
        const res = await fetch(`${apiUrl}/user?doctor_id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
    
        const data = await res.json();
        console.log("Fetched user data:", data); 
        setUserId(data.user_id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    if (appointmentId) {
      fetchAppointment();
    }
    fetchUserId();
    fetchChat();
  }, [appointmentId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
  
    const newMsg = {
      appointment_id: appointmentId,
      sender: "doctor",
      text: newMessage,
    };
  
    // Emit over socket
    socket.emit('send_message', {
      ...newMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    const temp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    console.log(temp);

  
    // Save to DB
    try {
      await fetch(`${apiUrl}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg),
      });
    } catch (err) {
      console.error("Failed to save chat message:", err);
    }
  
    setNewMessage("");
  };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [values, setValues] = useState({
        pills: '',
        quantity: ''
    })

    const [pills, setPills] = useState(null); // or use 0 if preferred
  

    const [medications, setMedications] = useState([]);

    useEffect(() => {
      fetch(`${apiUrl}/all_meds`)
        .then(res => res.json())
        .then(data => setMedications(data))
        .catch(err => console.error('Error fetching meds:', err));
    }, []);

    const fetchPrescriptions = async (appointmentId) => {
      try {
        const response = await fetch(`/patient/${appointmentId}/prescriptions`);
        if (!response.ok) throw new Error("Failed to fetch prescriptions");
        const data = await response.json();
        setHasPrescribed(data.length > 0);
        return data;
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        return [];
      }
    };

    const [prescriptions, setPrescriptions] = useState([]);

    useEffect(() => {
      fetchPrescriptions(appointmentId).then(setPrescriptions);
    }, [appointmentId]);

    const [hasPrescribed, setHasPrescribed] = useState(false);



    


    return (
        <div style={{ display: "flex" }}>
          
          <Doctor_Navbar />

          
          <Grid container spacing={3} sx={{ padding: 3 }}>
        
        {/* Appointment Info */}
        <Grid item xs={12} md={5}>
          <Panel elevation={3}>
            <Typography variant="h5" gutterBottom sx={{fontSize: "2.2em"}}>Appointment Notes</Typography>
            {appointmentData ? (
              <>
                <Typography sx={{fontSize: "1.3em"}}><strong>Doctor:</strong> {appointmentData.doctor}</Typography>
                <Typography sx={{fontSize: "1.3em"}}><strong>Patient Name:</strong> {appointmentData.patientName}</Typography>
                <Typography sx={{fontSize: "1.3em"}}><strong>DOB:</strong> {appointmentData.dob}</Typography>
                <Typography sx={{fontSize: "1.3em"}}><strong>Gender:</strong> {appointmentData.gender}</Typography>
                <Typography sx={{fontSize: "1.3em"}}><strong>Height:</strong> {appointmentData.height}</Typography>
                <Typography sx={{fontSize: "1.3em"}}><strong>Weight:</strong> {appointmentData.weight}</Typography>
                <Typography sx={{fontSize: "1.3em"}}><strong>Dietary Restrictions:</strong> {appointmentData.dietary_restrictions}</Typography>
                <Typography sx={{fontSize: "1.3em"}}><strong>Pre-existing conditions:</strong> {appointmentData.conditions}</Typography>
                <Typography sx={{fontSize: "1.3em"}}><strong>Reason for visit:</strong> {appointmentData.reason}</Typography>
                <Typography sx={{ mt: 2, fontSize: "1.3em"}}><strong>Notes:</strong> {appointmentData.notes}</Typography>
                <Typography sx={{fontSize: "1.3em", display: 'flex'}}>
                  <strong>Prescription:</strong>
                  {prescriptions.length === 0 && !hasPrescribed ? (
                    <Button sx={buttonStyle} onClick={handleOpen}>Prescribe</Button>
                  ) : (
                    <span style={{ marginLeft: '1vw'}}>Sent</span>
                  )}
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography id="modal-modal-title" variant="h6" component="h2" color="black">
                        Prescription
                      </Typography>

                      <div className='labels'>
                        <label htmlFor="medication" className='gender-label'>Medicine: </label>
                        <Select
                          className="form-control-select"
                          value={pills || ''}
                          onChange={(e) => {
                            const selectedId = parseInt(e.target.value);
                            setPills(selectedId);
                            setValues({ ...values, medicine_id: selectedId });
                          }}
                          displayEmpty
                          renderValue={(selected) => {
                            const med = medications.find(m => m.medicine_id === selected);
                            return med ? med.medicine_name : "Select Medication";
                          }}
                        >
                          {medications.map((med) => (
                            <MenuItem key={med.medicine_id} value={med.medicine_id}>
                              {med.medicine_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>

                      <div className='labels'>
                        <label className='def-label' style={{ background: "#54a0ff", color: "white" }} htmlFor="quantity">Quantity: </label>
                        <input
                          type='number'
                          name='quantity'
                          className="form-control"
                          placeholder='Enter Quantity'
                          value={values.quantity}
                          min="1"
                          onChange={e => {
                            const val = parseInt(e.target.value);
                            if (val >= 0 || e.target.value === "") {
                              setValues({ ...values, quantity: e.target.value });
                            }
                          }}                        />
                      </div>

                      <button
                        className="patientlogin btn-info"
                        style={{ background: 'teal' }}
                        onClick={async () => {
                          try {
                            const res = await fetch(`${apiUrl}/request-prescription`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                appt_id: appointmentId,
                                medicine_id: pills,
                                quantity: parseInt(values.quantity),
                              }),
                            });
                            const data = await res.json();
                            if (res.ok) {
                              alert("Prescription submitted successfully!");
                              setHasPrescribed(true);
                              handleClose();
                            } else {
                              alert(data.error || "Failed to submit prescription.");
                            }
                          } catch (err) {
                            console.error("Prescription error:", err);
                            alert("An error occurred submitting the prescription.");
                          }
                        }}
                      >
                        Send
                      </button>
                    </Box>
                  </Modal>

                </Typography>
                <Typography sx={{fontSize: "1.3em"}}><strong>Meal Plan:</strong> {appointmentData.mealPlan}</Typography>
              </>
            ) : (
              <Typography>Loading...</Typography>
            )}
          </Panel>
        </Grid>

        {/* Chat */}
        <Grid item xs={12} md={7}>
          <Panel elevation={3} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", background: 'linear-gradient(109.86deg, #5889BD 6.67%, #719EC7 34.84%, #99C6DB 93.33%)'}}>
            <Typography variant="h5" gutterBottom sx={{fontSize: "2.2em", color: "#FFF"}}>Chat Log</Typography>

            {/* Chat History */}
            <Box flexGrow={1} my={2} className="custom-scroll" sx={{ height: '75vh', overflowY: 'auto' }}>
                {chatMessages.map((msg, idx) => (
                    <ChatBubble
                    key={idx}
                    text={msg.text}
                    time={formatTime(msg.timestamp)}
                    isUser={msg.sender === "doctor"}
                    avatar={msg.sender === "doctor" ? doc1 : pat1}
                    />
                ))}
                <div ref={messagesEndRef} />
            </Box>


            {/* Input */}
            {showInput && (
            <Box display="flex" alignItems="center" mt={2}>
              <TextField
                fullWidth
                placeholder="Type message here..."
                size="small"
                border="none"
                fontFamily= "Merriweather"
                variant="outlined"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend(); 
                  }
                }}
                
                sx={{ backgroundColor: "#fff", borderRadius: '30px', paddingTop:'.4em', paddingBottom:".4em", marginLeft: "2vw",

                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            border: "none",
                        },
                        "&:hover fieldset": {
                            border: "none",
                        },
                        "&.Mui-focused fieldset": {
                            border: "none",
                        },
                        },       
                }}
              />
              <IconButton
                onClick={handleSend}
                sx={{
                    backgroundColor: '#5A8BBE', 
                    color: '#fff',      
                    '&:hover': {
                        color: '#5A8BBE',  
                        backgroundColor: '#fff' 
                    },
                    width: 40,
                    height: 40,
                    marginRight: "2vw",
                }}
                >
                <SendIcon />
                </IconButton>
            </Box>
            )}
          </Panel>
        </Grid>
      </Grid>
        </div>
    )
}
export default Doctor_Appointment;
