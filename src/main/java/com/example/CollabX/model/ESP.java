package com.example.CollabX.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "esps")
@Data
@NoArgsConstructor
public class ESP {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "college_id")
    @JsonIgnore
    private College college;

    public ESP(User user, College college) {
        this.user = user;
        this.college = college;
    }
}
