package com.example.CollabX.repository;

import com.example.CollabX.model.Collaboration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollaborationRepository extends JpaRepository<Collaboration, Long> {
    List<Collaboration> findBySenderCollegeId(Long senderCollegeId);
    List<Collaboration> findByReceiverCollegeId(Long receiverCollegeId);
}
