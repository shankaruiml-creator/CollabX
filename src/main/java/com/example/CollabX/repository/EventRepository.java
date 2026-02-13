package com.example.CollabX.repository;

import com.example.CollabX.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    @Query("SELECT e FROM Event e JOIN FETCH e.college WHERE e.category = :category")
    List<Event> findByCategory(@Param("category") String category);

    @Query("SELECT e FROM Event e JOIN FETCH e.college WHERE e.type = :type")
    List<Event> findByType(@Param("type") String type);
    
    @Query("SELECT e FROM Event e JOIN FETCH e.college WHERE e.college.id = :collegeId")
    List<Event> findByCollegeId(@Param("collegeId") Long collegeId);
    
    @Query("SELECT e FROM Event e JOIN FETCH e.college WHERE e.startDate > :startDate")
    List<Event> findByStartDateAfter(@Param("startDate") LocalDateTime startDate);
    
    long countByIsModeratedTrue();
}
