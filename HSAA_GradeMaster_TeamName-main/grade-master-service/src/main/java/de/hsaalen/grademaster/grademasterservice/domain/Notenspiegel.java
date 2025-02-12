package de.hsaalen.grademaster.grademasterservice.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * Repräsentiert eine Notenskala (Notenspiegel) für die Bewertung von Leistungen.
 * Enthält Informationen über die prozentualen Grenzen und die zugehörige Note.
 */
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "notenspiegel")
public class Notenspiegel {

    /**
     * Die eindeutige ID des Notenspiegels. Wird automatisch generiert.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Der minimale Prozentsatz für diese Note.
     */
    private double minPercentage;

    /**
     * Der maximale Prozentsatz für diese Note.
     */
    private double maxPercentage;

    /**
     * Die Note, die innerhalb dieses Prozentbereichs vergeben wird.
     */
    private String grade;

    /**
     * Eine optionale Beschreibung zur Note (z. B. "Sehr gut", "Befriedigend").
     */
    private String description;
}
