package com.ust.ecomerce.repository;

import com.ust.ecomerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface userRepository extends JpaRepository<User,Long> {
}
