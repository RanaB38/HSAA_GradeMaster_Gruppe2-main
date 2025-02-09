package de.hsaalen.grademaster.grademasterservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentWithGradeDTO  extends StudentDTO {
    private String grade;

    public StudentWithGradeDTO(Long id, String name, String email, String grade) {
        super(id, name, email);
        this.grade = grade;
    }
}
