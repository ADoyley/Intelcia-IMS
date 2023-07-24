const express = require('express');
const app = express();
const path = require('path');
const opn = require('opn');
const xlsx = require('xlsx');
const bodyParser = require('body-parser');
const cors = require('cors');



app.use(express.static(path.join(__dirname, 'public')));


// Add this middleware to parse JSON data
app.use(express.json());

// Add this middleware to parse form data (URL-encoded data)
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

// Load Excel file
let workbook;
try {
  workbook = xlsx.readFile('\Inventory.xlsx'); // Provide the correct file path if needed
} catch (error) {
  console.error('Error loading Excel file:', error);
  process.exit(1);
}

// Get the first sheet name
const sheetName = workbook.SheetNames[0];

// Get worksheet by name
const worksheet = workbook.Sheets[sheetName];

if (!worksheet) {
  console.error('Error: Worksheet not found in the Excel file.');
  process.exit(1);
}

// Convert worksheet to JSON object
const data = xlsx.utils.sheet_to_json(worksheet);

// Access and manipulate the data
data.forEach((row) => {
  // Process each row of data
  console.log(row);
});

// API endpoint to send the 'data' as a JSON response
app.get('/api/data', (req, res) => {
  res.json(data);
});



//API to add new items
app.post('/api/addItem', (req, res) => {
  const appendItem = {
    'Item Type' : req.body.itemType,
    'Brand' : req.body.brand,
    'Model' : req.body.model,
    'Serial Number' : req.body.serial,
    'Location' : req.body.location
  };

  // Append the new item to the data array
  data.push(appendItem);

  // Write the updated data back to the Excel sheet
  const newWorksheet = xlsx.utils.json_to_sheet(data);
  const newWorkbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
  xlsx.writeFile(newWorkbook, 'Inventory.xlsx');

  res.status(201).json(appendItem);

  data.forEach((row) => {
    // Process each row of data
    console.log(row);
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  opn('http://localhost:3000/index.html'); // Opens index.html in the default browser
});