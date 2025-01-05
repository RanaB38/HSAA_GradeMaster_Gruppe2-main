package de.hsaalen.grademaster.grademasterservice.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "bewertungsschema")
public class Bewertungsschema {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topic;

    private Integer percentage;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
}
