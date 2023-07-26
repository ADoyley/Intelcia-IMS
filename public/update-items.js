  // Function to get the URL parameter value by name
  function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Function to fetch data for a specific serial number
  function fetchDataForSerial(serialNumber) {
    return fetch(`/api/data/${serialNumber}`)
      .then(response => response.json());
  }

  // Function to populate the form fields with the data
  function populateFormFields(data) {
    $('#itemType').val(data['Item Type']);
    $('#brand').val(data.Brand);
    $('#model').val(data.Model);
    $('#serial').val(data['Serial Number']);
    $('#location').val(data.Location);
  }

  // Handle the form submission using jQuery
$('#inventoryForm').submit(function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
  
    // Get the form data
    const formData = $(this).serialize();
  
    // Send the form data to the server to update the item
    $.post('/api/updateItem', formData)
      .done(function () {
        // On successful update, display the success message for 3 seconds
        $('.success-message').show();
        setTimeout(function () {
          // After 3 seconds, hide the success message and redirect to the home page
          $('.success-message').hide();
          window.location.href = '/'; // Replace '/' with the URL of your home page if it's different
        }, 3000); // 3000 milliseconds = 3 seconds
      })
      .fail(function () {
        // On update failure, display an error message (if needed)
        console.error('Failed to update item.');
      });
  });
  
 

  // Update the 'Update Item' heading with the serial number from the URL parameter
  $(document).ready(function() {
    const serialNumber = getUrlParam('serial');
    const updateHeading = document.getElementById('update-heading');
    updateHeading.textContent += serialNumber;

    // Set the serial number as the value of the data-serial attribute of the delete button
  $('.delete-button').attr('data-serial', serialNumber);

  // Fetch data for the specified serial number and populate the form fields
  fetchDataForSerial(serialNumber)
    .then(data => {
      populateFormFields(data);
    })
    .catch(error => {
      console.error(error);
    });

   // Handle the delete button click using jQuery
  $('.delete-button').on('click', function () {
    const serialNumber = $(this).data('serial'); // Get the serial number from the data attribute
    console.log(serialNumber);
    // Send the delete request to the server
    $.ajax({
      url: `/api/deleteItem/${serialNumber}`,
      type: 'DELETE',
      success: function () {
        // On successful delete, display the success message for 3 seconds
        $('.success-message').show();
         setTimeout(function () {
          // After 3 seconds, hide the success message and redirect to the home page
          $('.success-message').hide();
          window.location.href = '/'; // Replace '/' with the URL of your home page if it's different
        }, 3000); // 3000 milliseconds = 3 seconds
      },
      error: function () {
        // On delete failure, display an error message (if needed)
        console.error('Failed to delete item.');
      },
    });
  });
  
  });