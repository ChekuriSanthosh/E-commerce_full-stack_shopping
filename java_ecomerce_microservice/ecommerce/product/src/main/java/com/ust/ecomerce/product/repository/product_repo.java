package com.ust.ecomerce.product.repository;

import com.ust.ecomerce.product.model.product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface product_repo extends JpaRepository<product, Long> {
}
