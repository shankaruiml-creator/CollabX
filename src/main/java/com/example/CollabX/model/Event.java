package com.example.CollabX.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String category; // Academic, Technical, Cultural, Career
    private String type; // Event, Workshop, Hackathon, Job Mela
    
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime registrationDate;
    private Double amount;
    
    private String venue;
    
    private String image1;
    private String image2;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "college_id")
    private College college;

    private LocalDateTime createdAt = LocalDateTime.now();
    
    private boolean isModerated = false;
    private boolean isApproved = true; // For now, auto-approve or set by admin
}
