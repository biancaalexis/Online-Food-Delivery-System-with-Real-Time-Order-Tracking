  // Check if user is logged in
  var loggedIn = false;

  // Function to show/hide sections based on authentication status
  function updateNavbar() {
    if (loggedIn) {
      document.getElementById('accountSection').style.display = 'block';
      document.getElementById('logoutSection').style.display = 'block';
      document.getElementById('signinSection').style.display = 'none';
    } else {
      document.getElementById('accountSection').style.display = 'none';
      document.getElementById('logoutSection').style.display = 'none';
      document.getElementById('signinSection').style.display = 'block';
    }
  }


  // Call the function to update the navbar initially
  updateNavbar();

  // Function to handle logout
// Function to handle logout
function logout() {
  if (confirm('Are you sure you want to logout?')){
  loggedIn = false;
  updateNavbar();
  $('#SignInUsername').val('');
  $('#SignInPassword').val('');
  clearOrderHistory(); // Clear order history display
  }
}

// Function to clear order history display
function clearOrderHistory() {
  const orderItemsContainer = $('#orderItems');
  orderItemsContainer.empty();
}

  // Add event listener for logout button click
  document.getElementById('logoutBtn').addEventListener('click', logout);

  document.addEventListener('DOMContentLoaded', function() {
      // 🔥 Ensure all modals are hidden on page load
      document.querySelectorAll('.modal').forEach(function (modal) {
        modal.style.display = 'none';
    });
    // Modal handling
    document.querySelectorAll('[data-modal]').forEach(function(trigger) {
      trigger.addEventListener('click', function() {
        var modalId = this.getAttribute('data-modal');
        document.getElementById(modalId).style.display = 'flex';
      });
    });

    document.querySelectorAll('.close').forEach(function(closeBtn) {
      closeBtn.addEventListener('click', function() {
        var modalId = this.getAttribute('data-modal');
        document.getElementById(modalId).style.display = 'none';
      });
    });

    


function isValidUsername(username) {
  return username.length >= 3; // Adjust as needed
}

function isValidPassword(password) {
  return password.length >= 6; // Adjust as needed
}

// Clear previous error messages
function clearErrors() {
  $('.error-message').remove();
}

// Show error message
function showError(element, message) {
  const errorElement = $('<span class="error-message" style="color: red; font-size: 12px;"></span>').text(message);
  element.after(errorElement);
}

    // Submit sign-in form
 // Submit sign-in form    // Submit sign-in form
    $('#SignInBtn').click(function() {
      var username = $('#SignInUsername').val();
      var password = $('#SignInPassword').val();
      $.ajax({
          url: 'http://localhost:8080/signin',
          method: 'POST',
          data: {
              'username': username,
              'password': password
          },
          success: function(data) {
              if (data.success) {
                  alert('Account logged in');
                  userId = data.id;
                  $('#accountUsername').val(data.username);
                  $('#accountRole').val(data.user_role);
                  $('#modalSignForm').hide(); // Hide sign-in modal on successful login
                  loggedIn = true;
                  updateNavbar();
                  console.log(userId)
                  // Redirect to admin.html if user has admin role
                  if (data.user_role === "admin") {
                      window.location.href = "admin.html";
                  }
                  else if (data.user_role === "delivery_personnel") {
                    window.location.href = "deliveryPersonnel.html";
                }
              } else {
                  alert('Invalid credentials');
              }
          },
          error: function(data) {
              alert('Failed to sign in');
              console.log(data);
          }
      });
  });
  


$(document).ready(function() {
  // Slider functionality
  let currentIndex = 0;
  const slides = $('.slider-slide');
  const totalSlides = slides.length;

  function showSlide(index) {
    const offset = -index * 100;
    $('.slider-container').css('transform', `translateX(${offset}%)`);
  }

  $('.slider-prev').click(function() {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
    showSlide(currentIndex);
  });

  $('.slider-next').click(function() {
    currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
    showSlide(currentIndex);
  });
});



$(document).ready(function() {
  //function to fetch and display products by category
  function fetchProductsByCategory(category) {
    $.ajax({
      url: `/products/${category}`,
      type: 'GET',
      dataType: 'json',
      success: function(products) {
        const mainProductContainer = $('#mainProductContainer');
        const UrbanBitesContainer = $('#UrbanBitesContainer');
        const BellaCucinaContainer = $('#BellaCucinaContainer');
        const SweetHavenContainer = $('#SweetHavenContainer');
        const searchBar = $('#searchBar');
        const searchButton = $('#searchButton');

        // Clear existing content and show the relevant container
        mainProductContainer.hide();
        UrbanBitesContainer.hide();
        BellaCucinaContainer.hide();
        SweetHavenContainer.hide();

        // Determine which container to show based on the category
        let targetContainer;
        if (category === 'UrbanBites') {
          targetContainer = UrbanBitesContainer;
        } else if (category === 'BellaCucina') {
          targetContainer = BellaCucinaContainer;
        } else if (category === 'SweetHaven') {
          targetContainer = SweetHavenContainer;
        } else {
          console.error('Unknown category:', category);
          return;
        }

        targetContainer.empty().show();

        if (products.length > 0) {
          $.each(products, function(index, product) {
            const productCard = $('<div class="card"></div>');

            // Image
            const img = $('<img class="card-img-top product-image">').attr('src', `/images/${product.imageFileName}`).attr('alt', product.name);
            productCard.append(img);

            // Body
            const body = $('<div class="card-body"></div>');

            // Title or name
            const title = $('<h5 class="card-title"></h5>').text(product.name);
            body.append(title);

            // Description
            const description = $('<p class="card-text"></p>').text(product.description);
            body.append(description);

            // Price
            const price = $('<p></p>').text(`Price: $${product.price}`);
            body.append(price);

            // Quantity selector
            const quantityLabel = $('<label for="quantity">Quantity:</label>');
            const quantityInput = $('<input type="number" class="form-control" min="1" value="1">');
            body.append(quantityLabel, quantityInput);

            // Add to cart button
            const addToCartBtn = $('<button class="btn btn-primary">Add to Cart</button>');
            addToCartBtn.click(function() {
              const quantity = parseInt(quantityInput.val());
              addToCart(product, quantity);
            });
            body.append(addToCartBtn);

            // Buy now button
            const buyNowBtn = $('<button class="btn btn-success ml-2">Buy Now</button>');
            buyNowBtn.click(function() {
              const quantity = parseInt(quantityInput.val());
              buyNow(product, quantity);
            });
            body.append(buyNowBtn);

            // Quantity available
            if (product.quantity > 0) {
              const quantityAvailable = $('<p></p>').text(`Available: ${product.quantity}`);
              body.append(quantityAvailable);
            } else {
              const outOfStock = $('<p></p>').text('Out of Stock');
              body.append(outOfStock);
              addToCartBtn.prop('disabled', true);
              buyNowBtn.prop('disabled', true);
            }

            productCard.append(body);
            targetContainer.append(productCard);
          });

          // Attach search bar functionality
          function filterProducts() {
            const query = searchBar.val().toLowerCase();
            targetContainer.children('.card').each(function() {
              const productName = $(this).find('.card-title').text().toLowerCase();
              if (productName.includes(query)) {
                $(this).show();
              } else {
                $(this).hide();
              }
            });
          }

          
          searchButton.click(filterProducts);
        } else {
          targetContainer.append('<p>No products available.</p>');
        }
      },
      error: function(response) {
        console.log(response);
        alert('Failed to fetch products. Please try again.');
      }
    });
  }

  var temp = null;

  //function to add product to cart
  function addToCart(product, quantity) {
    temp = 0
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total = existingItem.price * existingItem.quantity;
    } else {
      const cartItem = {
        id: product.id,
        category: product.category,
        name: product.name,
        price: product.price,
        quantity: quantity,
        total: product.price * quantity
      };
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Item added to cart');
    displayCartItems();
  }


// Function to display cart items in the modal
function displayCartItems() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = $('#cartItems');
  cartItemsContainer.empty();

  let totalQuantity = 0;
  let totalPrice = 0;

  if (cartItems.length > 0) {
      $.each(cartItems, function(index, item) {
          const row = $('<tr></tr>');
          row.append($('<td></td>').text(item.id).css('text-align', 'center'));
          row.append($('<td></td>').text(item.category).css('text-align', 'center'));
          row.append($('<td></td>').text(item.name).css('text-align', 'center'));
          row.append($('<td></td>').text(`$${item.price.toFixed(2)}`).css('text-align', 'center'));
          row.append($('<td></td>').text(item.quantity).css('text-align', 'center'));
          row.append($('<td></td>').text(`$${item.total.toFixed(2)}`).css('text-align', 'center')); // Total price column

          // Add delete button to each row
          const deleteButton = $('<button></button>').text('Delete');
          deleteButton.click(function() {
              // Show confirmation dialog
              if (confirm('Are you sure you want to delete this item from the cart?')) {
                  // Remove item from cartItems array
                  cartItems.splice(index, 1);
                  // Update localStorage
                  localStorage.setItem('cart', JSON.stringify(cartItems));
                  // Re-display cart items
                  displayCartItems();
              }
          });
          row.append($('<td></td>').append(deleteButton));

          cartItemsContainer.append(row);

          totalQuantity += item.quantity;
          totalPrice += item.total;
      });
  } else {
      cartItemsContainer.append('<tr><td colspan="8">No items in cart.</td></tr>');
  }

  // Update total quantity and total price in checkout modal
  $('.totalQuantity').text(totalQuantity);
  $('.totalPrice').text(`$${totalPrice.toFixed(2)}`);
}

 // Open Cart modal
 $('#openCartModal').click(function() {
  $('#modalCart').show();
});

// Close modals on close button click
$('.close').click(function() {
  var modalId = $(this).data('modal');
  $('#' + modalId).hide();
});

// Close modals when clicking outside of them
$(window).click(function(event) {
  if ($(event.target).is('#modalCart')) {
    $('#modalCart').hide();
  } else if ($(event.target).is('#checkoutModal')) {
    $('#checkoutModal').hide();
  } else if ($(event.target).is('#paymentModal')) {
    $('#paymentModal').hide();
  }
});

// Show Checkout modal when Checkout button is clicked in Cart modal
$('#checkoutBtn').click(function() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  if (loggedIn) {
      if (cartItems.length > 0) {
          $('#modalCart').hide();
          $('#checkoutModal').show();
          displayCartItems();
      } else {
          alert('Your cart is empty. Please add items to proceed with the purchase.');
      }
  } else {
      alert('Please log in to proceed with the purchase.');
  }
});


// Show Payment modal when Proceed to Payment button is clicked in Checkout modal
$('#proceedToPaymentBtn').click(function() {
  //perform form validation
  var fullName = $('#fullName').val().trim();
  var phoneNumber = $('#phoneNumber').val().trim();
  var address = $('#address').val().trim();
  var country = $('#country').val();
  var city = $('#city').val();

  //validation
  if (fullName === '') {
    alert('Please enter your full name');
    return;
  }
  if (phoneNumber === '') {
    alert('Please enter your phone number');
    return;
  }
  if (address === '') {
    alert('Please enter your address');
    return;
  }
  if (country === '') {
    alert('Please choose your country');
    return;
  }
  if (city === '') {
    alert('Please choose your city');
    return;
  }

  //if all fields are valid, hide checkoutModal and show paymentModal
  $('#checkoutModal').hide();
  $('#paymentModal').show();
});

$('#proceedToPaymentBtn1').click(function() {
   //perform form validation
   var fullName1 = $('#fullName1').val().trim();
   var address1 = $('#address1').val().trim();
   var country1 = $('#country1').val();
   var city1 = $('#city1').val();

   //validation
   if (fullName1 === '') {
     alert('Please enter your full name');
     return;
   }
   if (address1 === '') {
     alert('Please enter your address');
     return;
   }
   if (country1 === '') {
     alert('Please choose your country');
     return;
   }
   if (city1 === '') {
     alert('Please choose your city');
     return;
   }

   //if all fields are valid, hide checkoutModal1 and show paymentModal
   $('#checkoutModal1').hide();
   $('#paymentModal').show();
});

$('.close-CheckOutModal1').click(function() {
  $('#checkoutModal1').hide();
  localStorage.removeItem('buyNowItems');
});

$('.close-paymentModal').click(function() {
  $('#paymentModal').hide();
  localStorage.removeItem('buyNowItems');
});

close-paymentModal

  // Function to handle immediate purchase
  function buyNow(product, quantity) {
    temp = 1;
    if (!loggedIn) {
        alert("Please sign in first to proceed with the purchase.");
        return;
    }

    const buyNowItems = JSON.parse(localStorage.getItem('buyNowItems')) || [];

        const buyNowItem = {
            id: product.id,
            category: product.category,
            name: product.name,
            price: product.price,
            quantity: quantity,
            total: product.price * quantity
        };
        buyNowItems.push(buyNowItem);
    

    localStorage.setItem('buyNowItems', JSON.stringify(buyNowItems));

    // Update checkoutModal1 with the latest item information
    $('#fullName1').val(''); // Clear previous values
    $('#address1').val('');
    $('#country1').val('');
    $('#city1').val('');
    $('#totalQuantity1').text(quantity); // Update total quantity
    $('#totalPrice1').text(`$${(product.price * quantity).toFixed(2)}`); // Update total price

    // Open checkout modal immediately after adding to "Buy Now"
    $('#checkoutModal1').show(); // Show checkout modal
}

// Event handler to clear buyNowItems when checkoutModal1 is closed
$('#checkoutModal1').on('hidden.bs.modal', function () {
    localStorage.removeItem('buyNowItems');
});
//dito pre

$('#confirmPaymentButton').click(function() {
  var address = $('#address').val();
  var fullName = $('#fullName').val();
  var city = $('#city').val();
  var country = $('#country').val();
  var address1 = $('#address1').val();
  var fullName1 = $('#fullName1').val();
  var city1 = $('#city1').val();
  var country1 = $('#country1').val();

  console.log('Temp:', temp); // Add this line for debugging

  if (!loggedIn) {
    alert('Please log in to proceed with the purchase.');
    return;
  }

  var items = temp === 0 ? JSON.parse(localStorage.getItem('cart')) || [] : JSON.parse(localStorage.getItem('buyNowItems')) || [];

  console.log('Items:', items); // Add this line for debugging

  if (items.length === 0) {
    alert('No items in cart.');
    return;
  }

  var orderData = items.map(item => ({
    user_id: userId,
    product_id: item.id,
    category: item.category,
    product_name: item.name,
    price: item.price,
    quantity: item.quantity,
    total: item.total,
    fullname: temp === 0 ? fullName : fullName1,
    address: temp === 0 ? address : address1,
    city: temp === 0 ? city : city1,
    country: temp === 0 ? country : country1
  }));

  $.ajax({
    url: 'http://localhost:8080/orders',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(orderData),
    success: function() {
      alert('Purchase successful!');
      if (temp === 0) {
        localStorage.removeItem('cart');
        displayCartItems(); // Refresh cart display if needed
      } else {
        localStorage.removeItem('buyNowItems');
      }
      $('#paymentModal').hide();
    },
    error: function(xhr, status, error) {
      console.error(xhr.responseText);
      alert('Failed to complete purchase. Please try again later.');
    }
  });
  
});


function fetchOrderHistory(userId) {
  $.ajax({
    url: `http://localhost:8080/getOrdersByUserId`,
    method: 'GET',
    data: {
      'user_id': userId
    },
    success: function(orders) {
      const orderItemsContainer = $('#orderItems');
      orderItemsContainer.empty();
      //order id, product name, quantity, price, total, MOP, status
      if (orders.length > 0) {
        $.each(orders, function(index, order) {
          const row = $('<tr></tr>');

          // Append each cell with centered text
          row.append($('<td></td>').text(order.order_id).css('text-align', 'center'));
          row.append($('<td></td>').text(order.product_name).css('text-align', 'center'));
          row.append($('<td></td>').text(order.quantity).css('text-align', 'center'));
          row.append($('<td></td>').text(`$${order.price.toFixed(2)}`).css('text-align', 'center'));
          row.append($('<td></td>').text(`$${order.total.toFixed(2)}`).css('text-align', 'center'));
          row.append($('<td></td>').text(order.mop).css('text-align', 'center'));
          row.append($('<td></td>').text(order.status).css('text-align', 'center'));

          orderItemsContainer.append(row);
        });
      } else {
        orderItemsContainer.append('<tr><td colspan="8">No orders found.</td></tr>');
      }
    },
    error: function(response) {
      console.log(response);
      alert('Failed to fetch order history. Please try again.');
    }
  });
}

  // Show order history modal
// Event listener for Order History dropdown item
$('.dropdown-item[data-modal="orderHistoryModal"]').click(function(e) {
  e.preventDefault();

  if (loggedIn) {
    const uID = userId; 
    fetchOrderHistory(uID);
    $('#orderHistoryModal').modal('show'); // Assuming you are using Bootstrap modal
  } else {
    alert('Please log in to view order history.');
  }
});


  // Handle "View More" button for UrbanBites
  $("#view-UrbanBites").click(function(e) {
    e.preventDefault();
    fetchProductsByCategory('UrbanBites');
    $("#UrbanBitesContainer").show();
  });

  // Handle "View More" button for Bella
  $("#view-BellaCucina").click(function(e) {
    e.preventDefault();
    fetchProductsByCategory('BellaCucina');
    $("#UrbanBitesContainer").show();
  });

  // Handle "View More" button for Sweet
  $("#view-SweetHaven").click(function(e) {
    e.preventDefault();
    fetchProductsByCategory('SweetHaven');
    $("SweetHavenContainer").show();
  });

  $("#home").click(function(e) {
    e.preventDefault();
    const mainProductContainer = $('#mainProductContainer');
    const UrbanBitesContainer = $('#UrbanBitesContainer');
    const BellaCucinaContainer = $('#BellaCucinaContainer');
    const SweetHavenContainer = $('#SweetHavenContainer');
    $("#searchbarContainer").hide();

    mainProductContainer.show();
    UrbanBitesContainer.hide().empty();
    BellaCucinaContainer.hide().empty();
    SweetHavenContainer.hide().empty();
});
$("#searchbarContainer").hide();
  // Initialize cart items display
  displayCartItems();
});


// //for notification
//  // Function to listen for Customer Notifications
// function listenForCustomerNotifications() {
//   const eventSource = new EventSource('/stream-notifications'); // Replace with actual SSE endpoint

//   eventSource.onmessage = function (event) {
//       const message = event.data;
//       showForCustomerNotifications(message);
//   };

//   eventSource.onerror = function (error) {
//       console.error("Error receiving SSE:", error);
//       eventSource.close();
//   };
// }

// // Function to show Customer Notifications
// function showForCustomerNotifications(message) {
//   var notification = $('<div class="order-notification"></div>').text(message);
//   $('body').append(notification);

//   // Apply CSS styles to position and display the notification
//   notification.css({
//       position: 'fixed',
//       top: '20px',
//       right: '20px',
//       background: '#28a745', // Green background color (success notification)
//       color: 'white',
//       padding: '10px',
//       borderRadius: '5px',
//       fontSize: '16px',
//       fontWeight: 'bold',
//       zIndex: 1000
//   });

//   // Show notification for 5 seconds and then remove it
//   setTimeout(function () {
//       notification.fadeOut(300, function() {
//           notification.remove();
//       });
//   }, 5000);

//   // Play the notification sound
//   document.getElementById('orderSound').volume = 1.0; // Maximum volume
//   document.getElementById('orderSound').play();
// }
// $(document).ready(function() {
//   listenForCustomerNotifications();  // This will trigger the function to listen for notifications
// });
// Function to listen for Customer Notifications from SSE
// function listenForCustomerNotifications() {
//   const eventSource = new EventSource("http://localhost:8080/order-updates-customer"); // Match with backend SSE endpoint

//   eventSource.onmessage = function (event) {
//       console.log("New update:", event.data);
//       const message = event.data;
//       showForCustomerNotifications(message);
//   };

//   eventSource.onerror = function (error) {
//       console.error("Error receiving SSE:", error);
//       eventSource.close();
//   };
// }

// // Function to display customer notifications on screen
// function showForCustomerNotifications(message) {
//   if (!message) {
//       console.error("Received an empty notification message.");
//       return;
//   }

//   const customMessage = "We have an update for you! ";
//   const fullMessage = customMessage + message;

//   // Create the notification element
//   var notification = $('<div class="order-notification"></div>').text(fullMessage);
//   $('body').append(notification);

//   // Style the notification
//   notification.css({
//       position: 'fixed',
//       top: '50px',
//       right: '50px',
//       background: '#28a745',
//       color: 'white',
//       padding: '10px',
//       borderRadius: '5px',
//       fontSize: '16px',
//       fontWeight: 'bold',
//       zIndex: 10000
//   });

//   // Remove notification after 5 seconds
//   setTimeout(function () {
//       notification.fadeOut(300, function() {
//           notification.remove();
//       });
//   }, 5000);

//   // Play sound notification
//   document.getElementById('orderSound').volume = 1.0;
//   document.getElementById('orderSound').play();
// }

// // Wait for DOM ready and start listening for notifications
// $(document).ready(function() {
//   listenForCustomerNotifications();  // Trigger the function to listen for notifications
// });

// function listenForCustomerNotifications() {
//   const eventSource = new EventSource("http://localhost:8080/order-updates-customer"); // Match with backend SSE endpoint

//   eventSource.onmessage = function (event) {
//       console.log("New update:", event.data);
//       try {
//           const message = event.data;
//           showForCustomerNotifications(message);
//       } catch (error) {
//           console.error("Error processing SSE message:", error);
//       }
//   };

//   eventSource.onerror = function (error) {
//       console.error("Error receiving SSE:", error);
//       console.log("EventSource readyState:", eventSource.readyState);
//       eventSource.close();
//   };
// }
function listenForCustomerNotifications() {
  const eventSource = new EventSource("http://localhost:8080/order-updates-customer");

  eventSource.onopen = function () {
      console.log("EventSource connection opened");
  };

  eventSource.onmessage = function (event) {
      console.log("New update:", event.data);
      const message = event.data;
      showForCustomerNotifications(message);
  };

  eventSource.onerror = function (error) {
      console.error("Error receiving SSE:", error);
      console.log("EventSource readyState:", eventSource.readyState);
      eventSource.close();
      // Optionally, retry by creating a new EventSource after some delay
      setTimeout(listenForCustomerNotifications, 5000);
  };
}


// Function to display customer notifications on screen
function showForCustomerNotifications(message) {
  if (!message) {
      console.error("Received an empty notification message.");
      return;
  }

  const customMessage = "We have an update for you! ";
  const fullMessage = customMessage + message;

  // Create the notification element
  var notification = $('<div class="customer-notification"></div>').text(fullMessage);
  $('body').append(notification);

  // Style the notification
  notification.css({
      position: 'fixed',
      top: '50px',
      right: '50px',
      background: '#28a745',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '16px',
      fontWeight: 'bold',
      zIndex: 10000
  });

  // Remove notification after 5 seconds
  setTimeout(function () {
      notification.fadeOut(300, function() {
          notification.remove();
      });
  }, 5000);

  // Play sound notification
  if (document.getElementById('orderSound')) {
      document.getElementById('orderSound').volume = 1.0;
      document.getElementById('orderSound').play();
  } else {
      console.warn("Sound element not found.");
  }
}

// Wait for DOM ready and start listening for notifications
$(document).ready(function() {
  listenForCustomerNotifications();  // Trigger the function to listen for notifications
});

// //
// function listenForDeliveryNotifications() {
//   const eventSource = new EventSource("http://localhost:8080/order-updates-delivery-status");

//   eventSource.onopen = function () {
//       console.log("EventSource connection opened for delivery updates");
//   };

//   eventSource.onmessage = function (event) {
//       console.log("New delivery update:", event.data);
//       const message = event.data;
//       showForDeliveryNotifications(message);
//   };

//   eventSource.onerror = function (error) {
//       console.error("Error receiving SSE:", error);
//       console.log("EventSource readyState:", eventSource.readyState);
//       eventSource.close();
//       // Optionally, retry by creating a new EventSource after some delay
//       setTimeout(listenForDeliveryNotifications, 5000);
//   };
// }

// // Function to display delivery notifications on screen
// function showForDeliveryNotifications(message) {
//   if (!message) {
//       console.error("Received an empty notification message.");
//       return;
//   }

//   const customMessage = "Delivery Update: ";
//   const fullMessage = customMessage + message;

//   // Create the notification element
//   var notification1 = $('<div class="delivery-notification"></div>').text(fullMessage);
//   $('body').append(notification1);

//   // Style the notification
//   notification1.css({
//       position: 'fixed',
//       bottom: '50px',
//       left: '50px',
//       background: '#007bff',
//       color: 'white',
//       padding: '10px',
//       borderRadius: '5px',
//       fontSize: '16px',
//       fontWeight: 'bold',
//       zIndex: 10000
//   });

//   // Remove notification after 5 seconds
//   setTimeout(function () {
//       notification1.fadeOut(300, function() {
//           notification1.remove();
//       });
//   }, 5000);

//   // Play sound notification
//   if (document.getElementById('deliverySound')) {
//       document.getElementById('deliverySound').volume = 1.0;
//       document.getElementById('deliverySound').play();
//   } else {
//       console.warn("Sound element not found.");
//   }
// }

// // Wait for DOM ready and start listening for delivery notifications
// $(document).ready(function() {
//   listenForDeliveryNotifications();  // Trigger the function to listen for delivery updates
// });
// Function to listen for delivery status updates via SSE
function listenForDeliveryNotifications() {
  const eventSource = new EventSource("http://localhost:8080/order-updates-delivery-status");

  eventSource.onopen = function () {
      console.log("SSE Connection Opened for Delivery Updates");
  };

  eventSource.onmessage = function (event) {
      try {
          const message = JSON.parse(event.data);
          console.log("New Delivery Update:", message);
          showForDeliveryNotifications(message);
      } catch (error) {
          console.error("Error parsing delivery update:", event.data);
      }
  };

  eventSource.onerror = function () {
      console.error("SSE Connection Error. Retrying in 5 seconds...");
      eventSource.close();
      setTimeout(listenForDeliveryNotifications, 5000);
  };
}

// Function to display delivery notifications
function showForDeliveryNotifications(message) {
  if (!message || !message.deliveryStatus) {
      console.error("Received an empty or malformed notification message.", message);
      return;
  }

  const fullMessage = `Delivery Update: ${message.deliveryStatus}`;

  // Create the notification element
  var notification = $('<div class="delivery-notification"></div>').text(fullMessage);
  $('body').append(notification);

  // Style the notification
  notification.css({
      position: 'fixed',
      bottom: '50px',
      left: '50px',
      background: '#28a745',  // Green for success updates
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
      zIndex: 10000,
      opacity: 1,
      transition: 'opacity 0.5s ease-in-out'
  });

  // Fade out and remove notification after 5 seconds
  setTimeout(function () {
      notification.fadeOut(300, function () {
          notification.remove();
      });
  }, 5000);

  // Play sound notification
  const sound = document.getElementById('deliverySound');
  if (sound) {
      sound.volume = 1.0;
      sound.play().catch(err => console.warn("Audio playback failed:", err));
  } else {
      console.warn("Sound element not found.");
  }
}

// Start listening when the DOM is ready
$(document).ready(function () {
  listenForDeliveryNotifications();
});


});
