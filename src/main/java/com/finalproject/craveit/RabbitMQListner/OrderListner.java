package com.finalproject.craveit.RabbitMQListner;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finalproject.craveit.Config.RabbitMQConfig;
import com.finalproject.craveit.OrderHistory.Orders;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import com.fasterxml.jackson.core.type.TypeReference;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import java.io.IOException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@Component
@RestController
@CrossOrigin(origins = "http://localhost:8080")
public class OrderListner {
    private static final Logger log = LoggerFactory.getLogger(OrderListner.class);

    // listen to order placed of customer
    private static final List<SseEmitter> emitters = new ArrayList<>();

@RabbitListener(queues = "order.queue")
public void receiveOrderUpdateNotification(String orderMessage) {
    try {
        // Check if the message is a valid JSON object
        if (orderMessage.startsWith("{") && orderMessage.endsWith("}")) {
            ObjectMapper objectMapper = new ObjectMapper();
            Orders order = objectMapper.readValue(orderMessage, Orders.class);

            System.out.println("Received Order Update from RabbitMQ: " + orderMessage);

            // Send structured notification to the client (convert to JSON)
            String orderStatusJson = new ObjectMapper().writeValueAsString(order);
            List<SseEmitter> deadEmitters = new ArrayList<>();
            emitters.forEach(emitter -> {
                try {
                    emitter.send(SseEmitter.event().data(orderStatusJson));
                } catch (Exception e) {
                    deadEmitters.add(emitter);
                }
            });
            emitters.removeAll(deadEmitters);
            // Notify Admin Panel or Trigger Further Actions
            notifyAdminClients(order);
        } else {
            // Handle non-JSON messages (if any)
            System.out.println("Received non-JSON message: " + orderMessage);
        }
    } catch (IOException e) {
        log.error("Failed to process RabbitMQ message", e);
    }
}


    @GetMapping("/order-updates")
    public ResponseEntity<SseEmitter> streamOrderUpdates() {
        SseEmitter emitter = new SseEmitter();
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        return ResponseEntity.ok()
                         .contentType(MediaType.TEXT_EVENT_STREAM)
                         .body(emitter);
    }

    private void notifyAdminClients(Orders order) {
        List<SseEmitter> deadEmitters = new ArrayList<>();
        emitters.forEach(emitter -> {
            try {
                // to send a structured JSON message (using ObjectMapper to serialize the order object)
                String orderJson = new ObjectMapper().writeValueAsString(order);
                emitter.send(SseEmitter.event().data(orderJson));
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        });
        emitters.removeAll(deadEmitters);
    }
    

}
