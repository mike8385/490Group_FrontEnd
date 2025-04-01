import React, { useState } from "react";
import "./landing.css";
import heroImage from "./assets/heroimage.png";
import patient1 from "./assets/patient1.png";
import patient2 from "./assets/patient2.png";
import patient3 from "./assets/patient3.png";

import doctor1 from "./assets/doctor1.png";
import doctor2 from "./assets/doctor2.png";
import doctor3 from "./assets/doctor3.png";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useNavigate } from "react-router-dom";



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Landing() {

    const [open, setOpen] = React.useState(false);
  
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const navigate = useNavigate()


  return (
    <div className="Landing">
      <div className="landingnav">
        <h2>DPP</h2>
      </div>
      <div className="landinghero">
        <div className="herotext">
            <h3>Have Access To A Health Professional at Any Time</h3>
            <div className="herobuttons">
            <Button className="herobutton" onClick={handleOpen}>Login</Button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" color="black">
                      Are you a patient or a doctor?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <button className="patientbtn btn-info" onClick={() => navigate('/customer')}>
                        Patient
                    </button>
                    <button className="doctorbtn btn-info" onClick={() => navigate('/customer')}>
                        Doctor
                    </button>
                    </Typography>
                  </Box>
                </Modal>
                
                <Button className="herobutton" onClick={handleOpen}>Sign Up</Button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" color="black">
                      Are you a patient or a doctor?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <button className="patientbtn btn-info" onClick={() => navigate('/patientsignup')}>
                        Patient
                    </button>
                    <button className="doctorbtn btn-info" onClick={() => navigate('/doctorsignup')}>
                        Doctor
                    </button>
                    </Typography>
                  </Box>
                </Modal>
            </div>
        </div>
        <div className="heroimage">
            <img src={heroImage} alt="doctor point" className="doctorhero"/>
        </div>
      </div>
      
      <div className="aboutdiv">
        <div className="content">
        <h4>About Us</h4>
        <hr></hr>
        <p className="abouttext">We are a specialized team of individuals trying to make sure you live a healthy life! No more struggling with weight issues, If you want the secret to a long lasting life you wont be regretting this!</p>
        </div>
      </div>

      <div className="patienttest">
        <h4 className="white">Patient Testimontials</h4>
        <div className="testcards">
          <div className="patientcard">
            <img src={patient1} alt="patient" className="patientimage"/>
            <p class="patienttext">"I used to be heavily overweight and it sucked. Now after a few appointments I was able to get my life together. I even donated $100M"</p>
          </div>
          <div className="patientcard">
            <img src={patient2} alt="patient" className="patientimage"/>
            <p class="patienttext">"I used to be heavily overweight and it sucked. Now after a few appointments I was able to get my life together. I even donated $100M"</p>
          </div>
          <div className="patientcard">
            <img src={patient3} alt="patient" className="patientimage"/>
            <p class="patienttext">"I used to be heavily overweight and it sucked. Now after a few appointments I was able to get my life together. I even donated $100M"</p>
          </div>
        </div>
      </div>


      
      <div className="doctortest">
        <h4>Meet Our Doctors</h4>
        <div className="testcards">
          <div className="patientcard">
            <img src={doctor1} alt="patient" className="patientimage"/>
            <p class="patienttext" id="black">Lorem ipsum odor amet, consectetuer adipiscing elit. Vitae consec</p>
          </div>
          <div className="patientcard">
            <img src={doctor2} alt="patient" className="patientimage"/>
            <p class="patienttext" id="black">Lorem ipsum odor amet, consectetuer adipiscing elit. Vitae consec</p>
          </div>
          <div className="patientcard">
            <img src={doctor3} alt="patient" className="patientimage"/>
            <p class="patienttext" id="black">Lorem ipsum odor amet, consectetuer adipiscing elit. Vitae consec</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
