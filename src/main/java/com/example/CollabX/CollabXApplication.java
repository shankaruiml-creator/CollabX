package com.example.CollabX;

import com.example.CollabX.model.ERole;
import com.example.CollabX.model.Role;
import com.example.CollabX.model.User;
import com.example.CollabX.repository.RoleRepository;
import com.example.CollabX.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class CollabXApplication {

	public static void main(String[] args) {
		SpringApplication.run(CollabXApplication.class, args);
	}

	@Bean
	CommandLineRunner init(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			// Initialize Roles
			java.util.List<Role> allRoles = roleRepository.findAll();
			for (ERole roleName : ERole.values()) {
				java.util.List<Role> rolesWithName = allRoles.stream()
						.filter(r -> r.getName().equals(roleName))
						.toList();
				
				if (rolesWithName.isEmpty()) {
					roleRepository.save(new Role(roleName));
				} else if (rolesWithName.size() > 1) {
					// Clean up duplicates
					for (int i = 1; i < rolesWithName.size(); i++) {
						roleRepository.delete(rolesWithName.get(i));
					}
				}
			}

			// Initialize Admin User - Reset password to ensure it matches admin123
			User admin = userRepository.findByUsername("admin").orElse(null);
			if (admin == null) {
				admin = new User("admin", "admin@collabx.com", passwordEncoder.encode("admin123"));
				Set<Role> roles = new HashSet<>();
				Role adminRole = roleRepository.findAll().stream()
						.filter(r -> r.getName().equals(ERole.ROLE_ADMIN))
						.findFirst()
						.orElseThrow(() -> new RuntimeException("Error: Role Admin is not found."));
				roles.add(adminRole);
				admin.setRoles(roles);
				userRepository.save(admin);
			} else {
				// Update password to admin123 in case it was different
				admin.setPassword(passwordEncoder.encode("admin123"));
				userRepository.save(admin);
			}
		};
	}

}
