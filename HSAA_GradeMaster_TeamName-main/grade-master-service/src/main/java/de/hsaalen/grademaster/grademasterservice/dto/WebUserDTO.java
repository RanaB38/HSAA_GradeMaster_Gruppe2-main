package de.hsaalen.grademaster.grademasterservice.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WebUserDTO {
    private String username;
    private String role;
}
