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

    $.ajax({
      url: '/api/addItem', // Make sure this is a POST request
      type: 'POST', // Ensure it's a POST request
      data: JSON.stringify(formData),
      contentType: 'application/json',
      success: function(data) {
        console.log('Item added:', data);
        // Handle success, display a message, or redirect to another page
      },
      error: function(error) {
        console.error('Error adding item:', error.responseJSON);
        // Handle error, display an error message, or perform error handling
      },
    });
  });
});
