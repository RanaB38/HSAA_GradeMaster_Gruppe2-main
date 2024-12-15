package de.hsaalen.grademaster.grademasterservice.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "Course_Group")
@Table
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnore
    private Course course;

    // Many-to-Many-Beziehung mit Studenten
    @ManyToMany
    @JoinTable(
            name = "Assignment_Group_Student",  // Join-Tabelle für die Zuordnung
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    @JsonIgnore
    private List<Student> students = new ArrayList<>();

    // Methode, um einen Studenten hinzuzufügen, falls dieser nicht schon vorhanden ist
    public void addStudent(Student student) {
        if (!students.contains(student)) {  // Verhindern der doppelten Zuweisung
            students.add(student);
            student.getGroups().add(this); // Bidirektionale Zuordnung
        }
    }

    // Methode, um einen Studenten zu entfernen
    public void removeStudent(Student student) {
        if (students.contains(student)) {
            students.remove(student);
            student.getGroups().remove(this); // Entfernen aus der bidirektionalen Zuordnung
        }
    }
}