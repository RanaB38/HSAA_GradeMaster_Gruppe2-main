package de.hsaalen.grademaster.grademasterservice.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity (name = "Student")
@Table
public class Student {
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;

    //Aufgabe 03 - Zuweisung

    //Many-to-Many-Beziehung zu Kurs
    @ManyToMany(mappedBy = "students")                      // Verknüpfung zu Kurs - keine eigene Tabelle
    private List<Course> courses = new ArrayList<>();           // Liste der Kurse, die der Student belegt

}
