import React, { useState, useEffect, useRef } from "react"; 
import Patient_Navbar from "./patient_navbar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Select,MenuItem, InputLabel,  Modal, TextField, FormControl} from "@mui/material";

import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { styled } from "@mui/material/styles";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';



const apiUrl = process.env.REACT_APP_API_URL;

const columns = [
  { id: "article", label: "Article", minWidth: 150, align: "center" },
  { id: "date", label: "Date", minWidth: 100, align: "left" },
  { id: "appointmentFee", label: "Appointment Charge", minWidth: 100, align: "center" },
  { id: "totalPrescriptionCharge", label: "Total Presciption Charge", minWidth: 100, align: "center" },
  { id: "credit", label: "Credit", minWidth: 100, align: "right" },
  { id: "currentBill", label: "Current Bill", minWidth: 120, align: "right" },
];

const CustomTableCell = styled(TableCell)({
  fontWeight: 600,
  fontFamily: "Montserrat",
  backgroundColor: "#f7f8fe",
  color: "#4a4a4a",
});



function Patient_Billing() {
  

    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMsg, setSnackMsg] = useState("");
    const [snackType, setSnackType] = useState("error");

    const showSnack = (msg, type = "error") => {
      setSnackMsg(msg);
      setSnackType(type);
      setSnackOpen(true);
    };

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
    
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //Make a Payment Modal
  const [openMakePayment, setOpenMakePayment] = useState(false);
  
  const openMakePaymentModal = () => {
    setOpenMakePayment(true);
    setAmount(calculateTotalBalance().toString());
  };
  const closeMakePaymentModal = () => {
    setOpenMakePayment(false);
  };
  
  
  // Daily survey form states
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setcardNumber] = useState("");
  const [cardExpir, setCardExpir] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [cardName, setCardName] = useState("");
  const [countryRegion, setCountryRegion] = useState("");

  const handlePaymentSubmit = async (e) => {
  e.preventDefault();

  const numericAmount = parseFloat(amount.replace("$", ""));
//valdiate 
  const cardNumberDigits = cardNumber.replace(/\s+/g, '');
  const cvcDigits = cardCVC.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!/^\d{16}$/.test(cardNumberDigits)) {
    showSnack("Card number must be 16 digits.");
    return;
  }

  if (!/^\d{3,4}$/.test(cvcDigits)) {
    showSnack("CVC must be 3 or 4 digits.");
    return;
  }

  if (!emailRegex.test(email)) {
    showSnack("Please enter a valid email.");
    return;
  }

  if (numericAmount <= 0 || isNaN(numericAmount)) {
    showSnack("Amount must be a valid positive number.");
    return;
  }
  // Validate expiration date
const expRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
if (!expRegex.test(cardExpir)) {
  showSnack("Expiration must be in MM/YY format.");
  return;
}

// Check if the expiration date is in the past
const [expMonth, expYear] = cardExpir.split("/").map(Number);
const now = new Date();
const currentYear = now.getFullYear() % 100; // Get last two digits of current year
const currentMonth = now.getMonth() + 1; // JS months are 0-indexed

if (
  expYear < currentYear ||
  (expYear === currentYear && expMonth < currentMonth)
) {
  showSnack("Card expiration date cannot be in the past.");
  return;
}

  try {
    const response = await fetch(`${apiUrl}/patient/${patientId}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credit: numericAmount }),
    });

    const data = await response.json();

    if (response.status === 201) {
      const newPaymentRow = {
        article: data.article,
        date: new Date().toLocaleDateString(),
        appointmentFee: "-",
        totalPrescriptionCharge: "-",
        credit: `$${numericAmount.toFixed(2)}`,
        currentBill: `$${data.new_balance.toFixed(2)}`
      };

      setRows((prevRows) => [...prevRows, newPaymentRow]);
      closeMakePaymentModal();

      console.log("Payment successful:", data);
    } else {
      // Handle 400 or 404 error
      showSnack(data.error || "Payment failed.");
    }
  } catch (error) {
    console.error("Error submitting payment:", error);
    showSnack("An error occurred while processing the payment.");
  }
};

  
  
  

  const [rows, setRows] = useState([]);
  const patientId = localStorage.getItem('patientId'); // assuming you're storing patient ID in localStorage
  console.log('patien  tId',patientId)
useEffect(() => {
  const fetchBills = async () => {
    try {
      console.log('patientID', patientId);
      const response = await fetch(`${apiUrl}/patient/${patientId}/bills`);
      if (!response.ok) throw new Error('Failed to fetch bills');

      const data = await response.json();

      const formattedData = data.map((item, index) => ({
        article: item.article !== 'credit' ? `Appt. ${item.article}` : item.article,
        date: new Date(item.created_at).toLocaleDateString("en-US"), // for the gray text under article
        appointmentFee: item.doctor_bill ? `$${item.doctor_bill.toFixed(2)}` : "-",
        totalPrescriptionCharge: item.pharm_bill ? `$${item.pharm_bill.toFixed(2)}` : "-",
        charge: item.credit === "" ? `$${(item.doctor_bill + item.pharm_bill).toFixed(2)}` : "$0.00",
        credit: item.credit !== "" ? `$${item.credit.toFixed(2)}` : "$0.00",
        currentBill: `$${item.current_bill.toFixed(2)}`
      }));

      setRows(formattedData);
    } catch (error) {
      console.error("Error fetching billing data:", error);
    }
  };

  if (patientId) {
    fetchBills();
  }
}, [patientId]);


const calculateTotalBalance = () => {
  if (!rows.length) return "0.00";
  const latest = rows[rows.length - 1];
  const balance = parseFloat(latest.currentBill.replace('$', ''));
  return Math.abs(balance).toFixed(2);
};

  
  return (
    <div style={{ display: "flex" }}>
      <Patient_Navbar />
      <Box
        sx={{
          flexGrow: 1,
          padding: 4,
          height: "100vh",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            marginBottom: 3,
            fontWeight: 600,
            fontFamily: "Montserrat",
            fontSize: "2em",
            color: "#1a1a1a",
            paddingLeft: "2vw",
          }}
        >
          Billing
        </Typography>

        <Paper
          elevation={0}
          sx={{
            borderRadius: "20px",
            paddingLeft: "10%",
            paddingRight: "10%",
            backgroundColor: "#eef2fe",
            maxWidth: "95%",
            height: "85vh",
            margin: "auto",
            paddingTop: "5%",
          }}
        >
          <TableContainer sx={{ maxHeight: "75vh" }}>
            <Table stickyHeader aria-label="sticky table" sx={{ border: "none" }}>
              <TableHead sx={{ border: "none" }}>
                <TableRow sx={{ border: "none" }}>
                  {columns.map((column) => (
                    <CustomTableCell
                      sx={{
                        border: "none",
                        backgroundColor: "#FAFAFA",
                        fontFamily: "Montserrat",
                        fontWeight: "medium",
                      }}
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </CustomTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ border: "none" }}>
              {rows
  .slice()
  .reverse() // Reverses the order for most recent first
  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  .map((row) => (
    <TableRow hover role="checkbox" tabIndex={-1} >
      {columns.map((column) => (
        <TableCell sx={{ border: "none", fontFamily: "Montserrat", fontWeight: 600 }} key={column.id} align={column.align}>
          {column.id === "article" ? (
            <>
              <Typography sx={{ fontWeight: 600, fontFamily: "Montserrat" }}>
                {row.article}
              </Typography>
              {/* <Typography variant="body2" sx={{ color: "gray", fontFamily: "Montserrat" }}>
                {row.subtitle}
              </Typography> */}
            </>
          ) : column.format && typeof row[column.id] === "number" ? (
            column.format(row[column.id])
          ) : (
            row[column.id]
          )}
        </TableCell>
      ))}
    </TableRow>
  ))}

              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination sx={{ fontWeight: 600, fontFamily: "Montserrat" }}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, mr: 2 }}>
            <Typography variant="subtitle1" sx={{mt:'3vh',fontFamily: "Montserrat", fontWeight: 600}}>
              Current Balance <span style={{ color: "#4a4a4a", fontFamily: "Montserrat", marginLeft: '3vw'}}>${calculateTotalBalance()}</span>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              onClick={openMakePaymentModal}

              variant="contained"
              sx={{
                backgroundColor: "#6B5DD3",
                fontFamily: "Montserrat",
                borderRadius: "20px",
                mb:'6vh',
                paddingX: 4,
                paddingY: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#574ab3",
                },
              }}
            >
              Make a Payment
            </Button>
            <Modal
                    open={openMakePayment}
                    onClose={closeMakePaymentModal}

                    //aria-labelledby="modal-modal-title"
                    //aria-describedby="modal-modal-description"
            >
              <Box
  component="form"
  onSubmit={handlePaymentSubmit}
  sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#f4f6fc",
    borderRadius: "20px",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  }}
>
  <Typography variant="h6" sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>
    Payment
  </Typography>

  <TextField
    label="Amount"
    fullWidth
    placeholder="$"
    variant="outlined"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    required
  />
  <TextField
    label="Email"
    fullWidth
    placeholder="you@example.com"
    variant="outlined"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
  <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: "Montserrat" }}>
    Card information
  </Typography>
  <TextField
    placeholder="0000 0000 0000 0000"
    fullWidth
    variant="outlined"
    value={cardNumber}
onChange={(e) => {
  let value = e.target.value.replace(/\D/g, "").substring(0, 16);
  value = value.replace(/(.{4})/g, "$1 ").trim();
  setcardNumber(value);
}}
    required
  />
  <Box sx={{ display: "flex", gap: 1 }}>
    <TextField
      placeholder="MM/YY"
      variant="outlined"
      fullWidth
      value={cardExpir}
onChange={(e) => {
  let value = e.target.value.replace(/\D/g, "").substring(0, 4);
  if (value.length >= 3) {
    value = `${value.substring(0, 2)}/${value.substring(2)}`;
  }
  setCardExpir(value);
}}
      required
    />
    <TextField
      placeholder="CVC"
      variant="outlined"
      fullWidth
      value={cardCVC}
      onChange={(e) => setCardCVC(e.target.value)}
      required
    />
  </Box>
  <TextField
    label="Name on card"
    fullWidth
    placeholder="Name"
    variant="outlined"
    value={cardName}
    onChange={(e) => setCardName(e.target.value)}
    required
  />
  <FormControl fullWidth>
    <InputLabel>Country or region</InputLabel>
    <Select
      required
      value={countryRegion}
      label="Country or region"
      onChange={(e) => setCountryRegion(e.target.value)}
    >
      <MenuItem value="US">United States</MenuItem>
      <MenuItem value="CA">Canada</MenuItem>
      <MenuItem value="UK">United Kingdom</MenuItem>
    </Select>
  </FormControl>
  <Button
   // onClick={closeMakePaymentModal}
    type="submit"
    fullWidth
    sx={{
      mt: 2,
      backgroundColor: "#1c1c1e",
      color: "#fff",
      fontFamily: "Montserrat",
      borderRadius: "8px",
      paddingY: 1.2,
      textTransform: "none",
      fontSize: "1rem",
      "&:hover": {
        backgroundColor: "#000",
      },
    }}
  >
    Pay
  </Button>
</Box>

            </Modal>
          </Box>
        </Paper>
      </Box>
    </div>
  );
}

export default Patient_Billing;
//do we want to allow them to do part of the payment or has to be whole charge at a time. Can it go into negative? Is it storing credit card information to check if it valid or not? 