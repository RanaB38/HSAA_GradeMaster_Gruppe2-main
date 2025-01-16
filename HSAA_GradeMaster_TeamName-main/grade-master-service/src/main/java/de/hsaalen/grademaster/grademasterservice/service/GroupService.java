package de.hsaalen.grademaster.grademasterservice.service;

import de.hsaalen.grademaster.grademasterservice.domain.*;
import de.hsaalen.grademaster.grademasterservice.dto.GroupEvaluationDTO;
import de.hsaalen.grademaster.grademasterservice.repository.BewertungsschemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import de.hsaalen.grademaster.grademasterservice.repository.CourseRepository;
import de.hsaalen.grademaster.grademasterservice.repository.StudentRepository;
import de.hsaalen.grademaster.grademasterservice.repository.GroupRepository;

import java.util.List;


@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final BewertungsschemaRepository bewertungsschemaRepository;

    @Autowired
    public GroupService(GroupRepository groupRepository, CourseRepository courseRepository, StudentRepository studentRepository, BewertungsschemaRepository bewertungsschemaRepository) {
        this.groupRepository = groupRepository;
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
        this.bewertungsschemaRepository = bewertungsschemaRepository;
    }

    // Gruppe in einem Kurs erstellen
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

    // Alle Gruppen eines Kurses abrufen
    public List<Group> getGroupsByCourse(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new IllegalArgumentException("Course not found.");
        }
        return groupRepository.findByCourseId(courseId);
    }

    // Studenten zu einer Gruppe hinzufügen
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

    // Studenten aus einer Gruppe entfernen
    public void removeStudentFromGroup(Long groupId, Long studentId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found."));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found."));
        group.removeStudent(student);
        groupRepository.save(group);
    }

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

    public List<GroupEvaluation> getGroupEvaluations(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        return group.getGroupEvaluations();
    }
}