package com.ust.ecomerce.product.api;

import com.ust.ecomerce.product.model.product;
import com.ust.ecomerce.product.service.product_service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/product")
@RestController
public class product_controller {
    @Autowired
    private product_service productService;

    @GetMapping
    List<product> getall(){
        return productService.viewall();
    }

    @PostMapping("/addproduct")
    product addproduct(@RequestBody product p){
        return productService.addproduct(p);
    }

    @PutMapping("/editproduct/{id}")
    public product editproduct(@RequestBody product p,@PathVariable long id) {
        return productService.editproduct(p,id);
    }

    @GetMapping("/viewproduct/{id}")
    product viewproduct(@PathVariable long id){
        return productService.viewproduct(id);
    }

    @DeleteMapping("/deleteproduct")
    void removeproduct(@RequestParam long id){
        productService.removeproduct(id);
    }

    @GetMapping("/productcate")
    List<product> getproductsbycategory(@RequestParam String category){
        return productService.getproductsbycategory(category);
    }

    @PutMapping("/bought/{id}")
    product boughtproduct(@PathVariable long id){
        return productService.boughtproduct(id);
    }

    @PutMapping("/changeprice/{id}")
    product changeprice(@PathVariable long id,@RequestParam double price){
        return productService.changeprice(id,price);
    }
}
