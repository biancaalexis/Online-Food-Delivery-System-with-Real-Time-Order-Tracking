package com.finalproject.craveit.Product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ProductRepository extends JpaRepository<Product, Integer> {
    
    //to view all
    @Query(value = "SELECT * FROM product p", nativeQuery = true)
        public Iterable<Product> productAll_obj();

    //to search the name
    @Query(value = "SELECT * FROM product p WHERE p.name =:name", nativeQuery = true)
    public Iterable<Product> product_obj(@Param("name") String name);

    //to insert or to put
    @Query(value = "INSERT INTO product VALUES(name, category, price, quantity, description, imageFileName)", 
    nativeQuery = true)
    
    public Product add_product(
        @Param("name")String name, 
        @Param("category")String category, 
        @Param("price")Double price, 
        @Param("quantity")Integer quantity, 
        @Param("description")String description,
        @Param("imageFileName")String imageFileName);

    //added
    public List<Product> findByCategory(String category);
}