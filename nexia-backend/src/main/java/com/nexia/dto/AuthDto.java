package com.nexia.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDto {

    public static class RegisterRequest {
        @NotBlank private String fullName;
        @Email @NotBlank private String email;
        @Size(min = 6) @NotBlank private String password;

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginRequest {
        @Email @NotBlank private String email;
        @NotBlank private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private String token;
        private String email;
        private String fullName;
        private String role;

        public AuthResponse() {}
        public AuthResponse(String token, String email, String fullName, String role) {
            this.token = token; this.email = email; this.fullName = fullName; this.role = role;
        }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private String token, email, fullName, role;
            public Builder token(String t) { this.token = t; return this; }
            public Builder email(String e) { this.email = e; return this; }
            public Builder fullName(String f) { this.fullName = f; return this; }
            public Builder role(String r) { this.role = r; return this; }
            public AuthResponse build() { return new AuthResponse(token, email, fullName, role); }
        }

        public String getToken() { return token; }
        public String getEmail() { return email; }
        public String getFullName() { return fullName; }
        public String getRole() { return role; }
    }
}
