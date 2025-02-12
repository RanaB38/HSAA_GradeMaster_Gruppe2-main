package de.hsaalen.grademaster.grademasterservice.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Repräsentiert eine Gruppe innerhalb eines Kurses.
 * Eine Gruppe gehört zu einem Kurs und kann mehrere Studenten enthalten.
 */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "Course_Group")
@Table
public class Group {

    /**
     * Die eindeutige ID der Gruppe. Wird automatisch generiert.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Der Name der Gruppe. Muss eindeutig sein.
     */
    @Column(nullable = false, unique = true)
    private String name;

    /**
     * Der Kurs, zu dem diese Gruppe gehört.
     * Eine Gruppe kann nur zu einem Kurs gehören (Many-to-One-Beziehung).
     */
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnore
    private Course course;

    /**
     * Liste der Studenten, die in dieser Gruppe sind.
     * Many-to-Many-Beziehung zwischen Gruppen und Studenten.
     */
    @ManyToMany
    @JoinTable(
            name = "Assignment_Group_Student",  // Join-Tabelle für die Zuordnung
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    @JsonIgnore
    private List<Student> students = new ArrayList<>();

    /**
     * Liste der Gruppenbewertungen für diese Gruppe.
     * One-to-Many-Beziehung zwischen Gruppe und Gruppenbewertung.
     */
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupEvaluation> groupEvaluations = new ArrayList<>();

    /**
     * Fügt einen Studenten zur Gruppe hinzu, falls dieser nicht bereits enthalten ist.
     *
     * @param student Der hinzuzufügende Student.
     */
    public void addStudent(Student student) {
        if (!students.contains(student)) {  // Verhindert doppelte Einträge
            students.add(student);
            student.getGroups().add(this); // Bidirektionale Zuordnung
        }
    }

    /**
     * Entfernt einen Studenten aus der Gruppe.
     *
     * @param student Der zu entfernende Student.
     */
    public void removeStudent(Student student) {
        if (students.contains(student)) {
            students.remove(student);
            student.getGroups().remove(this); // Entfernt die bidirektionale Zuordnung
        }
    }

    /**
     * Fügt eine Gruppenbewertung zur Gruppe hinzu.
     *
     * @param groupEvaluation Die hinzuzufügende Gruppenbewertung.
     */
    public void addGroupEvaluation(GroupEvaluation groupEvaluation) {
        groupEvaluations.add(groupEvaluation);
        groupEvaluation.setGroup(this);
    }
}