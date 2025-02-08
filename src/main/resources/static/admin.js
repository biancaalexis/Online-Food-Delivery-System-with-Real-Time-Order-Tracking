$(document).ready(function () {

    //showproduct list
    $('#viewProductBtn').click(function () {
        $('#viewProductSection').show();
        $('#addProductSection').hide();
        $('#viewManageCustomerAccountSection').hide();
        $('#logOutSection').hide();
        $('#editProductModal').hide();
        $('#viewOrdersSection').hide();
        $('#viewManageAdminAccountSection').hide();
        $('#editOrderStatusModal').hide();
        $('#viewProcessOrderSection').hide();
    });

    //show add product form
    $('#addProductFormBtn').click(function () {
        $('#viewProductSection').hide();
        $('#addProductSection').show();
        $('#viewManageCustomerAccountSection').hide();
        $('#logOutSection').hide();
        $('#editProductModal').hide();
        $('#viewOrdersSection').hide();
        $('#viewManageAdminAccountSection').hide();
        $('#editOrderStatusModal').hide();
        $('#viewProcessOrderSection').hide();
    });

    //show customer manage account
    $('#manageCustomerAccountBtn').click(function () {
        $('#viewProductSection').hide();
        $('#addProductSection').hide();
        $('#viewManageCustomerAccountSection').show();
        $('#logOutSection').hide();
        $('#viewManageAdminAccountSection').hide();
        $('#addAdminModal').hide();
        $('#editProductModal').hide();
        $('#viewOrdersSection').hide();
        $('#viewProcessOrderSection').hide();
    });

    //show manage admin account
    $('#manageAdminAccountBtn').click(function () {
        $('#viewProductSection').hide();
        $('#addProductSection').hide();
        $('#viewManageCustomerAccountSection').hide();
        $('#logOutSection').hide();
        $('#editProductModal').hide();
        $('#viewOrdersSection').hide();
        $('#viewManageAdminAccountSection').show();
        $('#viewProcessOrderSection').hide();
    });

    //show order list
      $('#ordersBtn').click(function () {
        $('#viewProductSection').hide();
        $('#addProductSection').hide();
        $('#viewManageCustomerAccountSection').hide();
        $('#logOutSection').hide();
        $('#editProductModal').hide();
        $('#viewOrdersSection').show();
        $('#viewManageAdminAccountSection').hide();
        $('#viewProcessOrderSection').hide();
    });
   

    //log out
    $('#logOutBtn').click(function () {
        $('#viewProductSection').hide();
        $('#addProductSection').hide();
        $('#viewManageCustomerAccountSection').hide();
        $('#logOutSection').hide();
        $('#editProductModal').hide();
        $('#viewOrdersSection').hide();
        $('#viewManageAdminAccountSection').hide();
        $('#editOrderStatusModal').hide();
        $('#viewProcessOrderSection').hide();
        if(confirm("Are you sure you want to logout?")){
        window.location.href = "index.html";
        }
    });

    //hide all first
    $('#viewProductSection').hide();
    $('#addProductSection').hide();
    $('#viewManageCustomerAccountSection').hide();
    $('#logOutSection').hide();
    $('#editProductModal').hide();
    $('#viewOrdersSection').hide();
    $('#viewManageAdminAccountSection').hide();
    $('#editOrderStatusModal').hide();
    $('#assignDeliveryModal').hide();
    $('#viewProcessOrderSection').hide();
});



$(document).ready(function () {
    //to search order
    $('#searchOrder').click(function (e) {
        e.preventDefault();

    //to check if the input search is empty or not
    var searchValueOrder = $("#fldUser").val().trim();

    //if the search input is empty, view all order
        if (searchValueOrder === "") {
            $.ajax({
                type: "GET",
                url: "/getOrderList",
                cache: false,
                success: function (response) {
                    orderList(response);
                },
                fail: function (response) {
                    console.log(response);
                }
            });
        } else {
            //if the search input has value then search for it
            $.ajax({
                type: "GET",
                url: "/getOrdersByUserId",
                cache: false,
                data: {
                    "user_id": searchValueOrder
                },
                dataType: "JSON",
                success: function (response) {
                    orderList(response);
                },
                fail: function (response) {
                    console.log(response);
                }
            });
        }   
    });
       


    //when click add admin button will display the modal
    $('#addAdminButton').click(function() {
        $('#addAdminModal').show();
    });
    
    //close modal when click of admin modal
    $('#closeModalBtn').click(function() {
        $('#addAdminModal').hide();
    });

  //handle form submission on add admin
  $('#addAdminForm').submit(function(e) {
    e.preventDefault();

    //clear previous error
    $('.errorMessage').text('');

    //to form data to gather
    var username = $('#username').val().trim();
    var password = $('#password').val().trim();
    var phone = $('#phone').val().trim();

    var isValid = true;

    //validation
    if (username === "") {
        $('#usernameError').text("Username is required.");
        isValid = false;
    }
    if (password === "") {
        $('#passwordError').text("Password is required.");
        isValid = false;
    }
    if (phone === "") {
        $('#phoneError').text("Phone is required.");
        isValid = false;
    }

    if (!isValid) {
        return; 
    }

    //creating variable of admin object
    var admin = {
        username: username,
        password: password,
        phone: phone
    };

    //requesting to add admin
    $.ajax({
        type: "POST",
        url: "/addadmin",
        contentType: "application/json",
        data: JSON.stringify(admin),
        dataType: "json",
        success: function(response) {
            //when success
            alert("Admin added successfully.");

                //close the modal
                $('#addAdminModal').hide();

                //clear the form
                $('#addAdminForm')[0].reset();
                
                //reload admin list
                $.ajax({
                    type: "GET",
                    url: "/all",
                    cache: false,
                    success: function(response) {
                        alert("Admin list reloaded successfully!");
                        adminList(response); 
                    },
                    fail: function(response) {
                        console.log("Failed to reload admin list:", response);
                    }
                });
        },
        fail: function (response) {
            console.log(response);
        }
    });
});


     //view btn of admin
     $('#viewManageAdminAccountBtn').click(function (e) {
        e.preventDefault();
        $.ajax({
            type: "GET",
            url: "/getadmin",
            cache: false,
            success: function (response) {
                adminList(response); 
            },
            fail: function (response) {
                console.log(response);
            }
        });
    });

    //to see the admin table
    $('#manageAdminAccountBtn').click(function () {
        $('#viewProductSection').hide();
        $('#addProductSection').hide();
        $('#viewManageCustomerAccountSection').hide();
        $('#logOutSection').hide();
        $('#editProductModal').hide();
        $('#viewOrdersSection').hide();
        $('#viewManageAdminAccountSection').show();
        $('#editOrderStatusModal').hide();
        $('#assignDeliveryModal').hide();
        $('#viewProcessOrderSection').hide();
        getAdmin();
    });

    //to see the orders table
      $('#ordersBtn').click(function () {
        $('#viewProductSection').hide();
        $('#addProductSection').hide();
        $('#viewManageCustomerAccountSection').hide();
        $('#logOutSection').hide();
        $('#editProductModal').hide();
        $('#viewOrdersSection').show();
        $('#viewManageAdminAccountSection').hide();
        $('#editOrderStatusModal').hide();
        $('#assignDeliveryModal').hide();
        $('#viewProcessOrderSection').hide();
        getOrder();
    });

      //show process order list
      $('#processOrderBtn').click(function () {
        $('#viewProcessOrderSection').show();
        $('#viewProductSection').hide();
        $('#addProductSection').hide();
        $('#viewManageCustomerAccountSection').hide();
        $('#logOutSection').hide();
        $('#editProductModal').hide();
        $('#viewOrdersSection').hide();
        $('#assignDeliveryModal').hide();
        $('#viewManageAdminAccountSection').hide();
        getProcessOrders();
    });

    

    function getProcessOrders() {
        $.ajax({
            type: "GET",
            url: "/getProcessOrders",  // Ensure this URL matches the backend endpoint
            cache: false,
            success: function(response) {
                processOrderList(response); 
            },
            fail: function(response) {
                console.log(response);
            }
        });
    }
    
    function processOrderList(orders) {
        const tableHeader = $('#processOrderListTable thead');
        const tableBody = $('#processOrderListTable tbody');
        tableHeader.empty();
        tableBody.empty();
    
        if (orders.length > 0) {
            const headerRow = $('<tr>');
    
            // Dynamically create table headers based on the first orderDTO object
            $.each(orders[0], function (key) {
                headerRow.append(`<th style="border: 1px solid black; border-collapse: collapse;">${key}</th>`);
            });
            headerRow.append('<th style="border: 1px solid black; border-collapse: collapse;">Action</th>'); // Add Action column
            tableHeader.append(headerRow);
    
            orders.forEach(function (order) {
                const bodyRow = $('<tr>');
                
                // Dynamically populate table rows with order data
                $.each(order, function (key, value) {
                    bodyRow.append(`<td style="border: 1px solid black; border-collapse: collapse;">${value}</td>`);
                });
    
                // Action cell with the Assign button
                const actionCell = $('<td style="border: 1px solid black; border-collapse: collapse;"></td>')
                    .append('<button class="assignOrderBtn">Assign</button>');
                bodyRow.append(actionCell);
    
                tableBody.append(bodyRow);
            });
        } else {
            // No orders
            tableBody.append('<tr><td colspan="100%" style="border: 1px solid black; border-collapse: collapse;">No orders available</td></tr>');
        }
    
        // Assign button click event
        $('.assignOrderBtn').click(function () {
            const orderRow = $(this).closest('tr');
            const orderId = orderRow.find('td:first').text();  // Assuming the first column is order_id
            
            // Show the modal
            $('#assignDeliveryModal').show();
    
            // Set order ID in the modal's hidden field
            $('#assignDeliveryModal').data('orderId', orderId);
        });
    }
    
    // Assign delivery personnel
    $('#btnAssignDelivery').click(function () {
        const orderId = $('#assignDeliveryModal').data('orderId');
        const deliveryPersonnel = $('#deliveryPersonnel').val();
    
        // Send the request to the backend
        $.ajax({
            type: "POST",
            url: "/assignDelivery",
            data: {
                orderId: orderId,
                deliveryPersonnel: deliveryPersonnel
            },
            success: function (response) {
                alert(response);
                $('#assignDeliveryModal').hide();  // Close modal
                getProcessOrders();  // Reload orders
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
    
    // Cancel button click event
    $('#btnAssignCancel').click(function () {
        $('#assignDeliveryModal').hide();  // Close modal
    });
    
    
    // //function to get order 
    // function getOrder() {
    //     $.ajax({
    //         type: "GET",
    //         url: "/getOrderList",
    //         cache: false,
    //         success: function (response) {
    //             orderList(response); 
    //         },
    //         fail: function (response) {
    //             console.log(response);
    //         }
    //     });
    // }


//     function orderList(orders) {
//         const tableHeader = $('#orderListTable thead');
//         const tableBody = $('#orderListTable tbody');
//         tableHeader.empty();
//         tableBody.empty();
    
//         if (orders.length > 0) {
//             const headerRow = $('<tr>');

//             $.each(orders[0], function (key) {
//                 headerRow.append(`<th style="border: 1px solid black; border-collapse: collapse;">${key}</th>`);
//             });
//             headerRow.append('<th style="border: 1px solid black; border-collapse: collapse;">Action</th>'); // Add Action column
//             tableHeader.append(headerRow);
//             orders.forEach(function (order) {
//                 const bodyRow = $('<tr>');
//                 $.each(order, function (key, value) {
//                     bodyRow.append(`<td style="border: 1px solid black; border-collapse: collapse;">${value}</td>`);
//                 });
    
//                 // Add order button (Accept/Reject)
//                 const orderButton = $('<button class="editOrderBtn">Update</button>');
//                 orderButton.click(function () {
//                     // Populate modal with current order data
//                     $('#editOrderStatusModal').data('orderId', order.order_id).show();
//                 });
    
//                 // Action cell with the button
//                 const actionCell = $('<td style="border: 1px solid black; border-collapse: collapse;"></td>').append(orderButton);
//                 bodyRow.append(actionCell);
    
//                 tableBody.append(bodyRow);
//             });
//         } else {
//             // No orders
//             tableBody.append('<tr><td colspan="100%" style="border: 1px solid black; border-collapse: collapse;">No orders available</td></tr>');
//         }
//     }

//     $(document).ready(function () {
//         var eventSource = new EventSource("/order-updates");
    
//         eventSource.addEventListener("orderUpdate", function (event) {
//             var orderMessage = event.data;
//             showAdminNotification(orderMessage);
//         });
    
//         eventSource.onerror = function () {
//             console.error("Error connecting to order updates");
//             eventSource.close();
//         };
        
//     });
    
//     function showAdminNotification(message) {
//         var notification = $('<div class="order-notification"></div>').text("New Order: " + message);
        
//         $('body').append(notification);
        
//         setTimeout(function () {
//             notification.remove();
//         }, 5000);
//     }


// // Function to dynamically add a new order to the table and show a notification
// function addNewOrderToTable(order) {
//     const tableBody = $('#orderListTable tbody');
//     const bodyRow = $('<tr>');
    
//     // Populate the row with order details
//     $.each(order, function (key, value) {
//         bodyRow.append(`<td style="border: 1px solid black; border-collapse: collapse;">${value}</td>`);
//     });

//     // Add order button (Accept/Reject)
//     const orderButton = $('<button class="editOrderBtn">Update</button>');
//     orderButton.click(function () {
//         // Populate modal with current order data
//         $('#editOrderStatusModal').data('orderId', order.order_id).show();
//     });

//     // Action cell with the button
//     const actionCell = $('<td style="border: 1px solid black; border-collapse: collapse;"></td>').append(orderButton);
//     bodyRow.append(actionCell);

//     // Append the new order to the table body
//     tableBody.append(bodyRow);

//     // Show the notification
//     $('#orderNotification').addClass('show');
//     setTimeout(function() {
//         location.reload();
//         $('#orderNotification').removeClass('show');
//     }, 10000); // Hide the notification after 3 seconds

//     // Play the notification sound
//     document.getElementById('orderSound').play();
// }

//  // Establish SSE connection to receive updates
//  const eventSource = new EventSource('/api/orders/stream');

//  // Listen for new order updates
//  eventSource.onmessage = function(event) {
//      console.log("Received order update:", event.data);  // Log to see if the message is received
     
//      // Parse and add the new order to the table
//      const newOrder = JSON.parse(event.data);  // Assuming the event data is a JSON string
//      addNewOrderToTable(newOrder);  // This function adds the order to the table and shows the notification
//  };

// $(document).ready(function () {
//     // Establish SSE connection to receive updates
//     const eventSource = new EventSource('/api/orders/stream');

//     // Listen for new order updates
//     eventSource.onmessage = function (event) {
//         console.log("Received order update:", event.data);  // Log to see if the message is received
//         const newOrder = JSON.parse(event.data);  // Assuming the event data is a JSON string
//         addNewOrderToTable(newOrder);  // This function adds the order to the table and shows the notification
//     };

//     eventSource.onerror = function () {
//         console.error("Error connecting to order updates");
//         eventSource.close();
//     };
// });

// // Function to dynamically add a new order to the table and show a notification
// function addNewOrderToTable(order) {
//     const tableBody = $('#orderListTable tbody');
//     const bodyRow = $('<tr>');

//     // Populate the row with order details
//     $.each(order, function (key, value) {
//         bodyRow.append(`<td style="border: 1px solid black; border-collapse: collapse;">${value}</td>`);
//     });

//     // Add order button (Accept/Reject)
//     const orderButton = $('<button class="editOrderBtn">Update</button>');
//     orderButton.click(function () {
//         // Populate modal with current order data
//         $('#editOrderStatusModal').data('orderId', order.order_id).show();
//     });

//     // Action cell with the button
//     const actionCell = $('<td style="border: 1px solid black; border-collapse: collapse;"></td>').append(orderButton);
//     bodyRow.append(actionCell);

//     // Append the new order to the table body
//     tableBody.append(bodyRow);

//     // Show the notification
//     showAdminNotification("New Order: " + order.order_id); // Display notification with order id

//     // Play the notification sound
//     document.getElementById('orderSound').play();
// }

// // Function to show the admin notification
// function showAdminNotification(message) {
//     var notification = $('<div class="order-notification"></div>').text(message);
//     $('body').append(notification);

//     // Style the notification if necessary, you can apply custom CSS to it
//     notification.css({
//         position: 'fixed',
//         top: '20px',
//         right: '20px',
//         background: 'green',
//         color: 'white',
//         padding: '10px',
//         borderRadius: '5px',
//         fontSize: '16px'
//     });

//     // Remove notification after 5 seconds
//     setTimeout(function () {
//         notification.remove();
//     }, 10000);
// }

// Establish SSE connection to receive updates
const eventSource = new EventSource('/order-updates');

// Listen for new order updates
eventSource.onmessage = function (event) {
    console.log("Received order update:", event.data);  // Log to see if the message is received
    const newOrder = JSON.parse(event.data);  // Assuming the event data is a JSON string
    addNewOrderToTable(newOrder);  // This function adds the order to the table and shows the notification
};

eventSource.onerror = function () {
    console.error("Error connecting to order updates");
    eventSource.close();
};

// Function to dynamically add a new order to the table and show a notification
function addNewOrderToTable(order) {
    const tableBody = $('#orderListTable tbody');
    const bodyRow = $('<tr>');

    // Populate the row with order details
    $.each(order, function (key, value) {
        bodyRow.append(`<td style="border: 1px solid black; border-collapse: collapse;">${value}</td>`);
    });

    // Add order button (Accept/Reject)
    const orderButton = $('<button class="editOrderBtn">Update</button>');
    orderButton.click(function () {
        // Populate modal with current order data
        $('#editOrderStatusModal').data('orderId', order.order_id).show();
    });

    // Action cell with the button
    const actionCell = $('<td style="border: 1px solid black; border-collapse: collapse;"></td>').append(orderButton);
    bodyRow.append(actionCell);

    // Append the new order to the table body
    tableBody.append(bodyRow);

    // Show the notification
    showAdminNotification("New order has been placed! new order: " + order.order_id); // Display notification with order id
    //max golume
    document.getElementById('orderSound').volume = 1.0; // Maximum volume
    // Play the notification sound
    document.getElementById('orderSound').play();
}

// Function to show the admin notification
function showAdminNotification(message) {
    var notification = $('<div class="order-notification"></div>').text(message);
    $('body').append(notification);

    // Apply CSS styles to position and display the notification
    notification.css({
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#28a745', // Green background color (success notification)
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        zIndex: 1000
    });

    // Show notification for 5 seconds and then remove it
    setTimeout(function () {
        notification.fadeOut(300, function() {
            notification.remove();
        });
    }, 5000);
}


// Function to get order (You might use this elsewhere in your code)
function getOrder() {
    $.ajax({
        type: "GET",
        url: "/getOrderList",
        cache: false,
        success: function (response) {
            orderList(response); 
        },
        fail: function (response) {
            console.log(response);
        }
    });
}

function orderList(orders) {
    const tableHeader = $('#orderListTable thead');
    const tableBody = $('#orderListTable tbody');
    tableHeader.empty();
    tableBody.empty();

    if (orders.length > 0) {
        const headerRow = $('<tr>');
        $.each(orders[0], function (key) {
            headerRow.append(`<th style="border: 1px solid black; border-collapse: collapse;">${key}</th>`);
        });
        headerRow.append('<th style="border: 1px solid black; border-collapse: collapse;">Action</th>');
        tableHeader.append(headerRow);

        orders.forEach(function (order) {
            const bodyRow = $('<tr>');
            $.each(order, function (key, value) {
                bodyRow.append(`<td style="border: 1px solid black; border-collapse: collapse;">${value}</td>`);
            });

            // Add order button (Accept/Reject)
            const orderButton = $('<button class="editOrderBtn">Update</button>');
            orderButton.click(function () {
                // Populate modal with current order data
                $('#editOrderStatusModal').data('orderId', order.order_id).show();
            });

            // Action cell with the button
            const actionCell = $('<td style="border: 1px solid black; border-collapse: collapse;"></td>').append(orderButton);
            bodyRow.append(actionCell);

            tableBody.append(bodyRow);
        });
    } else {
        tableBody.append('<tr><td colspan="100%" style="border: 1px solid black; border-collapse: collapse;">No orders available</td></tr>');
    }
}

    

    
    $('#btnOrderStatusUpdate').click(function () {
        const orderId = $('#editOrderStatusModal').data('orderId');
        const newOrderStatus = $('#editOrderStatusCategory').val();
        // Add your AJAX call here to update the order status
        $.ajax({
            type: 'POST',
            url: '/updateOrderStatusTwo',
            data: {
                orderId: orderId,
                order_status: newOrderStatus
            },
            success: function(response) {
                alert('Order status updated successfully');
                $('#editOrderStatusModal').hide();
                // Refresh the delivery list
                getOrder(); // Assuming you have a function to fetch and display the delivery list
            },
            error: function(response) {
                alert('Failed to update order status');
            }
        });
    });

    $('#btnStatusCancel').click(function () {
        $('#editStatusModal').hide();
    });
    $('#btnOrderStatusCancel').click(function () {
        $('#editOrderStatusModal').hide();
    });
    
    

    //function to populate admin list table
    function adminList(admins) {
        const tableHeader = $('#adminListTable thead');
        const tableBody = $('#adminListTable tbody');
        tableHeader.empty();
        tableBody.empty();
    
        if (admins.length > 0) {
            const headerRow = $('<tr>');
    
            //create table headers from the keys of the first admin object
            $.each(admins[0], function (key) {
                headerRow.append(`<th style="border: 1px solid black; border-collapse: collapse;">${key}</th>`);
            });
            headerRow.append('<th style="border: 1px solid black; border-collapse: collapse;">Action</th>');
            tableHeader.append(headerRow);
    
            //create table body rows for each admin
            admins.forEach(function (admin) {
                const bodyRow = $('<tr>');
                $.each(admin, function (key, value) {
                    bodyRow.append(`<td style="border: 1px solid black; border-collapse: collapse;">${value}</td>`);
                });
                bodyRow.append(`<td><button class="deleteAdmin" data-id="${admin.id}">Delete</button></td>`);
                tableBody.append(bodyRow);
            });
        } else {
            //no admin
            tableBody.append('<tr><td colspan="100%">No admins available</td></tr>');
        }
    
        
        //click event to delete button
        $('.deleteAdmin').click(function () {
            const adminId = $(this).data('id');
            const row = $(this).closest('tr');
            const adminCount = $('#adminListTable tbody tr').length;
    
            if (adminCount > 1) {
                deleteAdminById(adminId, row);
            } else {
                alert('Cannot delete the last remaining admin.');
            }
        });
    }
    
    //function to handle admin deletion
    function deleteAdminById(id, row) {
        if (confirm('Are you sure you want to delete this admin?')) {
            $.ajax({
                url: `/getadmin/${id}`,
                type: 'DELETE',
                success: function (result) {
                    //on sucess, delete row
                    row.remove();
                    alert('Admin deleted successfully');
                },
                fail: function (response) {
                    alert("Failed to delete admin: " + response);
                }
            });
        }
    }

    //function to get admin
    function getAdmin() {
        $.ajax({
            type: "GET",
            url: "/getadmin",
            cache: false,
            success: function (response) {
                adminList(response); 
            },
            fail: function (response) {
                console.log(response);
            }
        });
    }

    
    //to view customer when click btn
    $('#viewManageCustomerAccountBtn').click(function (e) {
        e.preventDefault();
        $.ajax({
            type: "GET",
            url: "/getcustomers",
            cache: false,
            success: function (response) {
                customerList(response); 
            },
            fail: function (response) {
                console.log(response);
            }
        });
    });

    //to show customer list
    $('#manageCustomerAccountBtn').click(function () {
        $('#viewProductSection').hide();
        $('#addProductSection').hide();
        $('#viewManageCustomerAccountSection').show();
        $('#logOutSection').hide();
        $('#editProductModal').hide();
        $('#viewOrdersSection').hide();
        $('#viewManageAdminAccountSection').hide();
        $('#editOrderStatusModal').hide();
        $('#viewProcessOrderSection').hide();
        //get customers
        getCustomers(); 
    });

    //function to populate customer users list table
    function customerList(customers) {
        const tableHeader = $('#customerListTable thead');
        const tableBody = $('#customerListTable tbody');
        tableHeader.empty();
        tableBody.empty();

        if (customers.length > 0) {
            const headerRow = $('<tr>');

            //create table headers from the keys of the first user object
            $.each(customers[0], function (key) {
                headerRow.append(`<th style="border: 1px solid black; border-collapse: collapse;">${key}</th>`);
            });
            headerRow.append('<th style="border: 1px solid black; border-collapse: collapse;">Action</th>');
            tableHeader.append(headerRow);

            //create table body rows for each user
            customers.forEach(function (customer) {
                const bodyRow = $('<tr>');
                $.each(customer, function (key, value) {
                    bodyRow.append(`<td style="border: 1px solid black; border-collapse: collapse;">${value}</td>`);
                });
                bodyRow.append(`<td><button class="deleteCustomer" data-id="${customer.id}">Delete</button></td>`);
                tableBody.append(bodyRow); 
            });
             // delete buttons for customer
             $('.deleteCustomer').click(function () {
                const id = $(this).data('id');
                const row = $(this).closest('tr');
                deleteCustomerById(id, row);
            });
        } else {
            //no customers to display
            tableBody.append('<tr><td colspan="100%">No customers available</td></tr>');
        }
    }

    //function to get users
    function getCustomers() {
        $.ajax({
            type: "GET",
            url: "/getcustomers",
            cache: false,
            success: function (response) {
                customerList(response); 
            },
            fail: function (response) {
                console.log(response);
            }
        });
    }

    //function to handle customer deletion
    function deleteCustomerById(id, row) {
        if (confirm('Are you sure you want to delete this customer?')) {
            $.ajax({
                url: `/getcustomers/${id}`,
                type: 'DELETE',
                success: function (result) {
                    //on sucess, delete row
                    row.remove();
                    alert('Customer deleted successfully');
                },
                fail: function (response) {
                    alert("Failed to customer admin: " + response);
                }
            });
        }
    }


    //to request to get all product
    $.ajax({
        type: "GET",
        url: "/all",
        cache: false,
        success: function (response) {
            productList(response);
        },
        fail: function (response) {
            console.log(response);
        }
    });


    //function to append the product data to table
    function productList(arrProduct) {
        const tableHeader = $('#testTable thead');
        const tableBody = $('#testTable tbody');
        tableHeader.empty();
        tableBody.empty();

        if (arrProduct.length > 0) {
            const headerRow = $('<tr>');

            //to create table for keys in first object
            $.each(arrProduct[0], function (key) {
                headerRow.append(`<th style="border: 1px solid black; border-collapse: collapse;">${key}</th>`);
            });
            headerRow.append('<th style="border: 1px solid black; border-collapse: collapse;">Edit</th>');
            headerRow.append('<th style="border: 1px solid black; border-collapse: collapse;">Delete</th>');
            tableHeader.append(headerRow);

            //to create table body rows
            arrProduct.forEach(function (product) {
                const bodyRow = $('<tr>');
                $.each(product, function (key, value) {

                //to view the image
                if (key === 'imageFileName') {
                    bodyRow.append(`<td><img src="/images/${value}" alt="${product.name}" class="product-image"></td>`);
                } else {
                    bodyRow.append(`<td style="border: 1px solid black; border-collapse: collapse;">${value}</td>`);
                }
                });
                //edit 
                bodyRow.append(`<td><button class="editProduct" data-id="${product.id}">Edit</button></td>`);  
                bodyRow.append(`<td><button class="deleteProduct" data-id="${product.id}">Delete</button></td>`);              
                tableBody.append(bodyRow);
            });
        } else {
            //if the array is empty or there is no product listed
            tableBody.append('<tr><td colspan="100%">No products available</td></tr>');
        }
    }

    //to view product
    $('#viewProduct').click(function (e) {
    e.preventDefault();
        $.ajax({
            type: "GET",
            url: "/all",
            cache: false,
            success: function (response) {
                getAllProduct = response;
                productList(response);
            },
            fail: function (response) {
                console.log(response);
            }
        });
    });
    
    //to view product
    $('#viewAllProduct').click(function (e) {
        e.preventDefault();
        $.ajax({
            type: "GET",
            url: "/all",
            cache: false,
            success: function (response) {
                getAllProduct = response;
                productList(response);
            },
            fail: function (response) {
                console.log(response);
            }
        });
    });

    //to search product
    $('#searchProduct').click(function (e) {
        e.preventDefault();

    //to check if the input search is empty or not
    var searchValue = $("#fldName").val().trim();

    //if the search input is empty, view all products
        if (searchValue === "") {
            $.ajax({
                type: "GET",
                url: "/all",
                cache: false,
                success: function (response) {
                    productList(response);
                },
                fail: function (response) {
                    console.log(response);
                }
            });
        } else {
            //if the search input has value then search for it
            $.ajax({
                type: "GET",
                url: "/product/search",
                cache: false,
                data: {
                    "name": searchValue
                },
                dataType: "JSON",
                success: function (response) {
                    productList(response);
                },
                fail: function (response) {
                    console.log(response);
                }
            });
        }   
    });

    //to add product on the table of product list
    //to add product on the table of product list
    $('#addProductForm').submit(function (e) {
        e.preventDefault();
    
        // Error message handling
        $('.errorMessage').text('');
    
        // Gather form data
        var name = $('#name').val().trim();
        var category = $('#category').val().trim();
        var price = parseFloat($('#price').val().trim());
        var quantity = parseInt($('#quantity').val().trim());
        var description = $('#description').val().trim();
        var imageFileInput = $('#imageFileName')[0]; // File input element
    
        var isValid = true;
    
        // Validation
        if (name === "") {
            $('#nameError').text("Name is required.");
            isValid = false;
        }
        if (category === "") {
            $('#categoryError').text("Category is required.");
            isValid = false;
        }
        if (isNaN(price) || price <= 1) {
            $('#priceError').text("Valid price is required.");
            isValid = false;
        }
        if (isNaN(quantity) || quantity <= 0) {
            $('#quantityError').text("Valid quantity is required.");
            isValid = false;
        }
        if (description === "") {
            $('#descriptionError').text("Description is required.");
            isValid = false;
        }
        if (imageFileInput.files.length === 0) {
            $('#imageFileNameError').text("Image file is required.");
            isValid = false;
        }
    
        if (!isValid) {
            // Not proceeding if validation fails
            return;
        }
    
        // Prepare FormData object
        var formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('description', description);
        formData.append('imageFile', imageFileInput.files[0]); // Append image file
    
        // AJAX request to add product
        $.ajax({
            type: "POST",
            url: "/add",
            data: formData,
            processData: false,
            contentType: false,
            cache: false,
            success: function (response) {
                console.log(response);
                alert("Product added successfully.");
    
                // Clear the form for successful submission
                $('#addProductForm')[0].reset();
    
                // Reload the product list
                reloadProductList();
            },
            error: function (response) {
                console.log(response);
                alert("Failed to add product. Please try again.");
            }
        });
    
    

        //for frontend customers 
        //this will trigger when admin did add for each category
        $.ajax({
            type: "POST",
            url: "/triggerUpdateForCustomers",
            success: function(response) {
                console.log("Customer frontend update triggered successfully!");
            },
            fail: function (response) {
                console.log("Failed to trigger update for customers",response);
            }
        });
    });

    //edit product
    $('#testTable').on('click', '.editProduct', function () {
        const productId = $(this).data('id');

        //to obtain details that based on id
        $.ajax({
            type: "GET",
            //backend endpoint to edit product on its id
            url: `/product/${productId}`, 
            cache: false,
            success: function (product) {
            //form field with prouduct detials for editing
            $('#editProductId').val(product.id);
            $('#editName').val(product.name);
            $('#editCategory').val(product.category);
            $('#editPrice').val(product.price);
            $('#editQuantity').val(product.quantity);
            $('#editDescription').val(product.description);
    

            //leave the input file as empty
            //because for the input field the type file is not allowed on js
            //files that has value cannot be unless it has empty string
            $('#editImageFileName').val('');

            //to show the edit product modal
            $('#editProductModal').css('display', 'block');
            },
            fail: function (response) {
                console.log(response);
            }
        });
    });

    //to update product
    $('#btnUpdate').click(function (e) {
        //to prevent form submission and to page reload
        e.preventDefault();
    
        //declare
        //selecting imageFileInput to by accsessing first element 0
        var imageFileInput = $('#editImageFileName')[0];
        //creating formData object
        //FormData to provides way for key value pairs
        var formData = new FormData();

        //check if the imagefile exists
        if (imageFileInput && imageFileInput.files && imageFileInput.files.length > 0) {

            //retrieves the first file of the input
            var imageFile = imageFileInput.files[0];
            //append 
            formData.append('imageFile', imageFile);
        }

        //to retreives the current
        var name = $('#editName').val();
        var category = $('#editCategory').val();
        var price = parseFloat($('#editPrice').val());
        var quantity = parseInt($('#editQuantity').val());
        var description = $('#editDescription').val();


        //validaiton
        var isValid = true;

        //validation
        if (name === "") {
            $('#editNameError').text("Name is required.");
            isValid = false;
        }
        if (category === "") {
            $('#editCategoryError').text("Category is required.");
            isValid = false;
        }
        if (isNaN(price) || price <= 0) {
            $('#editPriceError').text("Valid price is required.");
            isValid = false;
        }
        if (isNaN(quantity) || quantity <= 0) {
            $('#editQuantityError').text("Valid quantity is required.");
            isValid = false;
        }
        if (description === "") {
            $('#editDescriptionError').text("Description is required.");
            isValid = false;
        }
        if (imageFileInput.files.length === 0) {
            $('#editImageFileNameError').text("Image file is required.");
            isValid = false;
        }  

        if (!isValid) {
            //not procceeding
            return;
        }

        //if the form is valid it will contrinue on ajax
        //object creation
        var productData = {
            //retrrives id that holds int
            id: parseInt($('#editProductId').val()),
            name: name,
            category: category,
            price: price,
            quantity: quantity,
            description: description
        };

        //prepares the  product data 
        //creating new blob object containing js
        //the type to inform the server that request is json data to backend
        formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));

        $.ajax({
            type: "PUT",
            url: `/product/${$('#editProductId').val()}`,
        //contain product data
            data: formData,
            //IMPORTANT THESE TWO
            //prevent jquery for automatic processing the data, must handle MANUALLY
            processData: false,
            //to ensure that content tpe is not set and form data wll set the correct headers
            contentType: false,
            success: function (response) {
                console.log("Product updated successfully:", response);
                alert("Product updated successfully.");
                //to hide modal for successful update
                $('#editProductModal').hide(); 

                //clear the image file to reset
                $('#editImageFileName').val('');
                reloadProductList();
            
                //to reset the form with update btn
                $('#btnUpdate')[0].reset();
            },
            fail: function (response) {
                console.log(response);
                alert("Failed to update product. Please try again.");
            }
        });
    });

        //to cancel edit modal
        $('#btnCancel').click(function () {
        //to close the edit modal without saving changes
        $('#editProductModal').css('display', 'none');
        });

        

    //function to reload product list after update
    function reloadProductList() {
        // reload poduct
        $.ajax({
            type: "GET",
            url: "/all",
            cache: false,
            success: function (response) {
                //updating the table with the updated product list
                productList(response); 
            },
            fail: function (response) {
                console.log(response);
            }
        });
    }

    //delete product
    $(document).on('click', '.deleteProduct', function () {
        //get product id from the input
        const productId = $(this).data('id');

        //if user click ok and aks conficmation before delete
        if (confirm("Are you sure you want to delete this product?")) {
            deleteProduct(productId);
        }
    });

    //function to delete(produt id)
    function deleteProduct(productId) {
        $.ajax({
            type: 'DELETE',
            //must match the controller
            url: `/product/${productId}`, 
            success: function (response) {
                console.log('Product deleted successfully:', response);
                alert('Product deleted successfully.');
                //reload after deletion
                reloadProductList();
            },
            fail: function (xhr, status, error) {
                console.error('Error deleting product:', xhr.responseText);
                alert('Failed to delete product. Please try again.');
            }
        });
    }

    
});