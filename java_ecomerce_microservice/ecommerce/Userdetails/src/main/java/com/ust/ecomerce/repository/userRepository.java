package com.ust.ecomerce.repository;

import com.ust.ecomerce.model.Userdetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface userRepository extends JpaRepository<Userdetail,Long> {
}
