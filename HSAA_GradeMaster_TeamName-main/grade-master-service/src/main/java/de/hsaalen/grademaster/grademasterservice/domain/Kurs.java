package de.hsaalen.grademaster.grademasterservice.domain;

import de.hsaalen.grademaster.grademasterservice.domain.Student;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "Kurs")
@Table                      // Erstellt automatisch eine Tabelle mit Kurs in der Datenbank
public class Kurs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)     //ID wird automatisch generiert
    private Long id;
    private String name;
    private String description;

    //Aufgabe 03 - Zuweisung

    //Many-to-Many-Beziehung zu Student
    @ManyToMany
    @JoinTable(
            name = "Assignment Kurs-Student",                        //Tabelle zur Verknüpfung von kurs und student
            joinColumns = @JoinColumn(name = "kurs_id"),            // Spalte für Kurs ID
            inverseJoinColumns = @JoinColumn(name = "student_id")   // Spalte für Student ID
    )
    private List<Student> students = new ArrayList<>();             // Liste der Studenten, die den Kurs belegen

    // Methode, um einen Studenten hinzuzufügen, falls dieser nicht schon vorhanden ist
    public void addStudent(Student student) {
        if (!students.contains(student)) {                          // Verhindern der doppelten Zuweisung
            students.add(student);
            student.getKurse().add(this);
        }
    }
}