package com.ust.ecomerce.service;


import com.ust.ecomerce.dto.productdto;
import com.ust.ecomerce.model.item;
import com.ust.ecomerce.repository.itemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ust.ecomerce.model.User;
import com.ust.ecomerce.repository.userRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class userServiceImpl implements userService{

    @Autowired
    private userRepository userRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private itemRepository itemrepo;

    @Override
    public productdto getproductbyid(long productId) {
        String url = "http://PRODUCT/product/viewproduct";
        productdto prod=restTemplate.getForObject(url+"/"+productId, productdto.class);
        return prod;
    }

    @Override
    public User saveUser(User u) {
        List<item> res=new ArrayList<>();
        u.setCartItems(res);
        u.setBoughtItems(res);
        return userRepository.save(u);
    }

    @Override
    public User updateUser(User u, long userId) {
        User userdetails=userRepository.findById(userId).orElse(null);
        if(userdetails==null){
            return null;
        }
        if(u.getAddress()!="" && u.getAddress()!=null){
            userdetails.setAddress(u.getAddress());
        }
        if(u.getPhoneNumber()!="" && u.getPhoneNumber()!=null){
            userdetails.setPhoneNumber(u.getPhoneNumber());
        }
        return userRepository.save(userdetails);
    }

    @Override
    public User addtoCart(long userId, long p, long quantity) {

            User use = userRepository.findById(userId).orElse(null);
            if (use == null) {
                return null;
            }

            List<item> cartItems = use.getCartItems();
            boolean found = false;

            productdto product = getproductbyid(p);
            if (product.getQuantityAvailable() < quantity) {
                throw new RuntimeException("That many quantity is not available");
            }

            // Check if the product already exists in the cart
            for (item it : cartItems) {
                if (it.getProdId() == p) {
                    it.setQuantity(it.getQuantity() + quantity);
                    found = true;
                    itemrepo.save(it);
                }
            }

            // If the product is not found, add it to the cart
            if (!found) {
                item it = new item(p, quantity);
                cartItems.add(it);
                itemrepo.save(it);
            }

            use.setCartItems(cartItems);
            return userRepository.save(use);  // This will now cascade the save of the items if they are new

    }

    @Override
    public User bought(long userId, long p, long quantity) {
        User use=userRepository.findById(userId).orElse(null);
        if(use==null){
            return null;
        }
        productdto product=getproductbyid(p);
        if(product.getQuantityAvailable()<quantity){
            throw new RuntimeException("That many quantity is not there");
        }

        product.setQuantityAvailable(product.getQuantityAvailable()-quantity);

        String BaseUrl = "http://PRODUCT/product/addproduct";
        productdto response = restTemplate.postForObject(
                BaseUrl,
                product,
                productdto.class
        );
        List<item> boughtitems=use.getBoughtItems();
            item it=new item(p,quantity);
            boughtitems.add(it);
            itemrepo.save(it);
        use.setBoughtItems(boughtitems);
        return userRepository.save(use);
    }

    @Override
    public double totalcartvalue(long userId) {
        User use=userRepository.findById(userId).orElse(null);
        if(use==null){
            return 0;
        }
        double total=0;
        for(item it:use.getCartItems()){
            productdto product=getproductbyid(it.getProdId());
            if(product==null){
                throw new RuntimeException("Something wrong");
            }
            total+=(it.getQuantity()*(product.getPrice()));
        }
        return total;
    }

    @Override
    public User getByid(long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User removeallcart(long userId) {
        User use=userRepository.findById(userId).orElse(null);
        if(use==null){
            return null;
        }
        use.setCartItems(new ArrayList<>());
        return userRepository.save(use);
    }

    @Override
    public User removeproduct(long userId, long p) {
        User use=userRepository.findById(userId).orElse(null);
        if(use==null){
            return null;
        }
        for(item it:use.getCartItems()){
            if(it.getProdId()==p){
                use.getCartItems().remove(it);
            }
        }
        return userRepository.save(use);
    }

    @Override
    public User removeproductquantity(long userId, long p) {
        User use=userRepository.findById(userId).orElse(null);
        if(use==null){
            return null;
        }
        for(item it:use.getCartItems()){
            if(it.getProdId()==p){
                it.setQuantity(it.getQuantity()-1);
                if(it.getQuantity()==0) {
                    use.getCartItems().remove(it);
                }
            }
        }
        return userRepository.save(use);
    }

    @Override
    public double totalbought(long userId) {
        User use=userRepository.findById(userId).orElse(null);
        if(use==null){
            return 0;
        }
        double total=0;
        for(item it:use.getBoughtItems()){
            productdto product=getproductbyid(it.getProdId());
            if(product==null){
                throw new RuntimeException("Something wrong");
            }
            total+=(it.getQuantity()*(product.getPrice()));
        }
        return total;
    }

    @Override
    public User findbyemail(String email) {
        List<User> users=userRepository.findAll();
        for(User it:users){
            if(it.getEmail().equalsIgnoreCase(email)){
                return it;
            }
        }
        return null;
    }

    @Override
    public List<productdto> getproductsBycategory(String category) {
        String url = "http://PRODUCT/product";
        productdto[] prod=restTemplate.getForObject(url+"/productcate?category="+category, productdto[].class);
        List<productdto> productdtoList=new ArrayList<>();
        for(productdto t:prod){
            productdtoList.add(t);
        }
        return productdtoList;
    }

    @Override
    public List<productdto> getallproducts() {
        String url = "http://PRODUCT/product";
        productdto[] prod=restTemplate.getForObject(url, productdto[].class);
        List<productdto> productdtoList=new ArrayList<>();
        for(productdto t:prod){
            productdtoList.add(t);
        }
        return productdtoList;
    }
}
