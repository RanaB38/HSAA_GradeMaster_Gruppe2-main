package de.hsaalen.grademaster.grademasterservice.dto;

import lombok.*;


/**
 * Data Transfer Object (DTO) für einen Studenten mit zugewiesener Note.
 * Erweitert {@link StudentDTO} um die Note des Studenten.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentWithGradeDTO extends StudentDTO {

    /**
     * Die Note des Studenten.
     */
    private String grade;

    /**
     * Konstruktor zur Erstellung eines Studenten mit einer Note.
     *
     * @param id    Die eindeutige ID des Studenten.
     * @param name  Der Name des Studenten.
     * @param email Die E-Mail-Adresse des Studenten.
     * @param grade Die Note des Studenten.
     */
    public StudentWithGradeDTO(Long id, String name, String email, String grade) {
        super(id, name, email);
        this.grade = grade;
    }
}