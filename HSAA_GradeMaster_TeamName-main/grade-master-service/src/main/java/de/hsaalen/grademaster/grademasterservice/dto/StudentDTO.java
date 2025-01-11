package de.hsaalen.grademaster.grademasterservice.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentDTO {
    @JsonAlias({"id", "matrikelnummer"})
    private long iD;
    private String name;
    private String email;
}
