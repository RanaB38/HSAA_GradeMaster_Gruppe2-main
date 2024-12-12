package de.hsaalen.grademaster.grademasterservice.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentDTO {
    private long iD;
    private String name;
    private String email;
}
