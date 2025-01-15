package de.hsaalen.grademaster.grademasterservice.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class GroupEvaluationDTO {
    private Long id;
    private double score;
}
