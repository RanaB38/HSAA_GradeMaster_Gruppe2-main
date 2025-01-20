package de.hsaalen.grademaster.grademasterservice.dto;

import de.hsaalen.grademaster.grademasterservice.domain.Student;
import de.hsaalen.grademaster.grademasterservice.domain.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GroupDTO {
    private Long id;
    private String name;
    private Long courseId;
    private List<Student> students;
    private List<GroupEvaluationDTO> evaluations;
}
