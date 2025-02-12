package de.hsaalen.grademaster.grademasterservice.dto;

import lombok.*;

/**
 * Data Transfer Object (DTO) für eine Gruppenbewertung.
 * Enthält die ID der Bewertung sowie die erreichte Punktzahl.
 */
@Getter
@Setter
@AllArgsConstructor
@Builder
public class GroupEvaluationDTO {

    /**
     * Die eindeutige ID der Gruppenbewertung.
     */
    private Long id;

    /**
     * Die erzielte Punktzahl der Gruppe.
     */
    private double score;
}