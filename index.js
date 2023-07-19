const express = require('express');
const app = express();
const path = require('path');
const opn = require('opn');
const xlsx = require('xlsx');

app.use(express.static(path.join(__dirname, 'public')));

// Load Excel file
const workbook = xlsx.readFile('\Inventory.xlsx');

// Get the first sheet name
const sheetName = workbook.SheetNames[0];

// Get worksheet by name
const worksheet = workbook.Sheets[sheetName];

// Convert worksheet to JSON object
const data = xlsx.utils.sheet_to_json(worksheet);

// Access and manipulate the data
data.forEach((row) => {
  // Process each row of data
  //console.log(row);
});

// API endpoint to send the 'data' as a JSON response
app.get('/api/data', (req, res) => {
  res.json(data);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  opn('http://localhost:3000/index.html'); // Opens index.html in the default browser
});