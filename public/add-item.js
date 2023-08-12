$(document).ready(function() {
  $('#inventoryForm').submit(function(event) {
    event.preventDefault();

    const formData = {
      itemType: $('#itemType').val(),
      brand: $('#brand').val(),
      model: $('#model').val(),
      serial: $('#serial').val(),
      location: $('#location').val(),
    };

    // Success message element
    const successMessage = $(".success-message");

    $.ajax({
      url: '/api/addItem', // Make sure this is a POST request
      type: 'POST', // Ensure it's a POST request
      data: JSON.stringify(formData),
      contentType: 'application/json',
      success: function(data) {
        console.log('Item added:', data);
        // Handle success, display a message, or redirect to another page
        successMessage.show().animate({right: '50px'});
        setTimeout(function () {
          // After 3 seconds, hide the success message and redirect to the home page
          successMessage.hide();
          window.location.href = '/'; // Replace '/' with the URL of your home page if it's different
        }, 3000); // 3000 milliseconds = 3 seconds
      },
      error: function(error) {
        console.error('Error adding item:', error.responseJSON);
        // Handle error, display an error message, or perform error handling
      },
    });
  });
});
