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
  //console.log(row);
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
    //console.log(row);
  });
});

// Handle the update page request
app.get('/update.html', (req, res) => {
  const serialNumber = req.query.serial; // Get the serial number from the URL parameter
  // Now you have the serial number, you can use it to retrieve the corresponding item details from the data array
  // For example:
  const selectedItem = data.find(item => item['Serial Number'] === serialNumber);

  // Render the update page with the item details
  res.render('update', { item: selectedItem });
});

app.get('/api/data/:serial', (req, res) => {
  const serialNumber = req.params.serial;
  // Find the data for the specified serial number in your dataset
  const itemData = data.find(item => item['Serial Number'] === serialNumber);

  if (itemData) {
    res.json(itemData);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// Handle the form submission to update an item
app.post('/api/updateItem', (req, res) => {
  // Get the data submitted in the form
  const itemType = req.body.itemType;
  const brand = req.body.brand;
  const model = req.body.model;
  const serialNumber = req.body.serial;
  const location = req.body.location;


  // Now you have the updated data, you can update the corresponding item in the 'data' array
  // For example:
  const selectedItemIndex = data.findIndex(item => item['Serial Number'] === serialNumber);
  if (selectedItemIndex !== -1) {
    // Update the item with the new data
    data[selectedItemIndex] = {
      'Item Type': itemType,
      Brand: brand,
      Model: model,
      'Serial Number': serialNumber,
      Location: location,
    };

    // After updating the 'data' array, you can choose to save the updated data back to the Excel sheet.
    // This will depend on how you have set up the 'xlsx' library and where you want to save the data.
    // You may need to use the 'xlsx' library to write the updated data to the Excel file.
    // For example:
    const updatedWorksheet = xlsx.utils.json_to_sheet(data);
    const updatedWorkbook = {
      SheetNames: [sheetName],
      Sheets: { [sheetName]: updatedWorksheet },
    };
    xlsx.writeFile(updatedWorkbook, '\Inventory.xlsx');

    // Redirect to the home page after 3 seconds
    res.status(200).send('Item updated successfully!');

  } else {
    // If the item with the specified serial number is not found, send an error response
    res.status(404).send('Item not found.');
  }
});

// Handle the delete request for an item
app.delete('/api/deleteItem/:serialNumber', (req, res) => {
  const serialNumber = req.params.serialNumber; // Get the serial number from the URL parameter

  // Find the index of the item with the specified serial number in the 'data' array
  const selectedItemIndex = data.findIndex(item => item['Serial Number'] === serialNumber);
  
  if (selectedItemIndex !== -1) {
    // If the item is found, remove it from the 'data' array
    data.splice(selectedItemIndex, 1);

    // Update the Excel sheet with the modified data (your existing code here)

    // Respond with a success message or status
    res.send('Item deleted successfully!');
  } else {
    // If the item with the specified serial number is not found, send an error response
    res.status(404).send('Item not found.');
  }
});


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  opn('http://localhost:3000/index.html'); // Opens index.html in the default browser
});