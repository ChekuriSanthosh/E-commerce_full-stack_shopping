package com.ust.ecomerce.model;


import com.ust.ecomerce.dto.productdto;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class item {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int itemId;
    private long prodId;
    private long quantity;



    public item(long pro, long quantity) {
        this.prodId = pro;
        this.quantity = quantity;
    }
}
