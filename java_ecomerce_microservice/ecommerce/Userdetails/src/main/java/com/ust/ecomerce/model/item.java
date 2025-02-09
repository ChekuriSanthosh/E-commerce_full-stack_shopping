package com.ust.ecomerce.model;


import com.ust.ecomerce.dto.productdto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private int itemId;
    private long prodId;
    private long quantity;



    public item(long pro, long quantity) {
        this.prodId = pro;
        this.quantity = quantity;
    }
}
