package com.example.CollabX.controller;

import com.example.CollabX.model.College;
import com.example.CollabX.repository.CollegeRepository;
import com.example.CollabX.repository.UserRepository;
import com.example.CollabX.repository.EventRepository;
import com.example.CollabX.payload.MessageResponse;
import com.example.CollabX.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalColleges", collegeRepository.count());
        stats.put("activeUsers", userRepository.count());
        stats.put("pendingVerifications", collegeRepository.countByIsVerifiedFalse());
        stats.put("flaggedContent", eventRepository.countByIsModeratedTrue());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/pending-colleges")
    public List<College> getPendingColleges() {
        return collegeRepository.findByIsVerifiedFalse();
    }

    @PutMapping("/colleges/{id}/verify")
    public ResponseEntity<?> verifyCollege(@PathVariable Long id) {
        College college = collegeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("College not found"));
        college.setVerified(true);
        collegeRepository.save(college);
        
        try {
            emailService.sendCollegeApprovalEmail(college.getUser().getEmail());
        } catch (Exception e) {
            System.out.println("Error sending college approval email: " + e.getMessage());
        }
        
        return ResponseEntity.ok(new MessageResponse("College verified successfully"));
    }

    @DeleteMapping("/colleges/{id}/reject")
    public ResponseEntity<?> rejectCollege(@PathVariable Long id) {
        College college = collegeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("College not found"));
        
        // Deleting the college also deletes the user due to Cascade
        userRepository.deleteById(id);
        
        return ResponseEntity.ok(new MessageResponse("College application rejected and deleted"));
    }
}
