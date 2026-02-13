package com.example.CollabX.repository;

import com.example.CollabX.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByStudentId(Long studentId);
    
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"student", "event"})
    List<Registration> findByEventIdOrderByIdAsc(Long eventId);

    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);
    
    @org.springframework.data.jpa.repository.Query("SELECT r FROM Registration r WHERE r.student.id = :studentId AND r.event.id = :eventId")
    java.util.Optional<Registration> findByStudentIdAndEventId(@org.springframework.data.repository.query.Param("studentId") Long studentId, @org.springframework.data.repository.query.Param("eventId") Long eventId);
}
