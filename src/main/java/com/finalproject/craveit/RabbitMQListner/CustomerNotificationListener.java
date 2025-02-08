
package com.finalproject.craveit.RabbitMQListner;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finalproject.craveit.Config.RabbitMQConfig;
import com.finalproject.craveit.OrderHistory.Orders;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
@RestController
@CrossOrigin(origins = "http://localhost:8080")
public class CustomerNotificationListener {

    private static final Logger log = LoggerFactory.getLogger(CustomerNotificationListener.class);
    private static final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    // ✅ LISTEN FOR DELIVERY STATUS UPDATES FROM RABBITMQ
    @RabbitListener(queues = RabbitMQConfig.CUSTOMER_NOTIFICATION_QUEUE)
    public void receiveOrderUpdateNotification(Orders order) {
        try {
            log.info("Received Order Update from RabbitMQ: {}", order);
            
            // Convert order object to JSON
            String orderStatusJson = new ObjectMapper().writeValueAsString(order);
            
            // Send the update to all SSE clients
            sendToClients(orderStatusJson);
        } catch (IOException e) {
            log.error("Failed to process RabbitMQ message", e);
        }
    }

    // 🔹 SSE ENDPOINT: CUSTOMERS CAN SUBSCRIBE TO ORDER STATUS UPDATES
    @GetMapping("/order-updates-delivery-status")
    public ResponseEntity<SseEmitter> streamOrderUpdates() {
        SseEmitter emitter = new SseEmitter(60_000L); // 60 seconds timeout
        emitters.add(emitter);
        
        emitter.onCompletion(() -> emitters.remove(emitter)); // Cleanup when completed
        emitter.onTimeout(() -> emitters.remove(emitter));    // Cleanup on timeout
        emitter.onError((e) -> emitters.remove(emitter));     // Cleanup on error
        
        return ResponseEntity.ok()
                             .contentType(MediaType.TEXT_EVENT_STREAM)
                             .body(emitter);  // Return emitter for real-time streaming
    }

    // 🔹 SEND ORDER STATUS UPDATES TO CONNECTED SSE CLIENTS
    private void sendToClients(String orderStatusJson) {
        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();
        
        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event().data(orderStatusJson));
            } catch (Exception e) {
                deadEmitters.add(emitter); // Collect dead emitters for cleanup
            }
        });

        emitters.removeAll(deadEmitters); // Remove dead emitters
    }
}
