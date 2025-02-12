package de.hsaalen.grademaster.grademasterservice.dto;

import lombok.*;

/**
 * Data Transfer Object (DTO) für einen Web-Benutzer.
 * Enthält grundlegende Informationen wie Benutzername und Rolle.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WebUserDTO {

    /**
     * Der Benutzername des Web-Users.
     */
    private String username;

    /**
     * Die Rolle des Benutzers (z. B. "STUDENT").
     */
    private String role;
}