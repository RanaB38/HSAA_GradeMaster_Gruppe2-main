package de.hsaalen.grademaster.grademasterservice.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Repräsentiert einen Benutzer im Web-System.
 * Enthält Authentifizierungsinformationen wie Benutzername, Passwort und Rolle.
 */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "WEB_USER")
public class WebUser {

    /**
     * Der eindeutige Benutzername des Web-Users.
     */
    @Id
    @Column(nullable = false, unique = true)
    private String username;

    /**
     * Das Passwort des Benutzers.
     * Sollte sicher gespeichert und gehasht werden.
     */
    @Column(nullable = false)
    private String password;

    /**
     * Die Rolle des Benutzers (z. B. "ADMIN", "STUDENT", "TEACHER").
     */
    @Column(nullable = false)
    private String role;
}