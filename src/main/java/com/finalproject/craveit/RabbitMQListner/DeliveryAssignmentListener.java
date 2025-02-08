package com.finalproject.craveit.RabbitMQListner;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.finalproject.craveit.Config.RabbitMQConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
@RestController
@CrossOrigin(origins = "http://localhost:8080")  // Allow frontend access
public class DeliveryAssignmentListener {

    private static final Logger log = LoggerFactory.getLogger(DeliveryAssignmentListener.class);
    private static final List<SseEmitter> emitters = new ArrayList<>();

    // Listen for messages from RabbitMQ (delivery assignments)
    @RabbitListener(queues = RabbitMQConfig.DELIVERY_ASSIGNMENT_QUEUE)
    public void receiveDeliveryAssignmentNotification(Map<String, Object> message) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String orderUpdateJson = objectMapper.writeValueAsString(message);

            System.out.println("Received Delivery Assignment: " + orderUpdateJson);

            // Send updates to connected clients
            notifyClients(orderUpdateJson);

        } catch (IOException e) {
            log.error("Failed to process delivery assignment message", e);
        }
    }

    // SSE Endpoint to stream order updates for delivery personnel
    @GetMapping("/order-updates-delivery")
    public ResponseEntity<SseEmitter> streamDeliveryUpdates() {
        SseEmitter emitter = new SseEmitter();
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));

        return ResponseEntity.ok()
                             .contentType(MediaType.TEXT_EVENT_STREAM)
                             .body(emitter);
    }

    // Send messages to all connected clients
    private void notifyClients(String message) {
        List<SseEmitter> deadEmitters = new ArrayList<>();
        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event().data(message));
            } catch (Exception e) {
                deadEmitters.add(emitter);  // Remove failed emitters
            }
        });
        emitters.removeAll(deadEmitters);  // Clean up failed connections
    }
}


// import org.slf4j.Logger;
// import org.springframework.amqp.rabbit.annotation.RabbitListener;
// import org.slf4j.LoggerFactory;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.fasterxml.jackson.core.type.TypeReference;
// import java.io.IOException;
// import java.util.Map;
// import org.springframework.stereotype.Component;

// @Component
// public class DeliveryAssignmentListener {

//     private static final Logger log = LoggerFactory.getLogger(DeliveryAssignmentListener.class);

//     @RabbitListener(queues = "delivery.assignment.queue")
//     public void receiveDeliveryAssignmentNotification(Map<String, Object> message) {
//         try {
//             String orderId = message.get("order_id").toString();
//             String deliveryPersonnel = message.get("delivery_personnel").toString();
    
//             System.out.println("Delivery Assigned: Order ID: " + orderId + ", Assigned to: " + deliveryPersonnel);
    
//             // Notify delivery personnel via WebSocket (if needed)
//             notifyDeliveryPersonnel(deliveryPersonnel, "You have been assigned to Order ID: " + orderId);
    
//         } catch (Exception e) {
//             log.error("Failed to process delivery assignment message", e);
//         }
//     }
    

//     // private void notifyDeliveryPersonnel(String deliveryPersonnel, String message) {
//     //     // This is a placeholder for WebSocket or real-time notification implementation.
//     //     System.out.println("Notification sent to " + deliveryPersonnel + ": " + message);
//     // }
    
// }
