package de.hsaalen.grademaster.grademasterservice.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JsonIgnore
    private List<Course> courses = new ArrayList<>();           // Liste der Kurse, die der Student belegt

    // Many-to-Many-Beziehung zu Gruppen
    @ManyToMany(mappedBy = "students") // Bidirektionale Zuordnung
    @JsonIgnore
    private List<Group> groups = new ArrayList<>();

    public Student(String number, String name, String mail) {
        this.id = Long.valueOf(number);
        this.name = name;
        this.email = mail;
    }

    // Methode, um eine Gruppe hinzuzufügen
    public void addGroup(Group group) {
        if (!groups.contains(group)) {
            groups.add(group);
            group.getStudents().add(this); // Bidirektionale Zuordnung
        }
    }

    // Methode, um eine Gruppe zu entfernen
    public void removeGroup(Group group) {
        if (groups.contains(group)) {
            groups.remove(group);
            group.getStudents().remove(this); // Entfernen aus der bidirektionalen Zuordnung
        }
    }

}