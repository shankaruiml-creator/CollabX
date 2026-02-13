package com.example.CollabX.controller;

import com.example.CollabX.model.*;
import com.example.CollabX.payload.MessageResponse;
import com.example.CollabX.payload.SignupRequest;
import com.example.CollabX.repository.CollegeRepository;
import com.example.CollabX.repository.ESPRepository;
import com.example.CollabX.repository.RoleRepository;
import com.example.CollabX.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/esps")
public class ESPController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    ESPRepository espRepository;

    @Autowired
    CollegeRepository collegeRepository;

    @Autowired
    PasswordEncoder encoder;

    @PostMapping("/add")
    @PreAuthorize("hasRole('COLLEGE')")
    public ResponseEntity<?> addESP(@Valid @RequestBody SignupRequest signUpRequest, @RequestParam Long collegeId) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        College college = collegeRepository.findById(collegeId)
                .orElseThrow(() -> new RuntimeException("Error: College not found."));

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: ESP Role must be specified."));
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "esp_president":
                        Role presRole = roleRepository.findByName(ERole.ROLE_ESP_PRESIDENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(presRole);
                        break;
                    case "esp_vice_president":
                        Role vpRole = roleRepository.findByName(ERole.ROLE_ESP_VICE_PRESIDENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(vpRole);
                        break;
                    case "esp_register_1":
                        Role r1Role = roleRepository.findByName(ERole.ROLE_ESP_REGISTER_1)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(r1Role);
                        break;
                    case "esp_register_2":
                        Role r2Role = roleRepository.findByName(ERole.ROLE_ESP_REGISTER_2)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(r2Role);
                        break;
                    case "esp_register_3":
                        Role r3Role = roleRepository.findByName(ERole.ROLE_ESP_REGISTER_3)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(r3Role);
                        break;
                    default:
                        throw new RuntimeException("Error: Invalid ESP Role.");
                }
            });
        }

        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        ESP esp = new ESP(savedUser, college);
        espRepository.save(esp);

        return ResponseEntity.ok(new MessageResponse("ESP added successfully!"));
    }

    @GetMapping("/college/{collegeId}")
    @PreAuthorize("hasAnyAuthority('ROLE_COLLEGE', 'ROLE_ADMIN', 'ROLE_ESP_PRESIDENT', 'ROLE_ESP_VICE_PRESIDENT', 'ROLE_ESP_REGISTER_1', 'ROLE_ESP_REGISTER_2', 'ROLE_ESP_REGISTER_3')")
    public ResponseEntity<List<ESP>> getESPsByCollege(@PathVariable Long collegeId) {
        return ResponseEntity.ok(espRepository.findByCollegeId(collegeId));
    }
}
