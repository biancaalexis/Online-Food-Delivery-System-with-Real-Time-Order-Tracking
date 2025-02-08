package com.finalproject.craveit.OrderHistory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.finalproject.craveit.Config.RabbitMQConfig;
import com.finalproject.craveit.Product.Product;
import com.finalproject.craveit.Product.ProductRepository;

@Controller
public class OrdersController {

    @Autowired
    public OrdersRepository ordersRepository;

    private static final Logger log = LoggerFactory.getLogger(OrdersController.class);
    
@GetMapping("/getOrderList")
public @ResponseBody List<OrdersDTO> getAllOrders() {
    List<Orders> orders = ordersRepository.findAll();
    List<OrdersDTO> orderDTOs = new ArrayList<>();
    for (Orders order : orders) {
        OrdersDTO dto = new OrdersDTO();
        dto.setOrder_id(order.getOrder_id());
        dto.setUser_id(order.getUser_id());
        dto.setProduct_id(order.getProduct_id());
        dto.setProduct_name(order.getProduct_name());
        dto.setQuantity(order.getQuantity());
        dto.setPrice(order.getPrice());
        dto.setTotal(order.getTotal());
        dto.setMop(order.getMop());
        dto.setOrderStatus(order.getOrderStatus());
        orderDTOs.add(dto);
    }
    return orderDTOs;
}

@GetMapping("/getProccessOrderList")
public @ResponseBody List<OrdersDTO> getAllProcessOrders() {
    List<Orders> orders = ordersRepository.findAll();
    List<OrdersDTO> orderDTOs = new ArrayList<>();
    for (Orders order : orders) {
        OrdersDTO dto = new OrdersDTO();
        dto.setOrder_id(order.getOrder_id());
        dto.setUser_id(order.getUser_id());
        dto.setProduct_id(order.getProduct_id());
        dto.setProduct_name(order.getProduct_name());
        dto.setQuantity(order.getQuantity());
        dto.setPrice(order.getPrice());
        dto.setTotal(order.getTotal());
        dto.setMop(order.getMop());
        dto.setOrderStatus(order.getOrderStatus());
        orderDTOs.add(dto);
    }
    return orderDTOs;
}



@Autowired
private ProductRepository productRepository;

@Autowired
private RabbitTemplate rabbitTemplate;

private static final String EXCHANGE_NAME = "order.exchange";
private static final String ROUTING_KEY = "order.placed";

// for orders 
@PostMapping("/orders")
@Transactional
public ResponseEntity<String> saveOrders(@RequestBody List<Orders> ordersList) {
    try {
        for (Orders order : ordersList) {
            // Check if the product exists and is available
            Product existingProduct = productRepository.findById(order.getProduct_id()).orElse(null);
            if (existingProduct == null) {
                log.error("Product not found: " + order.getProduct_id());
                return ResponseEntity.badRequest().body("Product not found with id: " + order.getProduct_id());
            }

            if (existingProduct.getQuantity() < order.getQuantity()) {
                log.error("Insufficient stock for product: " + order.getProduct_id());
                return ResponseEntity.badRequest().body("Insufficient stock for product id: " + order.getProduct_id());
            }

            // Update product quantity
            existingProduct.setQuantity(existingProduct.getQuantity() - order.getQuantity());
            productRepository.save(existingProduct);

            // Set order status and mode of payment
            order.setMop("Gcash");
            order.setOrderStatus("Accept/Reject Order");
        }

        // Save all orders and send event to RabbitMQ
        ordersRepository.saveAll(ordersList);
        ordersList.forEach(order -> {
            try {
                // Serialize order object to JSON string
                String orderJson = new ObjectMapper().writeValueAsString(order);
        
                // Send JSON message to RabbitMQ
                log.info("Sending order to RabbitMQ: " + orderJson);
                rabbitTemplate.convertAndSend(EXCHANGE_NAME, ROUTING_KEY, orderJson);
        
            } catch (JsonProcessingException e) {
                log.error("Failed to convert order to JSON", e);
            }
        });
        

        return ResponseEntity.ok("Order placed and quantities updated successfully");
    } catch (Exception e) {
        log.error("Failed to place order", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to place order: " + e.getMessage());
    }
}
//for update
@PostMapping("/updateOrderStatusTwo")
public ResponseEntity<String> updateOrderStatusTwo(@RequestParam Integer orderId, @RequestParam String order_status) {
    Optional<Orders> optionalOrder = ordersRepository.findById(orderId);
    
    if (optionalOrder.isPresent()) {
        Orders order = optionalOrder.get();
        order.setOrderStatus(order_status);
        ordersRepository.save(order);
        
        // Prepare message for notification
        String notificationMessage = "The order " + orderId + " is " + (order_status.equals("Accepted") ? "accepted" : "rejected");

        // Send status update to RabbitMQ
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String jsonMessage = objectMapper.writeValueAsString(order);
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY, jsonMessage);
            System.out.println("Order status updated in RabbitMQ.");

            // Send notification message to customer via RabbitMQ
            String notificationJson = objectMapper.writeValueAsString(notificationMessage);
            rabbitTemplate.convertAndSend(RabbitMQConfig.NOTIFICATION_EXCHANGE, 
            RabbitMQConfig.NOTIFICATION_ROUTING_KEY, 
            notificationJson);
            System.out.println("Order status sending notification to customer...");
           
            
        } catch (JsonProcessingException e) {
            log.error("Failed to convert order to JSON", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update order status: " + e.getMessage());
        }
        
        return ResponseEntity.ok("Order status updated successfully and message sent to RabbitMQ");
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
    }
}


    

    @GetMapping("/getOrdersByUserId")
    public @ResponseBody List<OrdersDTO> getOrdersByUserId(@RequestParam("user_id") Integer userId) {
        Iterable<Orders> ordersIterable = ordersRepository.findByUserId(userId);
        List<Orders> orders = new ArrayList<>();
        ordersIterable.forEach(orders::add);  // Convert Iterable to List

        List<OrdersDTO> orderDTOs = new ArrayList<>();
        for (Orders order : orders) {
            OrdersDTO dto = new OrdersDTO();
            dto.setOrder_id(order.getOrder_id());
            dto.setUser_id(order.getUser_id());
            dto.setProduct_id(order.getProduct_id());
            dto.setProduct_name(order.getProduct_name());
            dto.setQuantity(order.getQuantity());
            dto.setPrice(order.getPrice());
            dto.setTotal(order.getTotal());
            dto.setMop(order.getMop());
            dto.setOrderStatus(order.getOrderStatus());
            orderDTOs.add(dto);
        }
        return orderDTOs;
    }
    @GetMapping("/getProcessOrders")
@ResponseBody
public List<OrdersDTO> getProcessOrders() {
    Iterable<Orders> ordersIterable = ordersRepository.findByOrderStatus("Accepted");
    List<Orders> orders = new ArrayList<>();
    ordersIterable.forEach(orders::add);  // Convert Iterable to List

    List<OrdersDTO> orderDTOs = new ArrayList<>();
    for (Orders order : orders) {
        OrdersDTO dto = new OrdersDTO();
        dto.setOrder_id(order.getOrder_id());
        dto.setUser_id(order.getUser_id());
        dto.setProduct_id(order.getProduct_id());
        dto.setProduct_name(order.getProduct_name());
        dto.setQuantity(order.getQuantity());
        dto.setPrice(order.getPrice());
        dto.setTotal(order.getTotal());
        dto.setMop(order.getMop());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setDeliveryPersonnel(order.getDeliveryPersonnel());
        orderDTOs.add(dto);
    }

   
    return orderDTOs;
}
    


@RestController
@RequestMapping("/delivery")
public class DeliveryController {

    @Autowired
    private OrdersRepository ordersRepository;
    @GetMapping("/assignedOrders")
public ResponseEntity<List<Orders>> getAssignedOrders() {
    // Hardcoded delivery personnel name (only one for now)
    String deliveryPersonnel = "Delivery Guy 1"; 

    // Fetch orders assigned to the specific delivery person
    List<Orders> assignedOrders = ordersRepository.findByDeliveryPersonnel(deliveryPersonnel);
    return ResponseEntity.ok(assignedOrders);
    }

    
}

@PostMapping("/assignDelivery")
@ResponseBody
public ResponseEntity<String> assignDeliveryPersonnel(@RequestParam Integer orderId, @RequestParam String deliveryPersonnel) {
    Optional<Orders> orderOptional = ordersRepository.findById(orderId);
    
    if (orderOptional.isPresent()) {
        Orders order = orderOptional.get();
        order.setDeliveryPersonnel(deliveryPersonnel);
        ordersRepository.save(order);  // Save updated order

        // Create the message to send to RabbitMQ
        Map<String, Object> deliveryMessage = new HashMap<>();
        deliveryMessage.put("order_id", order.getOrder_id());
        deliveryMessage.put("delivery_personnel", deliveryPersonnel);
        deliveryMessage.put("status", "Assigned");

        // Publish message to RabbitMQ
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.DELIVERY_ASSIGNMENT_ROUTING_KEY, deliveryMessage);
        System.out.println("Delivery Personnel " + deliveryPersonnel + " to Order ID: " + order.getOrder_id() + " sent to RabbitMQ");

        return ResponseEntity.ok("Delivery Personnel Assigned Successfully");
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order Not Found");
    }
}


@PostMapping("/updateDeliveryStatus")
public ResponseEntity<String> updateDeliveryStatus(@RequestParam Integer orderId, @RequestParam String deliveryStatus) {
    System.out.println("Received orderId: " + orderId + ", deliveryStatus: " + deliveryStatus); // Debugging line
    
    // Fetch the order by orderId
    Optional<Orders> optionalOrder = ordersRepository.findById(orderId);
    
    if (optionalOrder.isPresent()) {
        Orders order = optionalOrder.get();
        
        // Set the new delivery status
        order.setDeliveryStatus(deliveryStatus);  // Updates the delivery_status field
        
        // Save the updated order object to the database
        ordersRepository.save(order);
        System.out.println("Updated order delivery status to: " + deliveryStatus);
        
        // Serialize the order object to JSON (assuming Jackson2 is configured for RabbitMQ message conversion)
        try {
            // Send status update to RabbitMQ
            rabbitTemplate.convertAndSend(
                RabbitMQConfig.CUSTOMER_NOTIFICATION_EXCHANGE,
                RabbitMQConfig.CUSTOMER_NOTIFICATION_ROUTING_KEY,
                order  // Send the updated order object
            );
            System.out.println("Sent order update to RabbitMQ: " + deliveryStatus);
            
            return ResponseEntity.ok("Order delivery status updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to send order update to RabbitMQ");
        }
    } else {
        return ResponseEntity.status(404).body("Order not found");
    }
}


    @GetMapping("/completedOrders")
public ResponseEntity<List<Orders>> getCompletedOrders() {
    // Fetch orders where the delivery status is "Delivered"
    List<Orders> completedOrders = ordersRepository.findByDeliveryStatus("Delivered");

    // Check if there are any completed orders
    if (completedOrders.isEmpty()) {
        return ResponseEntity.status(404).body(Collections.emptyList()); // Return empty list if no completed orders found
    }
    
    return ResponseEntity.ok(completedOrders); // Return the list of completed orders
}


    
    
}
