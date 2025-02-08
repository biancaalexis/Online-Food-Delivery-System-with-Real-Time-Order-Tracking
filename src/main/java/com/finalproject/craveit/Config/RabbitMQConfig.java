package com.finalproject.craveit.Config;

import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.Exchange;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.ExchangeBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "order.exchange";
    public static final String QUEUE_NAME = "order.queue";
    public static final String ROUTING_KEY = "order.placed";

    //for notification
    public static final String NOTIFICATION_QUEUE = "notification.queue";
    public static final String NOTIFICATION_EXCHANGE = "notification.exchange";
    public static final String NOTIFICATION_ROUTING_KEY = "order.status.notification";
    // New delivery assignment queue
    public static final String DELIVERY_ASSIGNMENT_QUEUE = "delivery.assignment.queue";
    public static final String DELIVERY_ASSIGNMENT_ROUTING_KEY = "order.delivery.assigned";

    // New customer notifications exchange and queue
    public static final String CUSTOMER_NOTIFICATION_QUEUE = "customer.notification.queue";
    public static final String CUSTOMER_NOTIFICATION_EXCHANGE = "customer.notification.exchange";
    public static final String CUSTOMER_NOTIFICATION_ROUTING_KEY = "order.status.update";


    // @Bean
    // public Queue notificationQueue() {
    //     return new Queue(NOTIFICATION_QUEUE, true);  // Durable queue
    // }

    // @Bean
    // public TopicExchange notificationExchange() {
    //     return new TopicExchange(NOTIFICATION_EXCHANGE);
    // }
@Bean
public Queue notificationQueue() {
    return new Queue("notification.queue", true);  // Durable queue
}

@Bean
public TopicExchange notificationExchange() {
    return new TopicExchange("notification.exchange");  // Durable exchange
}

   


//     @Bean
// public Exchange notificationExchange() {
//     return ExchangeBuilder.directExchange("notification.exchange")
//                           .durable(true)
//                           .build();
// }


    
    @Bean
    public Queue customerNotificationQueue() {
        return new Queue(CUSTOMER_NOTIFICATION_QUEUE, true);
    }

   @Bean
    public TopicExchange customerNotificationExchange() {
        return new TopicExchange("customer.notification.exchange");
    }


    @Bean
    public DirectExchange orderExchange() {
        return new DirectExchange("order.exchange");
    }
    @Bean
    public Queue orderQueue() {
        return new Queue("order.queue", true);
    }

    @Bean
    public Queue deliveryAssignmentQueue() {
        return new Queue(DELIVERY_ASSIGNMENT_QUEUE, true);
    }


    // binding with order
    @Bean
    public Binding bindingOrderQueue() {
        return BindingBuilder
        .bind(orderQueue())
        .to(orderExchange())
        .with("order.placed");
    }

    @Bean
    public Binding bindingDeliveryAssignmentQueue() {
        return BindingBuilder
                .bind(deliveryAssignmentQueue())
                .to(orderExchange())
                .with(DELIVERY_ASSIGNMENT_ROUTING_KEY);
    }

    // Binding for customer notification queue
    @Bean
    public Binding bindingCustomerNotificationQueue() {
        return BindingBuilder
                .bind(customerNotificationQueue())
                .to(customerNotificationExchange())
                .with(CUSTOMER_NOTIFICATION_ROUTING_KEY);
    }

    // binding notification
    // @Bean   
    // public Binding bindingNotificationQueue() {
    //     return BindingBuilder.bind(notificationQueue())
    //         .to(notificationExchange())
    //         .with(NOTIFICATION_ROUTING_KEY);
        // 

@Bean
public Binding bindingNotificationQueue() {
    return BindingBuilder.bind(notificationQueue())
                         .to(notificationExchange())
                         .with("order.status.notification");
}


    //convert message to json
    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter(); 
    }

    
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
    RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
    rabbitTemplate.setMessageConverter(messageConverter());
    return rabbitTemplate;
    }
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory) {
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(connectionFactory);
    factory.setMessageConverter(new Jackson2JsonMessageConverter()); // Ensures JSON messages are handled correctly
    return factory;
    }
  


}
