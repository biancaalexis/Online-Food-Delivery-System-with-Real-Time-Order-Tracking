package com.finalproject.craveit.OrderHistory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import com.finalproject.craveit.OrderHistory.Orders;

public interface OrdersRepository extends JpaRepository<Orders, Integer>{
    
    @Query(value = "SELECT * FROM orders o", nativeQuery = true)
     public Iterable<Orders> ordersAll_obj();

    @Query(value = "SELECT * FROM orders o WHERE o.user_id = :user_id", nativeQuery = true)
     public Iterable<Orders> findByUserId(@Param("user_id") Integer user_id);

     @Query(value = "SELECT * FROM orders o WHERE o.order_id = :order_id", nativeQuery = true)
     public Iterable<Orders> findByOrderId(@Param("order_id") Integer order_id);

    
     @Query("SELECT o FROM Orders o WHERE o.order_status = :orderStatus")
     List<Orders> findByOrderStatus(@Param("orderStatus") String orderStatus);

    // Custom method to find orders by delivery personnel
    List<Orders> findByDeliveryPersonnel(String deliveryPersonnel);

  
    List<Orders> findByDeliveryStatus(String deliveryStatus);
    
    // Optionally, you can add other methods if needed
    List<Orders> findByDeliveryPersonnelIsNotNull();

   
}
