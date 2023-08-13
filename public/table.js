$(document).ready(function() {
  fetch('/api/data')
    .then(response => response.json())
    .then(data => {
      // Use the 'data' received from the backend

      // Select the table body
      const tableBody = $('#inventory-table tbody');

      // Iterate over the data and append rows to the table
      data.forEach(row => {
        const tableRow = $('<tr>');

        // Create table cells with the corresponding data
        const itemTypeCell = $('<td>').text(row['Item Type']);
        const brandCell = $('<td>').text(row.Brand);
        const modelCell = $('<td>').text(row.Model);

        // Create a hyperlink for the serial number cell
        const serialNumberLink = $('<a>')
          .attr('href', `/detail.html?serial=${row['Serial Number']}`)
          .text(row['Serial Number'])
          .addClass('serial-number'); // Add the 'serial-number' class to the hyperlink

        // Append the hyperlink to the serial number cell
        const serialNumberCell = $('<td>').append(serialNumberLink);

        const locationCell = $('<td>').text(row.Location);

        // Append the cells to the table row
        tableRow.append(itemTypeCell, brandCell, modelCell, serialNumberCell, locationCell);

        // Append the table row to the table body
        tableBody.append(tableRow);
      });

      // Search functionality
      $('#search-bar').on('input', function() {
        const searchValue = $(this).val().toLowerCase();

        // Loop through each row and hide/show based on search value
        tableBody.find('tr').each(function() {
          const rowText = $(this).text().toLowerCase();
          if (rowText.includes(searchValue)) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      });
    })
    .catch(error => {
      // Handle any errors that occur during the API request
      console.error(error);
    });
});
