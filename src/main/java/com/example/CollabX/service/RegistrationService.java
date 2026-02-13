package com.example.CollabX.service;

import com.example.CollabX.model.Registration;
import com.example.CollabX.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegistrationService {
    @Autowired
    private RegistrationRepository registrationRepository;

    @org.springframework.transaction.annotation.Transactional
    public Registration registerForEvent(Registration registration) {
        if (registrationRepository.existsByStudentIdAndEventId(registration.getStudent().getId(), registration.getEvent().getId())) {
            throw new RuntimeException("Already registered for this event");
        }
        return registrationRepository.save(registration);
    }

    public List<Registration> getRegistrationsByStudent(Long studentId) {
        return registrationRepository.findByStudentId(studentId);
    }

    public List<Registration> getRegistrationsByEvent(Long eventId) {
        return registrationRepository.findByEventIdOrderByIdAsc(eventId);
    }

    public java.util.Optional<Registration> getRegistrationByStudentAndEvent(Long studentId, Long eventId) {
        return registrationRepository.findByStudentIdAndEventId(studentId, eventId);
    }
}
