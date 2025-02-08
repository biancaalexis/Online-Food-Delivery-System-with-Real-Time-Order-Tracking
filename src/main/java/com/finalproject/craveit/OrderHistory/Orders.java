package com.finalproject.craveit.OrderHistory;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name="orders")
public class Orders {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer order_id;
    
    
    private Integer user_id;
    private Integer product_id;
    private String category;
    private String product_name;
    private double price;
    private Integer quantity;
    private Double total;
    private String mop;
    private String address;
    private String fullname;
    private String country;
    private String city;
    private String order_status;
    private String deliveryPersonnel; 
    private String deliveryStatus;

    public String getDeliveryStatus() {
        return deliveryStatus;
    }
    public void setDeliveryStatus(String deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }
    public String getDeliveryPersonnel() {
        return deliveryPersonnel;
    }
    public void setDeliveryPersonnel(String deliveryPersonnel) {
        this.deliveryPersonnel = deliveryPersonnel;
    }
    public String getOrderStatus() {
        return order_status;
    }
    public void setOrderStatus(String order_status) {
        this.order_status = order_status;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    public String getProduct_name() {
        return product_name;
    }
    public void setProduct_name(String product_name) {
        this.product_name = product_name;
    }
    public String getFullname() {
        return fullname;
    }
    public void setFullname(String fullname) {
        this.fullname = fullname;
    }
    public String getCountry() {
        return country;
    }
    public void setCountry(String country) {
        this.country = country;
    }
    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public Integer getProduct_id() {
        return product_id;
    }
    public void setProduct_id(Integer product_id) {
        this.product_id = product_id;
    }
    public Integer getOrder_id() {
        return order_id;
    }
    public void setOrder_id(Integer order_id) {
        this.order_id = order_id;
    }
    public Integer getUser_id() {
        return user_id;
    }
    public void setUser_id(Integer user_id) {
        this.user_id = user_id;
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
    public Double getTotal() {
        return total;
    }
    public void setTotal(Double total) {
        this.total = total;
    }
    public String getMop() {
        return mop;
    }
    public void setMop(String mop) {
        this.mop = mop;
    }
}
