package com.ust.ecomerce.repository;

import com.ust.ecomerce.model.item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface itemRepository extends JpaRepository<item,Long> {
}
