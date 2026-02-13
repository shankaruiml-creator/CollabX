package com.example.CollabX.repository;

import com.example.CollabX.model.ESP;
import com.example.CollabX.model.College;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ESPRepository extends JpaRepository<ESP, Long> {
    @EntityGraph(attributePaths = {"user", "user.roles"})
    List<ESP> findByCollege(College college);

    @EntityGraph(attributePaths = {"user", "user.roles"})
    List<ESP> findByCollegeId(Long collegeId);

    @EntityGraph(attributePaths = {"user", "user.roles"})
    Optional<ESP> findByUserId(Long userId);
}
