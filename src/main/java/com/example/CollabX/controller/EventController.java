package com.example.CollabX.controller;

import com.example.CollabX.model.College;
import com.example.CollabX.model.Event;
import com.example.CollabX.repository.CollegeRepository;
import com.example.CollabX.service.EventService;
import com.example.CollabX.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private EventService eventService;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasAnyAuthority('ROLE_COLLEGE', 'ROLE_ADMIN', 'ROLE_ESP_PRESIDENT', 'ROLE_ESP_VICE_PRESIDENT')")
    public ResponseEntity<?> createEvent(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("type") String type,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("registrationDate") String registrationDate,
            @RequestParam("amount") Double amount,
            @RequestParam("venue") String venue,
            @RequestParam("collegeId") Long collegeId,
            @RequestParam(value = "image1", required = false) MultipartFile image1,
            @RequestParam(value = "image2", required = false) MultipartFile image2) {
        
        College college = collegeRepository.findById(collegeId)
                .orElseThrow(() -> new RuntimeException("College not found"));

        Event event = new Event();
        event.setTitle(title);
        event.setDescription(description);
        event.setCategory(category);
        event.setType(type);
        event.setStartDate(LocalDateTime.parse(startDate));
        event.setEndDate(LocalDateTime.parse(endDate));
        event.setRegistrationDate(LocalDateTime.parse(registrationDate));
        event.setAmount(amount);
        event.setVenue(venue);
        event.setCollege(college);

        if (image1 != null && !image1.isEmpty()) {
            event.setImage1(fileStorageService.save(image1));
        }
        if (image2 != null && !image2.isEmpty()) {
            event.setImage2(fileStorageService.save(image2));
        }

        return ResponseEntity.ok(eventService.saveEvent(event));
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasAnyAuthority('ROLE_COLLEGE', 'ROLE_ADMIN', 'ROLE_ESP_PRESIDENT', 'ROLE_ESP_VICE_PRESIDENT')")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("type") String type,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("registrationDate") String registrationDate,
            @RequestParam("amount") Double amount,
            @RequestParam("venue") String venue,
            @RequestParam(value = "image1", required = false) MultipartFile image1,
            @RequestParam(value = "image2", required = false) MultipartFile image2) {

        Event event = eventService.getEventById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setTitle(title);
        event.setDescription(description);
        event.setCategory(category);
        event.setType(type);
        event.setStartDate(LocalDateTime.parse(startDate));
        event.setEndDate(LocalDateTime.parse(endDate));
        event.setRegistrationDate(LocalDateTime.parse(registrationDate));
        event.setAmount(amount);
        event.setVenue(venue);

        if (image1 != null && !image1.isEmpty()) {
            event.setImage1(fileStorageService.save(image1));
        }
        if (image2 != null && !image2.isEmpty()) {
            event.setImage2(fileStorageService.save(image2));
        }

        return ResponseEntity.ok(eventService.saveEvent(event));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_COLLEGE', 'ROLE_ADMIN', 'ROLE_ESP_PRESIDENT', 'ROLE_ESP_VICE_PRESIDENT')")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/college/{collegeId}")
    public List<Event> getEventsByCollege(@PathVariable Long collegeId) {
        return eventService.getEventsByCollege(collegeId);
    }
}
