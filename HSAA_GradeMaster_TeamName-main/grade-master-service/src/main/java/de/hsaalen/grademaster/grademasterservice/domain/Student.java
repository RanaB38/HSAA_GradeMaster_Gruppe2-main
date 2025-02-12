package de.hsaalen.grademaster.grademasterservice.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Repräsentiert einen Studenten im System.
 * Ein Student kann mehrere Kurse und Gruppen belegen.
 */
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "Student")
@Table
public class Student {

    /**
     * Die eindeutige ID des Studenten.
     * Wird nicht automatisch generiert, sondern extern vergeben.
     */
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Der Name des Studenten.
     */
    private String name;

    /**
     * Die E-Mail-Adresse des Studenten.
     */
    private String email;

    // Aufgabe 03 - Zuweisung

    /**
     * Liste der Kurse, die der Student belegt.
     * Many-to-Many-Beziehung zwischen Studenten und Kursen.
     */
    @ManyToMany(mappedBy = "students") // Verknüpfung zu Kurs - keine eigene Tabelle
    @JsonIgnore
    private List<Course> courses = new ArrayList<>();

    /**
     * Liste der Gruppen, in denen der Student Mitglied ist.
     * Many-to-Many-Beziehung zwischen Studenten und Gruppen.
     */
    @ManyToMany(mappedBy = "students") // Bidirektionale Zuordnung
    @JsonIgnore
    private List<Group> groups = new ArrayList<>();

    /**
     * Konstruktor zum Erstellen eines Studenten mit spezifischen Werten.
     *
     * @param number Die ID des Studenten als String.
     * @param name   Der Name des Studenten.
     * @param mail   Die E-Mail-Adresse des Studenten.
     */
    public Student(String number, String name, String mail) {
        this.id = Long.valueOf(number);
        this.name = name;
        this.email = mail;
    }

    /**
     * Fügt den Studenten einer Gruppe hinzu, falls er nicht bereits Mitglied ist.
     *
     * @param group Die hinzuzufügende Gruppe.
     */
    public void addGroup(Group group) {
        if (!groups.contains(group)) {
            groups.add(group);
            group.getStudents().add(this); // Bidirektionale Zuordnung
        }
    }

    /**
     * Entfernt den Studenten aus einer Gruppe.
     *
     * @param group Die zu entfernende Gruppe.
     */
    public void removeGroup(Group group) {
        if (groups.contains(group)) {
            groups.remove(group);
            group.getStudents().remove(this); // Entfernen aus der bidirektionalen Zuordnung
        }
    }
}
