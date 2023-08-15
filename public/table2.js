$(document).ready(function() {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        const tableBody = $('#inventory-table tbody');
        const searchDropdown = $('#search-dropdown'); // Reference to the search dropdown
  
        data.forEach(row => {
          const tableRow = $('<tr>').addClass('fade-in-row'); // Add fade-in class here
  
          // ... Create and append cells ...
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

          tableBody.append(tableRow);
        });
  
        // Search functionality
        $('#search-bar').on('input', function() {
          const searchValue = $(this).val().toLowerCase();
  
          const filteredResults = data.filter(row => {
            const rowText = `${row['Item Type']} ${row.Brand} ${row.Model} ${row['Serial Number']} ${row.Location}`;
            return rowText.toLowerCase().includes(searchValue);
          });
  
          // Clear and populate the search dropdown with filtered results
          searchDropdown.empty();
          filteredResults.forEach(result => {
            const searchOption = $('<div>')
              .addClass('search-option').addClass('fadeIn')
              .html(
                `<strong>${result['Serial Number']}</strong> - ${result['Item Type']} - Brand: ${result.Brand} - Location: ${result.Location}`
              )
              .on('click', function() {
                $('#search-bar').val(result['Serial Number']); // Set input value
                searchDropdown.empty(); // Clear dropdown
              });
  
            searchDropdown.append(searchOption);
          });
        });
  
        // Hide the search dropdown when clicking outside
        $(document).on('click', function(event) {
          if (!$(event.target).closest('.search-filter').length) {
            searchDropdown.empty();
          }
        });
      })
      .catch(error => {
        console.error(error);
      });
  });
  