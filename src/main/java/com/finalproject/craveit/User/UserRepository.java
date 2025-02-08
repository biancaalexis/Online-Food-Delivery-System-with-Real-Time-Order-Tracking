package com.finalproject.craveit.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsernameAndPassword(String username, String password);
    User findByUsername(String username);
    User save(User user);

    //added
    //to view all customer
    @Query(value = "SELECT * FROM users u WHERE user_role ='customer'", nativeQuery = true)
    public Iterable<User> findAllCustomers();

    //to view all admin
    @Query(value = "SELECT * FROM users u WHERE user_role ='admin'", nativeQuery = true)
    public Iterable<User> findAllAdmins();
    
    //to insert admin
    @Modifying
    @Query(value = "INSERT INTO users (username, password, phone, user_role) VALUES (:username, :password, :user_role)", nativeQuery = true)
    int add_admin(@Param("username") String username, 
                  @Param("password") String password, 
                  @Param("user_role") String user_role);

    @Modifying
    @Query(value = "INSERT INTO users (username, password, phone, user_role) VALUES (:username, :password, :user_role)", nativeQuery = true)
    int add_delivery_personnel(@Param("username") String username, 
                                @Param("password") String password, 
                                @Param("user_role") String user_role);
                  
        

}
