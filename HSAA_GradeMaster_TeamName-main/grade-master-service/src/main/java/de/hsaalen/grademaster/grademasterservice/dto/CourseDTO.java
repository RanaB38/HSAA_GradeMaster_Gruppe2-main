package de.hsaalen.grademaster.grademasterservice.dto;

import lombok.*;

import java.util.List;


/**
 * Data Transfer Object (DTO) für einen Kurs.
 * Enthält grundlegende Kursinformationen sowie eine Liste der zugewiesenen Studenten.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseDTO {

    /**
     * Die eindeutige ID des Kurses.
     */
    private long id;

    /**
     * Der Name des Kurses.
     */
    private String name;

    /**
     * Die Beschreibung des Kurses.
     */
    private String description;

    /**
     * Liste der Studenten, die diesem Kurs zugewiesen sind.
     */
    private List<StudentDTO> students;
}