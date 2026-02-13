package com.example.CollabX.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "colleges")
@Data
@NoArgsConstructor
public class College {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    @JsonIgnore
    private User user;

    private String collegeName;
    private String registrationNumber;
    private String collegeCode;
    private String address;
    private String city;
    private String state;
    private String website;
    
    private boolean isVerified = false;

    public College(User user, String collegeName, String registrationNumber, String collegeCode, String address, String city, String state, String website) {
        this.user = user;
        this.collegeName = collegeName;
        this.registrationNumber = registrationNumber;
        this.collegeCode = collegeCode;
        this.address = address;
        this.city = city;
        this.state = state;
        this.website = website;
    }
}
