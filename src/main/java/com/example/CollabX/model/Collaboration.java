package com.example.CollabX.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "collaborations")
@Data
@NoArgsConstructor
public class Collaboration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_college_id")
    private College senderCollege;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_college_id")
    private College receiverCollege;

    private String subject;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED
    
    private LocalDateTime sentAt = LocalDateTime.now();
}
