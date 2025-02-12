package de.hsaalen.grademaster.grademasterservice.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Repräsentiert einen Kurs in der Datenbank.
 * Enthält Informationen zum Kurs sowie eine Liste der zugewiesenen Studenten und Bewertungsschemata.
 */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "Course")
@Table  // Erstellt automatisch eine Tabelle für Kurs in der Datenbank
public class Course {

    /**
     * Die eindeutige ID des Kurses. Wird automatisch generiert.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Der Name des Kurses.
     */
    private String name;

    /**
     * Eine Beschreibung des Kurses.
     */
    private String description;

    // Aufgabe 03 - Zuweisung

    /**
     * Liste der Studenten, die in diesem Kurs eingeschrieben sind.
     * Many-to-Many-Beziehung zwischen Kurs und Student.
     */
    @ManyToMany
    @JoinTable(
            name = "Assignment_Course_Student",  // Verknüpfungstabelle für Kurs und Student
            joinColumns = @JoinColumn(name = "course_id"),  // Spalte für Kurs-ID
            inverseJoinColumns = @JoinColumn(name = "student_id")  // Spalte für Student-ID
    )
    @JsonIgnore
    private List<Student> students = new ArrayList<>();

    /**
     * Fügt einen Studenten zum Kurs hinzu, falls dieser nicht bereits enthalten ist.
     *
     * @param student Der hinzuzufügende Student.
     */
    public void addStudent(Student student) {
        if (!students.contains(student)) {
            students.add(student);
            student.getCourses().add(this);
        }
    }

    /**
     * Entfernt einen Studenten aus dem Kurs.
     *
     * @param student Der zu entfernende Student.
     */
    public void removeStudent(Student student) {
        if (students.contains(student)) {
            students.remove(student);
            student.getCourses().remove(this);
        }
    }

    // Aufgabe 15 - Sprint 4

    /**
     * Liste der Bewertungsschemata, die mit diesem Kurs verknüpft sind.
     * One-to-Many-Beziehung zwischen Kurs und Bewertungsschema.
     */
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Bewertungsschema> bewertungsschemas = new ArrayList<>();

    /**
     * Fügt ein Bewertungsschema zum Kurs hinzu.
     *
     * @param bewertungsschema Das hinzuzufügende Bewertungsschema.
     */
    public void addBewertungsschema(Bewertungsschema bewertungsschema) {
        bewertungsschemas.add(bewertungsschema);
        bewertungsschema.setCourse(this);
    }

    /**
     * Entfernt ein Bewertungsschema aus dem Kurs.
     *
     * @param bewertungsschema Das zu entfernende Bewertungsschema.
     */
    public void removeBewertungsschema(Bewertungsschema bewertungsschema) {
        bewertungsschemas.remove(bewertungsschema);
        bewertungsschema.setCourse(null);
    }
}