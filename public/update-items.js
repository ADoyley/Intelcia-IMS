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

  // Populate the item type
  const itemTypeElement = document.querySelector('.item-type');
  itemTypeElement.textContent = `${data['Item Type']}`;

}

$(document).ready(function() {
  const serialNumber = getUrlParam('serial');
  const updateHeading = document.querySelector('#update-heading');
  updateHeading.textContent += serialNumber;

  // Fetch data for the specified serial number and populate the form fields
  fetchDataForSerial(serialNumber)
    .then(data => {
      populateFormFields(data);
    })
    .catch(error => {
      console.error(error);
    });

  // Handle the form submission using jQuery
  $('#inventoryForm').submit(function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the form data
    const formData = $(this).serialize();

    // Success message element
    const successMessage = $(".success-message");

    // Send the form data to the server to update the item
    $.post('/api/updateItem', formData)
      .done(function () {
        // On successful update, display the success message for 3 seconds
        successMessage.show().animate({right: '50px'});
        setTimeout(function () {
          // After 3 seconds, hide the success message and redirect to the home page
          successMessage.hide();
          window.location.href = '/'; // Replace '/' with the URL of your home page if it's different
        }, 3000); // 3000 milliseconds = 3 seconds
      })
      .fail(function () {
        // On update failure, display an error message (if needed)
        console.error('Failed to update item.');
      });
  }); 
});
