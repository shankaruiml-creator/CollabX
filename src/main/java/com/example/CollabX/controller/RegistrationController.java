package com.example.CollabX.controller;

import com.example.CollabX.model.Event;
import com.example.CollabX.model.Registration;
import com.example.CollabX.model.User;
import com.example.CollabX.repository.EventRepository;
import com.example.CollabX.repository.UserRepository;
import com.example.CollabX.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {
    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @PostMapping
    public ResponseEntity<?> registerForEvent(@RequestBody Registration registration) {
        if (registration.getStudent() == null || registration.getStudent().getId() == null) {
            return ResponseEntity.badRequest().body("Student ID is required");
        }
        if (registration.getEvent() == null || registration.getEvent().getId() == null) {
            return ResponseEntity.badRequest().body("Event ID is required");
        }

        User student = userRepository.findById(registration.getStudent().getId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Event event = eventRepository.findById(registration.getEvent().getId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        registration.setStudent(student);
        registration.setEvent(event);
        
        // Generate Registration ID if not provided
        if (registration.getRegistrationId() == null) {
            registration.setRegistrationId("CX-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        
        // Handle payment logic (mock)
        if (registration.getPaymentStatus() != null && registration.getPaymentStatus().equals("PAID")) {
            registration.setStatus("CONFIRMED");
        }

        Registration savedRegistration = registrationService.registerForEvent(registration);
        
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", savedRegistration.getId());
        response.put("registrationId", savedRegistration.getRegistrationId());
        response.put("status", savedRegistration.getStatus());
        response.put("message", "Registration successful");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyAuthority('ROLE_STUDENT', 'ROLE_ADMIN')")
    public List<Registration> getStudentRegistrations(@PathVariable Long studentId) {
        return registrationService.getRegistrationsByStudent(studentId);
    }

    @GetMapping("/event/{eventId}")
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('COLLEGE', 'ADMIN', 'ESP_REGISTER_1', 'ESP_REGISTER_2', 'ESP_REGISTER_3')")
    public ResponseEntity<List<java.util.Map<String, Object>>> getEventRegistrations(@PathVariable Long eventId) {
        List<Registration> regs = registrationService.getRegistrationsByEvent(eventId);
        System.out.println("Fetched " + regs.size() + " registrations for event ID: " + eventId);
        
        List<java.util.Map<String, Object>> response = regs.stream().map(reg -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", reg.getId());
            map.put("registrationId", reg.getRegistrationId());
            map.put("status", reg.getStatus());
            map.put("fullName", reg.getFullName());
            map.put("email", reg.getEmail());
            map.put("mobileNumber", reg.getMobileNumber());
            map.put("collegeName", reg.getCollegeName());
            map.put("collegeCode", reg.getCollegeCode());
            map.put("rollNumber", reg.getRollNumber());
            map.put("amount", reg.getAmount());
            map.put("paymentStatus", reg.getPaymentStatus());
            map.put("registrationDate", reg.getRegistrationDate());
            return map;
        }).collect(java.util.stream.Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check")
    public ResponseEntity<?> getRegistration(@RequestParam Long studentId, @RequestParam Long eventId) {
        System.out.println("Checking registration status for studentId: " + studentId + ", eventId: " + eventId);
        return registrationService.getRegistrationByStudentAndEvent(studentId, eventId)
                .map(reg -> {
                    System.out.println("Registration found with ID: " + reg.getRegistrationId());
                    java.util.Map<String, Object> resp = new java.util.HashMap<>();
                    resp.put("id", reg.getId());
                    resp.put("registrationId", reg.getRegistrationId());
                    resp.put("status", reg.getStatus());
                    resp.put("fullName", reg.getFullName());
                    resp.put("email", reg.getEmail());
                    resp.put("mobileNumber", reg.getMobileNumber());
                    resp.put("collegeName", reg.getCollegeName());
                    resp.put("collegeCode", reg.getCollegeCode());
                    resp.put("rollNumber", reg.getRollNumber());
                    resp.put("amount", reg.getAmount());
                    resp.put("paymentStatus", reg.getPaymentStatus());
                    return ResponseEntity.ok((Object) resp);
                })
                .orElseGet(() -> {
                    System.out.println("No registration found for studentId: " + studentId + ", eventId: " + eventId);
                    return ResponseEntity.ok(new java.util.HashMap<>()); // Return empty map instead of 404
                });
    }
}
