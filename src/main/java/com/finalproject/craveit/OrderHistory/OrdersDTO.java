package com.finalproject.craveit.OrderHistory;

public class OrdersDTO {
        private Integer order_id;
        private Integer user_id;
        private Integer product_id;
        private String product_name;
        private Integer quantity;
        private double price;
        private Double total;
        private String mop;
        private String order_status;
        private String deliveryPersonnel;  // New field to store assigned delivery personnel
        // private String delivery_status; 

        // // Getter and Setter for deliveryPersonnel
        // public String getDeliveryStatus() {
        //     return delivery_status;
        // }
    
        // public void setDeliveryStatus(String delivery_status) {
        //     this.delivery_status = delivery_status;
        // }
    

        // Getter and Setter for deliveryPersonnel
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
        public String getMop() {
            return mop;
        }
        public void setMop(String mop) {
            this.mop = mop;
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
        public Integer getProduct_id() {
            return product_id;
        }
        public void setProduct_id(Integer product_id) {
            this.product_id = product_id;
        }
        public String getProduct_name() {
            return product_name;
        }
        public void setProduct_name(String product_name) {
            this.product_name = product_name;
        }
        public Integer getQuantity() {
            return quantity;
        }
        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
        public double getPrice() {
            return price;
        }
        public void setPrice(double price) {
            this.price = price;
        }
        public Double getTotal() {
            return total;
        }
        public void setTotal(Double total) {
            this.total = total;
        }
    
        // Getters and setters
    }
    

