package com.finalproject.craveit.Admin;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finalproject.craveit.Product.Product;
import com.finalproject.craveit.Product.ProductRepository;
import com.finalproject.craveit.User.User;
import com.finalproject.craveit.User.UserService;

import jakarta.servlet.http.HttpServletRequest;


@Controller
public class AdminController {

    @PostMapping("/signin")
public ResponseEntity<Map<String, Object>> signIn(@RequestParam("username") String username, @RequestParam("password") String password) {
    User user = userService.authenticate(username, password);
    if (user != null) {
        // User authentication successful
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("username", user.getUsername());
		response.put("user_role", user.getUser_role());
		response.put("id", user.getId());
        return ResponseEntity.ok(response);
    } else {
        // User authentication failed
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("success", false));
    }
}


    @Autowired
    private ProductRepository productRepository;
    
    @GetMapping("/all")
    public @ResponseBody Iterable<Product> getAllProduct() {
      // This returns a JSON or XML with the users
      //dito to view all just findAll() ata
      return productRepository.findAll();
    }


    @GetMapping("/product/search") 
    public @ResponseBody Iterable<Product> findByFirstName(@RequestParam("name") String name) {
         return productRepository.product_obj(name);
    }

   //to add
    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProduct(
        @RequestParam("imageFile") MultipartFile imageFile,
        @RequestParam("name") String name,
        @RequestParam("category") String category,
        @RequestParam("price") double price,
        @RequestParam("quantity") int quantity,
        @RequestParam("description") String description) {

    try {
        // Handle image file upload if provided
        String uploadDir = "static/images/";
        String fileName = StringUtils.cleanPath(imageFile.getOriginalFilename());
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        try (InputStream inputStream = imageFile.getInputStream()) {
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image file.");
        }

        // Create a new Product object and save to repository
        Product product = new Product(name, category, price, quantity, description, fileName);
        Product savedProduct = productRepository.save(product);

        return ResponseEntity.ok().body(savedProduct);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add product. " + e.getMessage());
    }
}



    @GetMapping("/product/{id}")
    public ResponseEntity<?> getProductById(@PathVariable("id") Integer id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            return ResponseEntity.ok().body(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping(value = "/product/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> updateProduct(
            @PathVariable("id") Integer id,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestPart("product") String updatedProductJsonString) {

        //log the content type of the incoming request
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        System.out.println("Request Content-Type: " + request.getContentType());

        //log the received product JSON and image file details
        System.out.println("Received product update request for ID: " + id);
        System.out.println("Received product JSON: " + updatedProductJsonString);
        if (imageFile != null) {
            System.out.println("Received image file: " + imageFile.getOriginalFilename());
        } else {
            System.out.println("No image file received.");
        }

        //deserialize the product JSON
        //The reverse process where the serialized data (in JSON, XML, etc.) is converted back into its original object.
        Product updatedProductJson;
        try {
             //attempt to deserialize the JSON string 'updatedProductJsonString' into a Product object
            updatedProductJson = new ObjectMapper().readValue(updatedProductJsonString, Product.class);
        } catch (IOException e) {
            //if there's an IOException during deserialization, log the stack trace
            e.printStackTrace();
            //return a 400 Bad Request response with a message indicating that the JSON provided is invalid
            return ResponseEntity.badRequest().body("Invalid product JSON.");
        }

        //to find the existing product by ID
        Product existingProduct = productRepository.findById(id).orElse(null);
        if (existingProduct == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            //update product fields
            existingProduct.setName(updatedProductJson.getName());
            existingProduct.setCategory(updatedProductJson.getCategory());
            existingProduct.setPrice(updatedProductJson.getPrice());
            existingProduct.setQuantity(updatedProductJson.getQuantity());
            existingProduct.setDescription(updatedProductJson.getDescription());

            //handle image file if provided
            if (imageFile != null && !imageFile.isEmpty()) {
                String uploadDir = "static/images/";
              //String fileName = existingProduct.getId() + "_" + StringUtils.cleanPath(imageFile.getOriginalFilename());
              String fileName = StringUtils.cleanPath(imageFile.getOriginalFilename());
                Path uploadPath = Paths.get(uploadDir);

                //to create upload directory if it doesn't exist
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                //to copy file to the upload directory
                try (InputStream inputStream = imageFile.getInputStream()) {
                    Path filePath = uploadPath.resolve(fileName);
                    Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
                    existingProduct.setImageFileName(fileName);
                } catch (IOException e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            }

            //to save the updated product
            Product savedProduct = productRepository.save(existingProduct);
            return ResponseEntity.ok().body(savedProduct);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
       
    }

    //delete
    //handle http to delete request a product by its id
    @DeleteMapping("/product/{id}")
        public ResponseEntity<String> deleteProductById(@PathVariable Integer id) {
        try {
           
            //attempt to delete product from database using its id
            productRepository.deleteById(id);
             //if deletion is successful, return a success response
            return ResponseEntity.ok("Product deleted successfully");
        } catch (EmptyResultDataAccessException e) {
            //if the product with the given ID is not existed return 404 not found
            return ResponseEntity.notFound().build(); 
            } catch (Exception e) {
            //if other exeptions like databse erorr return 500 internal server error
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Failed to delete product. Please try again.");
        }
    }

    //added for tables in users if admin and customer
    @Autowired
    private UserService userService;

    //to get the customer list
    @GetMapping("/getcustomers")
    public @ResponseBody Iterable<User> getUsers() {
        return userService.getAllCustomers();
    }

    //to delete admin by its id
    @DeleteMapping("/getcustomers/{id}")
    public ResponseEntity<String> deleteCustomerById(@PathVariable int id) {
        return userService.deleteCustomerById(id);
    }
    

     //to get the admin list
     @GetMapping("/getadmin")
     public @ResponseBody Iterable<User> getAdmin() {
         return userService.getAllAdmins();
     }

   //add admin
    @PostMapping("/addadmin")
    public ResponseEntity<?> addAdmin(@RequestBody User admin) {
        //set role to admin 
        admin.setUser_role("admin");

        try {
            //call the userService to add the admin to the system
            int result = userService.addAdmin(admin.getUsername(), admin.getPassword(), admin.getUser_role());
        
            //check the result of the userService operation
            if (result == 1) {
                //success return
                return ResponseEntity.ok().body("{\"message\": \"Admin added successfully\"}");
            } else {
                //error
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"Failed to add admin\"}");
            }
        } catch (Exception e) {
            //catch any exceptions during process
            e.printStackTrace();
        
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"Error adding admin: " + e.getMessage() + "\"}");
        }
    }

    //to delete admin by its id
    @DeleteMapping("/getadmin/{id}")
    public ResponseEntity<String> deleteAdminById(@PathVariable int id) {
        return userService.deleteAdminById(id);
    }



    //added
    @GetMapping("/products/{category}")
    public ResponseEntity<?> getProductsByCategory(@PathVariable String category) {
    List<Product> products = productRepository.findByCategory(category);
    return ResponseEntity.ok().body(products);
    }

    
    //checkout
     @PostMapping("/checkout")
     public ResponseEntity<String> checkout(@RequestBody List<Product> productsToCheckout) {
     for (Product product : productsToCheckout) {
         Product existingProduct = productRepository.findById(product.getId())
                 .orElse(null); // Use null or another default value if product is not found
         
         if (existingProduct == null) {
             return ResponseEntity.badRequest().body("Product not found with id: " + product.getId());
         }
     }
     return ResponseEntity.ok("Order placed successfully");
    }


    

    
    
}

    
    


    
