package com.example.CollabX.security;

import com.example.CollabX.model.ERole;
import com.example.CollabX.model.Role;
import com.example.CollabX.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName(ERole.ROLE_STUDENT).isEmpty()) {
                roleRepository.save(new Role(ERole.ROLE_STUDENT));
            }
            if (roleRepository.findByName(ERole.ROLE_COLLEGE).isEmpty()) {
                roleRepository.save(new Role(ERole.ROLE_COLLEGE));
            }
            if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
                roleRepository.save(new Role(ERole.ROLE_ADMIN));
            }
            if (roleRepository.findByName(ERole.ROLE_ESP_PRESIDENT).isEmpty()) {
                roleRepository.save(new Role(ERole.ROLE_ESP_PRESIDENT));
            }
            if (roleRepository.findByName(ERole.ROLE_ESP_VICE_PRESIDENT).isEmpty()) {
                roleRepository.save(new Role(ERole.ROLE_ESP_VICE_PRESIDENT));
            }
            if (roleRepository.findByName(ERole.ROLE_ESP_REGISTER_1).isEmpty()) {
                roleRepository.save(new Role(ERole.ROLE_ESP_REGISTER_1));
            }
            if (roleRepository.findByName(ERole.ROLE_ESP_REGISTER_2).isEmpty()) {
                roleRepository.save(new Role(ERole.ROLE_ESP_REGISTER_2));
            }
            if (roleRepository.findByName(ERole.ROLE_ESP_REGISTER_3).isEmpty()) {
                roleRepository.save(new Role(ERole.ROLE_ESP_REGISTER_3));
            }
        };
    }
}
