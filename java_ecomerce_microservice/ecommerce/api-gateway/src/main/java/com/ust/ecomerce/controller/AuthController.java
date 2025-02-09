package com.ust.ecomerce.controller;


import com.ust.ecomerce.dto.JwtToken;
import com.ust.ecomerce.dto.UserCredentials;
import com.ust.ecomerce.respository.UserRepository;
import com.ust.ecomerce.service.AuthenticationService;
import com.ust.ecomerce.service.UserDetailsServiceImpl;
import com.ust.ecomerce.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @PostMapping("/login")
    public JwtToken login(@RequestBody UserCredentials userCredentials){

        return authenticationService.loginUser(userCredentials);

    }


    @GetMapping("/check-email/{email}")
    public boolean checkEmailExists(@PathVariable String email) {
        if(userRepository.findByUsername(email).orElse(null)==null){
            return false;
        }else{
            return true;
        }
    }



    @GetMapping("/jwtToken/{jwt}")
    public String getToken(@PathVariable String jwt){
        String username=jwtUtil.getUsernameFromToken(jwt);
        return userDetailsService.loadUser(username).getUsername();
    }

}
