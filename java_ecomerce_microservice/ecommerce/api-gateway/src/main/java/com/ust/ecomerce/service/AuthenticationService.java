package com.ust.ecomerce.service;


import com.ust.ecomerce.dto.JwtToken;
import com.ust.ecomerce.dto.UserCredentials;
import com.ust.ecomerce.model.UserModel;
import com.ust.ecomerce.respository.UserRepository;
import com.ust.ecomerce.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;



    public JwtToken loginUser(UserCredentials userCredentials){
        PasswordEncoder passwordEncoder=new BCryptPasswordEncoder();

        UserModel userModel = userRepository.findByUsername(userCredentials.username())
                .orElseThrow(()->new UsernameNotFoundException("User with name "+userCredentials.username()+" not found"));
        if(!userCredentials.role().equalsIgnoreCase(userModel.getRole())){
            throw new RuntimeException("Invalid Credentials");
        }
        if(!passwordEncoder.matches(userCredentials.password(),userModel.getPassword())){
            throw  new RuntimeException("Invalid Credentials");
        }

        String jwt = jwtUtil.generateToken(userCredentials.username());
        return new JwtToken(jwt);

    }


}
