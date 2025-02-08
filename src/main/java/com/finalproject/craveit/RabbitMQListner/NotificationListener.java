package com.finalproject.craveit.RabbitMQListner;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finalproject.craveit.Config.RabbitMQConfig;
import com.finalproject.craveit.OrderHistory.Orders;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@RestController
@CrossOrigin(origins = "http://localhost:8080")  // Allow frontend to access
public class NotificationListener {

    private static final Logger log = LoggerFactory.getLogger(NotificationListener.class);

    private static final List<SseEmitter> emitters = new ArrayList<>();

    @RabbitListener(queues = "notification.queue")  // Listening to the correct queue
    public void receiveOrderUpdateNotification(String notificationMessage) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            // Parse notification message
            String message = objectMapper.readValue(notificationMessage, String.class);

            System.out.println("Received Notification from RabbitMQ: " + message);

            // Notify clients about the update
            notifyClients(message);
        } catch (IOException e) {
            log.error("Failed to process RabbitMQ message", e);
        }
    }

    @GetMapping("/order-updates-customer")
    public ResponseEntity<SseEmitter> streamOrderUpdates() {
        SseEmitter emitter = new SseEmitter();
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
    
        return ResponseEntity.ok()
                             .contentType(MediaType.TEXT_EVENT_STREAM)
                             .body(emitter);
    }
    
    // Send the message to all connected clients
    private void notifyClients(String message) {
        List<SseEmitter> deadEmitters = new ArrayList<>();
        emitters.forEach(emitter -> {
            try {
                // Send notification message as a simple text
                String orderupdateJson = new ObjectMapper().writeValueAsString(message);
                emitter.send(SseEmitter.event().data(orderupdateJson));
    
            } catch (Exception e) {
                deadEmitters.add(emitter);  // Remove failed emitters
            }
        });
        emitters.removeAll(deadEmitters);  // Clean up failed emitters
    }
}
