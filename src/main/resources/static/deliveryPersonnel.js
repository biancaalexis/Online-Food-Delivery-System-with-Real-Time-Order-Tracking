$(document).ready(function () {
    // Hide all sections initially
    $('.contentD > div').hide();

    // Function to handle showing and hiding sections
    function showSection(sectionId) {
        $('.contentD > div').hide(); // Hide all sections
        $(sectionId).show(); // Show the selected section
    }

    // Assign button click handlers
    $('#assignOrderBtn').click(function () {
        showSection('#viewAssignOrdersSection');
        fetchAssignedOrders();
    });

    $('#completedOrdersBtn').click(function () {
        showSection('#viewCompletedOrdersSection');
        fetchCompletedOrders()
    });

    // Logout button
    $('#logOutBtn').click(function () {
        $('.contentD > div').hide(); // Hide all sections
        if (confirm("Are you sure you want to logout?")) {
            window.location.href = "index.html";
        }
    });

    // Fetch assigned orders
    function fetchAssignedOrders() {
        $.ajax({
            url: "/delivery/assignedOrders",  // Correct API URL
            method: "GET",
            success: function (orders) {
                let tableBody = $("#assignOrderListTable tbody");
                let tableHeader = $("#assignOrderListTable thead");
                tableBody.empty(); // Clear previous data

                // Check if there are no assigned orders
                if (orders.length === 0) {
                    tableBody.append("<tr><td colspan='8'>No assigned orders yet.</td></tr>");
                    return;
                }

                // Create the table header dynamically based on order keys (first order)
                if (tableHeader.is(':empty')) {
                    let headerRow = $('<tr>');
                    $.each(orders[0], function (key, value) {
                        // Exclude unnecessary fields from header
                        if (key !== "deliveryPersonnel") {
                            headerRow.append(`<th style="border: 1px solid black; border-collapse: collapse;">${key}</th>`);
                        }
                    });
                    headerRow.append('<th style="border: 1px solid black; border-collapse: collapse;">Action</th>');
                    tableHeader.append(headerRow);
                }

                // Loop through orders and add rows to the table
                orders.forEach(order => {
                    let bodyRow = $('<tr>');

                    // Dynamically populate table rows with order data
                    $.each(order, function (key, value) {
                        // Exclude deliveryPersonnel field or any unnecessary fields
                        if (key !== "deliveryPersonnel") {
                            bodyRow.append(`<td style="border: 1px solid black; border-collapse: collapse;">${value}</td>`);
                        }
                    });

                    // Add a column for Action (Assign button)
                    const actionCell = $('<td style="border: 1px solid black; border-collapse: collapse;"></td>')
                        .append('<button class="assignOrderBtn">Action</button>'); // You can replace this with your "To Do" or other actions
                    bodyRow.append(actionCell);

                    tableBody.append(bodyRow);
                });
            },
            error: function () {
                console.error("Failed to fetch assigned orders.");
            }
        });
    }

    //compelted orders
    function fetchCompletedOrders() {
        $.ajax({
            url: "/completedOrders",  // Correct API URL for completed orders
            method: "GET",
            success: function (orders) {
                let tableBody = $("#completedOrderListTable tbody");
                let tableHeader = $("#completedOrderListTable thead");
                tableBody.empty(); // Clear previous data
    
                // Check if there are no completed orders
                if (orders.length === 0) {
                    tableBody.append("<tr><td colspan='8'>No completed orders yet.</td></tr>");
                    return;
                }
    
                // Create the table header dynamically based on order keys (first order)
                if (tableHeader.is(':empty')) {
                    let headerRow = $('<tr>');
                    $.each(orders[0], function (key, value) {
                        // Exclude unnecessary fields from header
                        if (key !== "deliveryPersonnel") {
                            headerRow.append(`<th style="border: 1px solid black; border-collapse: collapse;">${key}</th>`);
                        }
                    });
                    tableHeader.append(headerRow);
                }
    
                // Loop through orders and add rows to the table
                orders.forEach(order => {
                   // console.log(order.deliveryStatus); // Debugging the order status
                    // Only show orders with a "Delivered" status (or any condition for completed)
                    if (order.deliveryStatus === "Delivered") {
                        let bodyRow = $('<tr>');
    
                        // Dynamically populate table rows with order data
                        $.each(order, function (key, value) {
                            // Exclude deliveryPersonnel field or any unnecessary fields
                            if (key !== "deliveryPersonnel") {
                                bodyRow.append(`<td style="border: 1px solid black; border-collapse: collapse;">${value}</td>`);
                            }
                        });
    
                        tableBody.append(bodyRow);
                    }
                });
            },
            error: function () {
                console.error("Failed to fetch completed orders.");
            }
        });
    }
    

    // Assign button click event to show the modal
    $(document).on('click', '.assignOrderBtn', function() {
        const orderRow = $(this).closest('tr');
        const orderId = orderRow.find('td:first').text();  // Assuming the first column is order_id
        
        // Show the modal
        $('#orderStatusDeliveryModal').fadeIn();

        // Set order ID in the modal's hidden field
        $('#orderStatusDeliveryModal').data('orderId', orderId);
    });

    // Cancel button click event to hide the modal
    $('#btnOrderStausCancel').click(function() {
        $('#orderStatusDeliveryModal').fadeOut();
    });

    $('#btnOrderStatusDelivery').click(function() {
        const orderId = $('#orderStatusDeliveryModal').data('orderId');  // Make sure orderId is correctly set
        const deliveryStatus = $('#editOrderStatusDelivery').val();  // Get the selected delivery status
    
        console.log("Order ID:", orderId, "Delivery Status:", deliveryStatus);  // Debugging log
    
        $.ajax({
            url: "/updateDeliveryStatus",
            method: "POST",
            data: {
                orderId: orderId,
                deliveryStatus: deliveryStatus
            },
            success: function(response) {
                console.log("Order delivery status updated successfully:", response);
                alert('Order delivery status updated successfully!'); // Inform the user
                $('#orderStatusDeliveryModal').fadeOut();
                fetchAssignedOrders();  // Refresh the assigned orders list
            },
            error: function(xhr, status, error) {
                console.error("Failed to update order delivery status:", error);
                alert('Error updating order status. Please try again.'); // Inform the user about the error
            }
        });
        
    });

    function listenForDeliveryNotifications() {
        const eventSource = new EventSource("http://localhost:8080/order-updates-delivery");
    
        eventSource.onopen = function () {
            console.log("EventSource connection opened");
        };
    
        eventSource.onmessage = function (event) {
            console.log("New delivery update received:", event.data);
    
            try {
                // Parse JSON response from SSE
                const messageData = JSON.parse(event.data);
                
                // Extract relevant details
                const orderId = messageData.order_id;
                const deliveryPersonnel = messageData.delivery_personnel;
    
                // Display notification
                showForDeliveryNotifications(orderId, deliveryPersonnel);
            } catch (error) {
                console.error("Error parsing delivery update:", error);
            }
        };
    
        eventSource.onerror = function (error) {
            console.error("Error receiving SSE:", error);
            console.log("EventSource readyState:", eventSource.readyState);
            eventSource.close();
    
            // Retry connection after 5 seconds
            setTimeout(listenForDeliveryNotifications, 5000);
        };
    }
    
    // Function to display delivery notifications
    function showForDeliveryNotifications(orderId, deliveryPersonnel) {
        if (!orderId || !deliveryPersonnel) {
            console.error("Received incomplete notification data.");
            return;
        }
    
        const message = `Order ID: ${orderId} has been assigned to ${deliveryPersonnel}.`;
    
        // Create the notification element
        var notification = $('<div class="delivery-notification"></div>').text(message);
        $('body').append(notification);
    
        // Style the notification
        notification.css({
            position: 'fixed',
            top: '50px',
            right: '50px',
            background: '#28a745',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            zIndex: 10000,
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
        });
    
        // Remove notification after 5 seconds
        setTimeout(function () {
            notification.fadeOut(300, function() {
                notification.remove();
            });
        }, 5000);
    
        // Play sound notification
        var sound = document.getElementById('orderSound');
        if (sound) {
            sound.volume = 1.0;
            sound.play();
        } else {
            console.warn("Sound element not found.");
        }
    }
    
    // Start listening for notifications when the page loads
    $(document).ready(function() {
        listenForDeliveryNotifications();
    });
    
});
