package de.hsaalen.grademaster.grademasterservice.service;

import de.hsaalen.grademaster.grademasterservice.domain.*;
import de.hsaalen.grademaster.grademasterservice.dto.GroupEvaluationDTO;
import de.hsaalen.grademaster.grademasterservice.repository.BewertungsschemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import de.hsaalen.grademaster.grademasterservice.repository.CourseRepository;
import de.hsaalen.grademaster.grademasterservice.repository.StudentRepository;
import de.hsaalen.grademaster.grademasterservice.repository.GroupRepository;
import de.hsaalen.grademaster.grademasterservice.repository.NotenspiegelRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final BewertungsschemaRepository bewertungsschemaRepository;
    private final NotenspiegelRepository notenspiegelRepository;

    /**
     * Konstruktor, der die Repositories für die verschiedenen Entitäten injiziert.
     * @param groupRepository Repository für Gruppen.
     * @param courseRepository Repository für Kurse.
     * @param studentRepository Repository für Studenten.
     * @param bewertungsschemaRepository Repository für Bewertungsschemas.
     * @param notenspiegelRepository Repository für Notenspiegel.
     */
    @Autowired
    public GroupService(GroupRepository groupRepository, CourseRepository courseRepository, StudentRepository studentRepository, BewertungsschemaRepository bewertungsschemaRepository, NotenspiegelRepository notenspiegelRepository) {
        this.groupRepository = groupRepository;
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
        this.bewertungsschemaRepository = bewertungsschemaRepository;
        this.notenspiegelRepository = notenspiegelRepository;
    }

    /**
     * Erstellt eine neue Gruppe für einen bestimmten Kurs.
     * Überprüft, ob eine Gruppe mit dem gleichen Namen bereits existiert.
     * @param courseId Die ID des Kurses, zu dem die Gruppe hinzugefügt werden soll.
     * @param group Die Gruppe, die erstellt werden soll.
     */
    public void createGroup(Long courseId, Group group) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found."));
        // Überprüfen, ob bereits eine Gruppe mit dem gleichen Namen für diesen Kurs existiert
        boolean groupExists = groupRepository.existsByCourseIdAndName(courseId, group.getName());
        if (groupExists) {
            throw new IllegalArgumentException("A group with this name already exists in this course.");
        }
        group.setCourse(course);
        groupRepository.save(group);
    }

    /**
     * Holt alle Gruppen für einen bestimmten Kurs.
     * @param courseId Die ID des Kurses, für den Gruppen abgerufen werden sollen.
     * @return Eine Liste von Gruppen, die dem Kurs zugeordnet sind.
     */
    public List<Group> getGroupsByCourse(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new IllegalArgumentException("Course not found.");
        }
        return groupRepository.findByCourseId(courseId);
    }

    /**
     * Fügt einen Studenten zu einer bestimmten Gruppe hinzu.
     * Überprüft, ob der Student im Kurs eingeschrieben ist und ob er bereits in einer anderen Gruppe ist.
     * @param groupId Die ID der Gruppe, zu der der Student hinzugefügt werden soll.
     * @param studentId Die ID des Studenten, der hinzugefügt werden soll.
     */
    public void addStudentToGroup(Long groupId, Long studentId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found."));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found."));

        // Überprüfen, ob der Student im Kurs eingeschrieben ist
        Course course = group.getCourse();
        if (!course.getStudents().contains(student)) {
            throw new IllegalArgumentException("Student is not enrolled in the course.");
        }

        List<Group> groupList = groupRepository.findByCourseId(course.getId());

        for (Group g : groupList) {

            if (g.getStudents().contains(student)) {
                throw new IllegalArgumentException("Student is in a different group");
            }
        }

        group.addStudent(student);
        groupRepository.save(group);
    }

    /**
     * Entfernt einen Studenten aus einer Gruppe.
     * @param groupId Die ID der Gruppe, aus der der Student entfernt werden soll.
     * @param studentId Die ID des Studenten, der entfernt werden soll.
     */
    public void removeStudentFromGroup(Long groupId, Long studentId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found."));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found."));
        group.removeStudent(student);
        groupRepository.save(group);
    }

    /**
     * Weist einem Kurs eine Bewertung zu, basierend auf dem Bewertungsschema des Kurses.
     * @param group Die Gruppe, die die Bewertungsschemata zugewiesen bekommen soll.
     */
    public void assignEvaluationSchemaToGroup(Group group) {
        List<Bewertungsschema> evagroup =  bewertungsschemaRepository.findByCourseId(group.getCourse().getId());
        for (Bewertungsschema bewertungsschema : evagroup) {
            GroupEvaluation evaluation = new GroupEvaluation();
            evaluation.setGroup(group);
            evaluation.setEvaluation(bewertungsschema);
            evaluation.setScore(0);
            group.addGroupEvaluation(evaluation);
        }
        groupRepository.save(group);
    }

    /**
     * Speichert die Bewertungen für eine Gruppe.
     * @param groupId Die ID der Gruppe, deren Bewertungen gespeichert werden sollen.
     * @param evaluations Eine Liste von Bewertungen, die gespeichert werden.
     */
    public void saveEvaluations(Long groupId, List<GroupEvaluationDTO> evaluations) {

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));
        for (GroupEvaluationDTO dto : evaluations) {

            GroupEvaluation evaluation = group.getGroupEvaluations()
                    .stream()
                    .filter(e -> e.getId().equals(dto.getId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Evaluation not found"));
            if (dto.getScore() < 0 || dto.getScore() > 100) {
                throw new IllegalArgumentException("Invalid score value: " + dto.getScore());
            }
            evaluation.setScore(dto.getScore());
        }
        groupRepository.save(group);
    }

    /**
     * Holt alle Bewertungen für eine Gruppe.
     * @param groupId Die ID der Gruppe, deren Bewertungen abgerufen werden sollen.
     * @return Eine Liste von Gruppenbewertungen.
     */
    public List<GroupEvaluation> getGroupEvaluations(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        return group.getGroupEvaluations();
    }

    // Aufgabe 22 - Sprint 5
    /**
     * Berechnet die Gesamtbewertung für eine Gruppe basierend auf den Gewichtungen der Bewertungen.
     * Gibt die berechneten Ergebnisse als Map zurück.
     * @param groupId Die ID der Gruppe, für die die Gesamtbewertung berechnet werden soll.
     * @return Eine Map mit der Gesamtpunktzahl, der Note und der Farbe der Note.
     */
    public Map<String, Object> calculateGroupOverallEvaluation(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found."));

        double totalScore = 0;
        int totalWeight = 0;

        for (GroupEvaluation evaluation : group.getGroupEvaluations()) {
            double score = evaluation.getScore();
            int weight = evaluation.getEvaluation().getPercentage();
            totalScore += (weight / 100.0) * score;
            totalWeight += weight;
        }

        if (totalWeight != 100) {
            throw new IllegalStateException("Gesamtgewichtung der Bewertungsschemata muss 100% sein.");
        }

        List<Notenspiegel> notenspiegel = notenspiegelRepository.findAll();
        if (notenspiegel.isEmpty()) {
            throw new IllegalStateException("No grading schema defined in Notenspiegel.");
        }

        String grade = "Keine Note";
        String gradeColor = "white";
        for (Notenspiegel note : notenspiegel) {
            if (totalScore <= note.getMaxPercentage() && totalScore > note.getMinPercentage()) {
                grade = note.getGrade();
                gradeColor = getColorForGrade(note.getGrade());
                break;
            }
        }

        Map<String, Object> evaluationResult = new HashMap<>();
        evaluationResult.put("totalScore", totalScore);
        evaluationResult.put("grade", grade);
        evaluationResult.put("gradeColor", gradeColor);

        return evaluationResult;
    }

    /**
     * Bestimmt die Farbe für eine Note, um sie farblich darzustellen.
     * @param grade Die Note, für die die Farbe bestimmt werden soll.
     * @return Die Farbe, die der Note zugeordnet ist.
     */
    private String getColorForGrade(String grade) {
        switch (grade) {
            case "1.0":
            case "1.3":
                return "green";
            case "1.7":
            case "2.0":
            case "2.3":
                return "yellowgreen";
            case "2.7":
            case "3.0":
            case "3.3":
                return "yellow";
            case "3.7":
            case "4.0":
                return "orange";
            case "5.0":
                return "red";
            default:
                return "white";
        }
    }
}
