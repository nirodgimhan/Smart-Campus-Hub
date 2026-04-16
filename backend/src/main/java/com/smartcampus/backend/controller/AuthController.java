package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.request.LoginRequest;
import com.smartcampus.backend.dto.request.SignupRequest;
import com.smartcampus.backend.dto.response.JwtResponse;
import com.smartcampus.backend.dto.response.MessageResponseDTO;
import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.security.JwtUtils;
import com.smartcampus.backend.security.UserDetailsImpl;
import com.smartcampus.backend.service.NotificationService;
import com.smartcampus.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

        @Autowired
        private UserService userService;

        @Autowired
        private AuthenticationManager authenticationManager;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private JwtUtils jwtUtils;

        @Autowired
        private NotificationService notificationService; // <-- ADDED

        // ===== EXISTING METHOD – UNCHANGED =====
        @GetMapping("/me")
        public User getCurrentUser(@AuthenticationPrincipal UserDetailsImpl currentUser) {
                return userService.getUserById(currentUser.getId());
        }

        // ===== LOGIN ENDPOINT =====
        @PostMapping("/login")
        public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
                                                loginRequest.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwt = jwtUtils.generateJwtToken(authentication);

                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                List<String> roles = userDetails.getAuthorities().stream()
                                .map(item -> item.getAuthority())
                                .collect(Collectors.toList());

                return ResponseEntity.ok(new JwtResponse(jwt,
                                userDetails.getId(),
                                userDetails.getEmail(),
                                userDetails.getName(),
                                roles));
        }

        // ===== REGISTER ENDPOINT (with admin notification) =====
        @PostMapping("/register")
        public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
                if (userRepository.existsByEmail(signupRequest.getEmail())) {
                        return ResponseEntity.badRequest()
                                        .body(new MessageResponseDTO("Error: Email is already in use!"));
                }

                // Create new user
                User user = new User();
                user.setName(signupRequest.getName());
                user.setEmail(signupRequest.getEmail());
                user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
                user.setRoles(Collections.singleton("ROLE_USER"));
                userRepository.save(user);

                // Notify all admin users about the new registration
                notificationService.notifyAllAdmins(
                                "New user registered: " + user.getName() + " (" + user.getEmail() + ")",
                                Notification.NotificationType.USER_ACTION,
                                user.getId());

                // Auto-login after registration
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(signupRequest.getEmail(),
                                                signupRequest.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwt = jwtUtils.generateJwtToken(authentication);

                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                List<String> roles = userDetails.getAuthorities().stream()
                                .map(item -> item.getAuthority())
                                .collect(Collectors.toList());

                return ResponseEntity.ok(new JwtResponse(jwt,
                                userDetails.getId(),
                                userDetails.getEmail(),
                                userDetails.getName(),
                                roles));
        }
}