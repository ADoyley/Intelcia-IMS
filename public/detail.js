$(document).ready(function() {
  let serialNumberToDelete; // Variable to store the serial number

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

  // Function to populate the form fields and brand-model heading with the data
  function populateFormFields(data) {
    $('#itemType').val(data['Item Type']);
    $('#brand').val(data.Brand);
    $('#model').val(data.Model);
    $('#serial').val(data['Serial Number']);
    $('#location').val(data.Location);

    // Populate the item type
    const itemTypeElement = document.querySelector('.item-type');
    itemTypeElement.textContent = `${data['Item Type']}`;

    // Populate the brand and model in the heading
    const brandModelHeading = document.querySelector('.brand-model');
    brandModelHeading.textContent = `${data.Brand} ${data.Model}`;

    // Populate the location
    const locationElement = document.querySelector('.location');
    locationElement.textContent = `Location: ${data.Location}`;

    // Set the item image based on brand and item type
    const itemImage = document.querySelector('.item-pic');
    const imagePath = `images/${data.Brand.toLowerCase()}-${data['Item Type'].toLowerCase()}.png`;
    itemImage.src = imagePath;

    // Update the 'Update Item' link with the serial number
    const updateItemLink = document.querySelector('#opt-icon a[href="Update Items.html"]');
    const updateItemUrl = `Update Items.html?serial=${data['Serial Number']}`;
    updateItemLink.setAttribute('href', updateItemUrl);
  }

  // Update the 'Update Item' heading with the serial number from the URL parameter
  const serialNumber = getUrlParam('serial');
  const detailHeading = document.querySelector('.serial-number');
  detailHeading.textContent += serialNumber;

  // Fetch data for the specified serial number and populate the form fields and brand-model heading
  fetchDataForSerial(serialNumber)
    .then(data => {
      populateFormFields(data);
    })
    .catch(error => {
      console.error(error);
    });

  // Get the dialog element using jQuery
  const confirmationDialog = $("#confirmationDialog")[0];

  // Get the buttons inside the dialog using jQuery
  const confirmBtn = $("#confirmBtn");
  const cancelBtn = $("#cancelBtn");

  // Success message element
  const successMessage = $(".success-message");

  // Open the dialog when the "Show Confirmation" button is clicked
  $(".delete-button").on("click", function() {
    // Store the serial number in the variable
    serialNumberToDelete = serialNumber;
    confirmationDialog.showModal();
  });

  // Handle the result of the confirmation dialog
  confirmBtn.on("click", function() {
    // User clicked "OK," so perform the action here
    confirmationDialog.returnValue = "ok"; // Set the return value
    confirmationDialog.close();

    // Use the stored serial number to send the delete request to the server
    $.ajax({
      url: `/api/deleteItem/${serialNumberToDelete}`,
      type: 'DELETE',
      success: function () {
        // On successful delete, display the success message for 3 seconds
        successMessage.show().animate({right: '50px'});
        setTimeout(function () {
          // After 3 seconds, hide the success message and redirect to the home page
          successMessage.hide();
          window.location.href = '/'; // Replace '/' with the URL of your home page if it's different
        }, 3000); // 3000 milliseconds = 3 seconds
      },
      error: function () {
        // On delete failure, display an error message (if needed)
        console.error('Failed to delete item.');
      },
    });
  });

  cancelBtn.on("click", function() {
    // User clicked "Cancel," so set the return value and close the dialog
    confirmationDialog.returnValue = "cancel";
    confirmationDialog.close();
  });
});
