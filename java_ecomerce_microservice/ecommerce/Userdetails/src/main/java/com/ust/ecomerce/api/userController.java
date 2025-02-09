package com.ust.ecomerce.api;


import com.ust.ecomerce.dto.productdto;
import com.ust.ecomerce.model.Userdetail;
import com.ust.ecomerce.service.userService;
import org.h2.engine.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class userController {
    @Autowired
    private userService userservice;

    @GetMapping("/findbyemail/{email}")
    Userdetail findbyemail(@PathVariable String email){
        return userservice.findbyemail(email);
    }

    @GetMapping("/product/{id}")
    productdto fi6n6d6byproductid(@PathVariable long id){
        return userservice.getproductbyid(id);
    }


    @PostMapping
    Userdetail saveUser(@RequestBody Userdetail u){
        return userservice.saveUser(u);
    }

    @PutMapping("/{id}")
    Userdetail updateUser(@RequestBody Userdetail u, @PathVariable long userId){
        return userservice.updateUser(u,userId);
    }

    @PostMapping("/addcart/{userId}")
    Userdetail addtoCart(@PathVariable long userId, @RequestParam long productId, @RequestParam long quantity){
        return userservice.addtoCart(userId,productId,quantity);
    }

    @PostMapping("/bought/{userId}")
    Userdetail bought(@PathVariable long userId, @RequestParam long productId, @RequestParam long quantity){
        return userservice.bought(userId,productId,quantity);
    }

    @GetMapping("/totalcart/{userId}")
    double totalcartvalue(@PathVariable long userId){
        return userservice.totalcartvalue(userId);
    }



    @GetMapping("/user/{id}")
    Userdetail getByid(@PathVariable long id){
        return userservice.getByid(id);
    }

    @PutMapping("/removecart/{userId}")
    Userdetail removeallcart(@PathVariable long userId){
        return userservice.removeallcart(userId);
    }

    @PutMapping("/removeproduct/{userId}")
    Userdetail removeproduct(@PathVariable long userId, @RequestParam long productId){
        return userservice.removeproduct(userId,productId);
    }

    @PutMapping("/removequantity/{userId}")
    Userdetail removeproductquantity(@PathVariable long userId, @RequestParam long productId){
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
