package com.ust.ecomerce.product.service;

import com.ust.ecomerce.product.model.product;
import com.ust.ecomerce.product.repository.product_repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class product_service_impl implements product_service{

    @Autowired
    private product_repo repo;

    @Override
    public product addproduct(product p) {
        return repo.save(p);
    }

    @Override
    public product viewproduct(long id) {
            return repo.findById(id).orElse(null);
    }

    @Override
    public product editproduct(product p, long id) {
        product res=repo.findById(id).orElse(null);
        if(res==null){
            throw new RuntimeException("Product Not Found");
        }
        res.setCategory(p.getCategory());
        res.setName(p.getName());
        res.setDescription(p.getDescription());
        res.setPrice(p.getPrice());
        res.setImageUrl(p.getImageUrl());
        res.setPrice(p.getPrice());
        return repo.save(res);
    }

    @Override
    public void removeproduct(long id) {
        if(repo.existsById(id)){
            repo.deleteById(id);
        }
    }

    @Override
    public List<product> getproductsbycategory(String category) {
        List<product> all=repo.findAll();
        return all.stream().filter(i->i.getCategory().toLowerCase().equals(category.toLowerCase())).toList();
    }

    @Override
    public product boughtproduct(long id) {
        if(!repo.existsById(id)){
            return null;
        }
        product p=repo.findById(id).get();
        if(p.getQuantityAvailable()==0){
            throw new RuntimeException("Sold out already");
        }
        long res=p.getQuantityAvailable()-1;
        p.setQuantityAvailable(res);
        return repo.save(p);
    }

    @Override
    public product changeprice(long id, double price) {
        if(!repo.existsById(id)){
            return null;
        }
        product p=repo.findById(id).get();
        p.setPrice(price);
        return repo.save(p);

    }

    @Override
    public List<product> viewall() {
        return repo.findAll();
    }
}
