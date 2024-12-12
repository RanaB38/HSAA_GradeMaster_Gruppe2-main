package de.hsaalen.grademaster.grademasterservice.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseDTO {
    private long id;
    private String name;
    private String description;
    private List<StudentDTO> students;
}
