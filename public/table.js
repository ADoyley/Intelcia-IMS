$(document).ready(function() {
  fetch('/api/data')
    .then(response => response.json())
    .then(data => {
      // Use the 'data' received from the backend
      //console.log(data);

      // Select the table body
      const tableBody = $('#inventory-table tbody');

      // Iterate over the data and append rows to the table
      data.forEach(row => {
        const tableRow = $('<tr>');

        // Create table cells with the corresponding data
        const itemTypeCell = $('<td>').text(row['Item Type']);
        const brandCell = $('<td>').text(row.Brand);
        const modelCell = $('<td>').text(row.Model);
        const serialNumberCell = $('<td>').text(row['Serial Number']);
        const locationCell = $('<td>').text(row.Location);

        // Append the cells to the table row
        tableRow.append(itemTypeCell, brandCell, modelCell, serialNumberCell, locationCell);

        // Append the table row to the table body
        tableBody.append(tableRow);
      });
    })
    .catch(error => {
      // Handle any errors that occur during the API request
      console.error(error);
    });
});
