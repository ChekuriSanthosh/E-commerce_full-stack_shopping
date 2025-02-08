package com.ust.ecomerce.controller;

import com.ust.ecomerce.model.UserModel;
import com.ust.ecomerce.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class UserDetailsController {
    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @GetMapping("/getUser/{username}")
    public UserModel getUserDetails(@PathVariable String username){
        return userDetailsService.loadUser(username);
    }

    @PutMapping("/updateId")
    public UserModel updateuserId(String username, int id){
        return userDetailsService.updatewithUserId(username,id);
    }

}