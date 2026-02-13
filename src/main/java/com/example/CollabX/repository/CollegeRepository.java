package com.example.CollabX.repository;

import com.example.CollabX.model.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollegeRepository extends JpaRepository<College, Long> {
    List<College> findByIsVerifiedFalse();
    long countByIsVerifiedFalse();
}
