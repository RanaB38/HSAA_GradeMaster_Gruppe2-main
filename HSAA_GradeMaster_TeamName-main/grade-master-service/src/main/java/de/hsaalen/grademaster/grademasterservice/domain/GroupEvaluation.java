package de.hsaalen.grademaster.grademasterservice.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * Repräsentiert eine Bewertung für eine Gruppe innerhalb eines Kurses.
 * Eine Gruppenbewertung bezieht sich auf ein bestimmtes Bewertungsschema.
 */
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "GroupEvaluation")
public class GroupEvaluation {

    /**
     * Die eindeutige ID der Gruppenbewertung. Wird automatisch generiert.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Die Gruppe, die diese Bewertung erhält.
     * Many-to-One-Beziehung zu {@link Group}.
     */
    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    /**
     * Das Bewertungsschema, nach dem diese Bewertung erfolgt.
     * Many-to-One-Beziehung zu {@link Bewertungsschema}.
     */
    @ManyToOne
    @JoinColumn(name = "evaluation_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Bewertungsschema evaluation;

    /**
     * Die erzielte Punktzahl der Gruppe.
     */
    @Column(nullable = false)
    private double score;
}
