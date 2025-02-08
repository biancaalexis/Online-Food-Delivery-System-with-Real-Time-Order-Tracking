package com.finalproject.craveit.Product;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table (name="product")
public class Product {
    @Id
    //instead na auto naka identity for uniquiness
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    //id as primary key
    private Integer id;

    private String name;
    private String category;
    private double price;
    private Integer quantity;

     //as TEXT not varchar
    @Column (columnDefinition = "TEXT")
    private String description;


    private String imageFileName;
    public Product() {
        // Required by Hibernate
    }

        // Constructor with all fields
        public Product(String name, String category, double price, Integer quantity,
        String description,  String imageFileName) {
this.name = name;
this.category = category;
this.price = price;
this.quantity = quantity;
this.description = description;
this.imageFileName = imageFileName;
}

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    public double getPrice() {
        return price;
    }
    public void setPrice(double price) {
        this.price = price;
    }
    public Integer getQuantity() {
        return quantity;
    }
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getImageFileName() {
        return imageFileName;
    }
    public void setImageFileName(String imageFileName) {
        this.imageFileName = imageFileName;
    }
   
    //Getters and Setters
    //setting getId for to recognize actor as id
    
  
    
}
