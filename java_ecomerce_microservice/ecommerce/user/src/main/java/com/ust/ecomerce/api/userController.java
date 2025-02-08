package com.ust.ecomerce.api;


import com.ust.ecomerce.dto.productdto;
import com.ust.ecomerce.model.User;
import com.ust.ecomerce.service.userService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class userController {
    @Autowired
    private userService userservice;


    @PostMapping
    User saveUser(@RequestBody User u){
        return userservice.saveUser(u);
    }

    @PutMapping("/{id}")
    User updateUser(@RequestBody User u, @PathVariable long userId){
        return userservice.updateUser(u,userId);
    }

    @PostMapping("/addcart/{userId}")
    User addtoCart(@PathVariable long userId, @RequestParam long productId, @RequestParam long quantity){
        return userservice.addtoCart(userId,productId,quantity);
    }

    @PostMapping("/bought/{userId}")
    User bought(@PathVariable long userId, @RequestParam long productId, @RequestParam long quantity){
        return userservice.bought(userId,productId,quantity);
    }

    @GetMapping("/totalcart/{userId}")
    double totalcartvalue(@PathVariable long userId){
        return userservice.totalcartvalue(userId);
    }

    @GetMapping("/user/{id}")
    User getByid(@PathVariable long id){
        return userservice.getByid(id);
    }

    @PutMapping("/removecart/{userId}")
    User removeallcart(@PathVariable long userId){
        return userservice.removeallcart(userId);
    }

    @PutMapping("/removeproduct/{userId}")
    User removeproduct(@PathVariable long userId, @RequestParam long productId){
        return userservice.removeproduct(userId,productId);
    }

    @PutMapping("/removequantity/{userId}")
    User removeproductquantity(@PathVariable long userId, @RequestParam long productId){
        return userservice.removeproductquantity(userId,productId);
    }

    @GetMapping("/totalBought/{userId}")
    double totalbought(@PathVariable long userId){
        return userservice.totalbought(userId);
    }

    @GetMapping("/getByCategory")
    List<productdto> getproductsBycategory(@RequestParam String category){
        return userservice.getproductsBycategory(category);
    }

    @GetMapping("/getallproducts")
    List<productdto> getallproducts(){
        return userservice.getallproducts();
    }
}
