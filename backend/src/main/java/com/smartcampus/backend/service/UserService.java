package com.smartcampus.backend.service;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.security.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Value("${app.adminSecret}")
    private String adminSecret;

    @PostConstruct
    public void initAdminUser() {
        // Create default admin if not exists (using a fixed email or from properties)
        Optional<User> adminOpt = userRepository.findByEmail("admin@campus.com");
        if (adminOpt.isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@campus.com");
            admin.setName("System Admin");
            Set<String> roles = new HashSet<>();
            roles.add(Role.ROLE_ADMIN.name());
            roles.add(Role.ROLE_USER.name());
            admin.setRoles(roles);
            userRepository.save(admin);
            System.out.println("Default admin created: admin@campus.com (use OAuth2 or set password)");
        }
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}