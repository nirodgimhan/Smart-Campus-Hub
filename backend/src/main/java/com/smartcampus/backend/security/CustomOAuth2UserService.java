package com.smartcampus.backend.security;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Value("${app.adminSecret}")
    private String adminSecret;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        try {
            OAuth2User oAuth2User = super.loadUser(userRequest);
            Map<String, Object> attributes = oAuth2User.getAttributes();
            logger.debug("OAuth2 attributes: {}", attributes);

            // Extract user info from Google
            String email = (String) attributes.get("email");
            if (email == null || email.isEmpty()) {
                logger.error("Email not found in OAuth2 attributes: {}", attributes);
                throw new OAuth2AuthenticationException("Email is required from OAuth2 provider");
            }

            String name = (String) attributes.getOrDefault("name", email.split("@")[0]);
            String picture = (String) attributes.get("picture");

            logger.info("OAuth2 login attempt for email: {}", email);

            // Find existing user or create new
            Optional<User> existingUser = userRepository.findByEmail(email);
            User user;
            if (existingUser.isPresent()) {
                user = existingUser.get();
                // Update name/picture in case they changed
                user.setName(name);
                user.setPictureUrl(picture);
                user = userRepository.save(user);
                logger.info("Existing user logged in: {}", email);
            } else {
                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setPictureUrl(picture);

                // Assign roles
                Set<String> roles = new HashSet<>();
                roles.add("ROLE_USER");

                // Check if this email should be admin (customize as needed)
                if (email.equalsIgnoreCase("admin@campus.com")
                        || email.equalsIgnoreCase("your-admin-email@gmail.com")) {
                    roles.add("ROLE_ADMIN");
                    logger.info("Admin role assigned to {}", email);
                }

                user.setRoles(roles);
                user = userRepository.save(user);
                logger.info("New user created: {}", email);
            }

            // Build UserDetailsImpl with attributes
            UserDetailsImpl userDetails = UserDetailsImpl.build(user, attributes);
            logger.info("UserDetailsImpl created successfully for: {}", userDetails.getEmail());
            return userDetails;

        } catch (Exception e) {
            logger.error("Error in OAuth2 user loading: ", e);
            throw new InternalAuthenticationServiceException("OAuth2 authentication failed", e);
        }
    }
}