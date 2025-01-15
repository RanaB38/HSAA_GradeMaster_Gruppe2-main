package de.hsaalen.grademaster.grademasterservice.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "GroupEvaluation")
public class GroupEvaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @ManyToOne
    @JoinColumn(name = "evaluation_id", nullable = false)
    private Bewertungsschema evaluation;

    @Column(nullable = false)
    private double score;
}
