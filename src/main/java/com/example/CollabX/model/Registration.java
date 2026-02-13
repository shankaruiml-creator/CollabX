package com.example.CollabX.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "registrations")
@Data
@NoArgsConstructor
public class Registration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    private LocalDateTime registrationDate = LocalDateTime.now();
    
    private String status = "PENDING"; // PENDING, CONFIRMED, CANCELLED

    private String fullName;
    private String dob;
    private String email;
    private String mobileNumber;
    private String collegeName;
    private String collegeCode;
    private String rollNumber;
    private Double amount;
    private String paymentStatus = "UNPAID"; // UNPAID, PAID
    private String registrationId;
}
