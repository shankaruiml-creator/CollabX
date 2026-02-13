package com.example.CollabX.controller;

import com.example.CollabX.model.College;
import com.example.CollabX.model.ERole;
import com.example.CollabX.model.Role;
import com.example.CollabX.model.User;
import com.example.CollabX.model.ESP;
import com.example.CollabX.model.Otp;
import com.example.CollabX.payload.*;
import com.example.CollabX.repository.CollegeRepository;
import com.example.CollabX.repository.OtpRepository;
import com.example.CollabX.repository.RoleRepository;
import com.example.CollabX.repository.UserRepository;
import com.example.CollabX.repository.ESPRepository;
import com.example.CollabX.security.jwt.JwtUtils;
import com.example.CollabX.security.services.UserDetailsImpl;
import com.example.CollabX.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    CollegeRepository collegeRepository;

    @Autowired
    ESPRepository espRepository;

    @Autowired
    OtpRepository otpRepository;

    @Autowired
    EmailService emailService;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @GetMapping("/check-admin")
    public ResponseEntity<?> checkAdminExists() {
        boolean exists = userRepository.findAll().stream()
                .anyMatch(user -> user.getRoles().stream()
                        .anyMatch(role -> role.getName().equals(ERole.ROLE_ADMIN)));
        return ResponseEntity.ok(exists);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userPrincipal.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            // Check if college is verified
            if (roles.contains("ROLE_COLLEGE")) {
                College college = collegeRepository.findById(userPrincipal.getId())
                        .orElse(null);
                if (college != null && !college.isVerified()) {
                    return ResponseEntity
                            .badRequest()
                            .body(new MessageResponse("Mention : Your college account is not yet verified. Please wait for admin approval."));
                }
            }

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userPrincipal.getId(),
                    userPrincipal.getUsername(),
                    userPrincipal.getEmail(),
                    roles,
                    getCollegeIdForUser(userPrincipal.getId(), roles)));
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity
                    .status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Error: Invalid username or password!"));
        }
    }

    private Long getCollegeIdForUser(Long userId, List<String> roles) {
        if (roles.contains("ROLE_COLLEGE")) {
            return userId;
        }
        if (roles.stream().anyMatch(role -> role.startsWith("ROLE_ESP_"))) {
            return espRepository.findByUserId(userId)
                    .map(esp -> esp.getCollege().getId())
                    .orElse(null);
        }
        return null;
    }

    @PostMapping("/send-otp")
    @Transactional
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequest otpRequest) {
        if (userRepository.existsByEmail(otpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        otpRepository.deleteByEmail(otpRequest.getEmail());
        otpRepository.save(new Otp(otpRequest.getEmail(), otp, 5));
        
        try {
            emailService.sendOtpEmail(otpRequest.getEmail(), otp);
            return ResponseEntity.ok(new MessageResponse("OTP sent successfully to your email!"));
        } catch (Exception e) {
            e.printStackTrace(); // Log the error to console
            return ResponseEntity
                    .status(500)
                    .body(new MessageResponse("Error: Could not send email. " + e.getMessage()));
        }
    }

    @PostMapping("/signup")
    @Transactional
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        System.out.println("AuthController: Received signup request for email: " + signUpRequest.getEmail());
        
        if (signUpRequest.getOtp() == null || signUpRequest.getOtp().isBlank()) {
            System.out.println("AuthController: OTP is missing");
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: OTP is required!"));
        }

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            System.out.println("AuthController: Username already taken");
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            System.out.println("AuthController: Email already in use");
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Verify OTP
        System.out.println("AuthController: Verifying OTP for email: " + signUpRequest.getEmail());
        Otp otpRecord = otpRepository.findByEmail(signUpRequest.getEmail())
                .orElse(null);

        if (otpRecord == null) {
            System.out.println("AuthController: No OTP record found for this email");
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: OTP record not found! Please request a new OTP."));
        }

        System.out.println("AuthController: OTP in DB: " + otpRecord.getOtp() + ", OTP provided: " + signUpRequest.getOtp());
        if (!otpRecord.getOtp().equals(signUpRequest.getOtp())) {
            System.out.println("AuthController: OTP mismatch");
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Invalid OTP!"));
        }

        if (otpRecord.getExpiryTime().isBefore(LocalDateTime.now())) {
            System.out.println("AuthController: OTP expired");
            otpRepository.delete(otpRecord);
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: OTP has expired!"));
        }

        // Delete OTP after successful verification
        otpRepository.delete(otpRecord);
        System.out.println("AuthController: OTP verified successfully");

        Set<String> strRoles = signUpRequest.getRole();

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_STUDENT)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "college":
                        Role collegeRole = roleRepository.findByName(ERole.ROLE_COLLEGE)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(collegeRole);
                        break;
                    case "esp_president":
                        Role espPresidentRole = roleRepository.findByName(ERole.ROLE_ESP_PRESIDENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(espPresidentRole);
                        break;
                    case "esp_vice_president":
                        Role espVicePresidentRole = roleRepository.findByName(ERole.ROLE_ESP_VICE_PRESIDENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(espVicePresidentRole);
                        break;
                    case "esp_register_1":
                        Role espRegister1Role = roleRepository.findByName(ERole.ROLE_ESP_REGISTER_1)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(espRegister1Role);
                        break;
                    case "esp_register_2":
                        Role espRegister2Role = roleRepository.findByName(ERole.ROLE_ESP_REGISTER_2)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(espRegister2Role);
                        break;
                    case "esp_register_3":
                        Role espRegister3Role = roleRepository.findByName(ERole.ROLE_ESP_REGISTER_3)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(espRegister3Role);
                        break;
                    default:
                        Role studentRole = roleRepository.findByName(ERole.ROLE_STUDENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(studentRole);
                }
            });
        }

        user.setRoles(roles);
        
        // Save user first
        User savedUser = userRepository.save(user);
        System.out.println("AuthController: User saved with ID: " + savedUser.getId());

        // If user is a college, create college profile
        if (strRoles != null && strRoles.contains("college")) {
            College college = new College(savedUser, 
                    signUpRequest.getCollegeName(),
                    signUpRequest.getRegistrationNumber(),
                    signUpRequest.getCollegeCode(),
                    signUpRequest.getAddress(),
                    signUpRequest.getCity(),
                    signUpRequest.getState(),
                    signUpRequest.getWebsite());
            collegeRepository.save(college);
            System.out.println("AuthController: College profile created");
            
            try {
                emailService.sendCollegeRegistrationEmail(savedUser.getEmail());
            } catch (Exception e) {
                System.out.println("Error sending college registration email: " + e.getMessage());
            }
        } else if (strRoles == null || strRoles.isEmpty() || strRoles.contains("student")) {
            try {
                emailService.sendStudentRegistrationEmail(savedUser.getEmail());
            } catch (Exception e) {
                System.out.println("Error sending student registration email: " + e.getMessage());
            }
        }

        // Force flush to ensure user is persisted before authentication
        userRepository.flush();
        
        // Auto-login the user after successful registration
        try {
            System.out.println("AuthController: Attempting auto-login for user: " + signUpRequest.getUsername());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(signUpRequest.getUsername(), signUpRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
            List<String> rolesList = userPrincipal.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            System.out.println("AuthController: Auto-login successful for user: " + signUpRequest.getUsername());
            return ResponseEntity.ok(new JwtResponse(jwt,
                    userPrincipal.getId(),
                    userPrincipal.getUsername(),
                    userPrincipal.getEmail(),
                    rolesList,
                    getCollegeIdForUser(userPrincipal.getId(), rolesList)));
        } catch (Exception e) {
            System.out.println("AuthController: Auto-login failed after registration: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new MessageResponse("User registered successfully! Please login to continue."));
        }
    }
}
