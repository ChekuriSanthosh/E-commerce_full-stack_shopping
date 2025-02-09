package com.ust.ecomerce.service;

import com.ust.ecomerce.dto.productdto;
import com.ust.ecomerce.model.Userdetail;

import java.util.List;

public interface userService {
    productdto getproductbyid(long productId);
    Userdetail saveUser(Userdetail u);
    Userdetail updateUser(Userdetail u, long userId);
    Userdetail addtoCart(long userId, long p, long quantity);
    Userdetail bought(long userId, long p, long quantity);
    double totalcartvalue(long userId);
    Userdetail getByid(long id);
    Userdetail removeallcart(long userId);
    Userdetail removeproduct(long userId, long p);
    Userdetail removeproductquantity(long userId, long p);
    double totalbought(long userId);
    Userdetail findbyemail(String email);
    List<productdto> getproductsBycategory(String category);
    List<productdto> getallproducts();
}
