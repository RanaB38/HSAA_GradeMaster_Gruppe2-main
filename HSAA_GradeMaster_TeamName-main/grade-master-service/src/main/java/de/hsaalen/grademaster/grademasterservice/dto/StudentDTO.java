package de.hsaalen.grademaster.grademasterservice.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.*;

/**
 * Data Transfer Object (DTO) für einen Studenten.
 * Enthält grundlegende Informationen wie ID, Name und E-Mail-Adresse.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentDTO {

    /**
     * Die eindeutige ID des Studenten.
     * Kann auch als "Matrikelnummer" (Studierenden-ID) referenziert werden.
     */
    @JsonAlias({"id", "matrikelnummer"})
    private long iD;

    /**
     * Der Name des Studenten.
     */
    private String name;

    /**
     * Die E-Mail-Adresse des Studenten.
     */
    private String email;
}
