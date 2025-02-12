package de.hsaalen.grademaster.grademasterservice.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Entität zur Darstellung eines Bewertungsschemas.
 * Enthält Informationen zu einem Bewertungsthema und dessen Gewichtung.
 */
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "bewertungsschema")
public class Bewertungsschema {

    /**
     * Eindeutige ID des Bewertungsschemas.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Thema des Bewertungsschemas.
     */
    private String topic;

    /**
     * Prozentuale Gewichtung des Themas in der Gesamtbewertung.
     */
    private int percentage;

    /**
     * Zugehöriger Kurs, dem dieses Bewertungsschema zugeordnet ist.
     */
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
}
