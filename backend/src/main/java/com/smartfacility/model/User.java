package com.smartfacility.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 30)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(columnDefinition = "boolean default true")
    private Boolean active = true;

    @Column(columnDefinition = "boolean default false")
    private Boolean mustResetPassword = false;

    @Column(length = 255)
    private String temporaryPassword;

    @Column(length = 12)
    private String passwordResetCode;

    private LocalDateTime passwordResetCodeExpiresAt;

    private LocalDateTime lastPasswordChangedAt;

    public User() {
    }

    public User(Long id, String fullName, String email, String password, Role role) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.active = true;
        this.mustResetPassword = false;
        this.temporaryPassword = null;
        this.passwordResetCode = null;
        this.passwordResetCodeExpiresAt = null;
        this.lastPasswordChangedAt = null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Boolean getMustResetPassword() {
        return mustResetPassword;
    }

    public void setMustResetPassword(Boolean mustResetPassword) {
        this.mustResetPassword = mustResetPassword;
    }

    public String getTemporaryPassword() {
        return temporaryPassword;
    }

    public void setTemporaryPassword(String temporaryPassword) {
        this.temporaryPassword = temporaryPassword;
    }

    public String getPasswordResetCode() {
        return passwordResetCode;
    }

    public void setPasswordResetCode(String passwordResetCode) {
        this.passwordResetCode = passwordResetCode;
    }

    public LocalDateTime getPasswordResetCodeExpiresAt() {
        return passwordResetCodeExpiresAt;
    }

    public void setPasswordResetCodeExpiresAt(LocalDateTime passwordResetCodeExpiresAt) {
        this.passwordResetCodeExpiresAt = passwordResetCodeExpiresAt;
    }

    public LocalDateTime getLastPasswordChangedAt() {
        return lastPasswordChangedAt;
    }

    public void setLastPasswordChangedAt(LocalDateTime lastPasswordChangedAt) {
        this.lastPasswordChangedAt = lastPasswordChangedAt;
    }

    public enum Role {
        ADMIN,
        STAFF,
        STUDENT
    }
}
