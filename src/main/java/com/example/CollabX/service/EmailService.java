package com.example.CollabX.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your CollabX Registration OTP");
        message.setText("Your OTP for registration is: " + otp + "\nThis OTP is valid for 5 minutes.");
        mailSender.send(message);
    }

    public void sendStudentRegistrationEmail(String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Registration Successful - CollabX");
        message.setText("u have succesgully registered and you can login for the role of student");
        mailSender.send(message);
    }

    public void sendCollegeRegistrationEmail(String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Registration Successful - CollabX");
        message.setText("registrational successful and wait for the admin approval for login");
        mailSender.send(message);
    }

    public void sendCollegeApprovalEmail(String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Account Approved - CollabX");
        message.setText("your college has been approved by the admin and u can login now");
        mailSender.send(message);
    }
}
