package com.ust.ecomerce.product.service;

import com.ust.ecomerce.product.model.product;

import java.util.List;

public interface product_service {
    product addproduct(product p);
    product viewproduct(long id);
    product editproduct(product p, long id);
    void removeproduct(long id);
    List<product> getproductsbycategory(String category);
    product boughtproduct(long id);
    product changeprice(long id, double price);
    List<product> viewall();
}
