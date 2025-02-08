package com.finalproject.craveit.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


import jakarta.transaction.Transactional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User authenticate(String username, String password) {
        return userRepository.findByUsernameAndPassword(username, password);
    }

    public void save(User user) throws DataIntegrityViolationException {
        try {
            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            // Handle specific exceptions, like duplicate entry for unique fields
            throw e;
        } catch (DataAccessException e) {
            // Handle generic data access exceptions
            throw e;
        } catch (Exception e) {
            // Handle any other unexpected exceptions
            throw e;
        }
    }

    //added
    //to view all customers list
    public Iterable<User> getAllCustomers() {
        return userRepository.findAllCustomers();
    }

    //to delete customer
    public ResponseEntity<String> deleteCustomerById(int id) {
        try {
            //attempt to delete admin from database using its id
            userRepository.deleteById(id);
            //if success
            return ResponseEntity.ok("Customer deleted successfully");
        } catch (EmptyResultDataAccessException e) {
            //not exist, return 404 not found
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            //if other exceptions like database error occur, return 500 internal server error
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete customer. Please try again.");
        }
    }

    //to view all admin list
     public Iterable<User> getAllAdmins() {
        return userRepository.findAllAdmins();
    }


    //to add admin
    @Transactional
    public int addAdmin(String username, String password, String user_role) {
        return userRepository.add_admin(username, password, user_role);
    }

    //to delete admin
    public ResponseEntity<String> deleteAdminById(int id) {
        try {
            //attempt to delete admin from database using its id
            userRepository.deleteById(id);
            //if success
            return ResponseEntity.ok("Admin deleted successfully");
        } catch (EmptyResultDataAccessException e) {
            //not exist, return 404 not found
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            //if other exceptions like database error occur, return 500 internal server error
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete admin. Please try again.");
        }
    }
  
}
