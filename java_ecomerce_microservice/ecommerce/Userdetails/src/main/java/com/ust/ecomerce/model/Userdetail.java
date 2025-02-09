package com.ust.ecomerce.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "\"user\"")
public class Userdetail {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String address;
    private String phoneNumber;
    @ElementCollection
    private List<item> cartItems;
    @ElementCollection
    private List<item> boughtItems;

}
