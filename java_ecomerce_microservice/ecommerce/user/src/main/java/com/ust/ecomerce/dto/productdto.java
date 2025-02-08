package com.ust.ecomerce.dto;

import lombok.Data;



@Data
public class productdto {
    private Long productId;
    private String name;
    private String description;
    private double price;
    private long quantityAvailable;
    private String category;
    private String imageUrl;

}
