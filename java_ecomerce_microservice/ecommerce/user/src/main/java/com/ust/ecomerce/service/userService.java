package com.ust.ecomerce.service;

import com.ust.ecomerce.dto.productdto;
import com.ust.ecomerce.model.User;

import java.util.List;

public interface userService {
    productdto getproductbyid(long productId);
    User saveUser(User u);
    User updateUser(User u, long userId);
    User addtoCart(long userId, long p, long quantity);
    User bought(long userId, long p, long quantity);
    double totalcartvalue(long userId);
    User getByid(long id);
    User removeallcart(long userId);
    User removeproduct(long userId, long p);
    User removeproductquantity(long userId, long p);
    double totalbought(long userId);
    User findbyemail(String email);
    List<productdto> getproductsBycategory(String category);
    List<productdto> getallproducts();
}
