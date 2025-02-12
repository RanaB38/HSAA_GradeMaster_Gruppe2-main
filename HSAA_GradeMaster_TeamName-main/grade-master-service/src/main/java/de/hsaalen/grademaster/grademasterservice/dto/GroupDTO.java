package de.hsaalen.grademaster.grademasterservice.dto;

import de.hsaalen.grademaster.grademasterservice.domain.Student;
import de.hsaalen.grademaster.grademasterservice.domain.*;
import lombok.*;

import java.util.List;

/**
 * Data Transfer Object (DTO) für eine Gruppe innerhalb eines Kurses.
 * Enthält grundlegende Gruppeninformationen sowie zugehörige Studenten und Bewertungen.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GroupDTO {

    /**
     * Die eindeutige ID der Gruppe.
     */
    private Long id;

    /**
     * Der Name der Gruppe.
     */
    private String name;

    /**
     * Die ID des Kurses, zu dem diese Gruppe gehört.
     */
    private Long courseId;

    /**
     * Liste der Studenten, die dieser Gruppe zugewiesen sind.
     */
    private List<Student> students;

    /**
     * Liste der Gruppenbewertungen für diese Gruppe.
     */
    private List<GroupEvaluationDTO> evaluations;
}

