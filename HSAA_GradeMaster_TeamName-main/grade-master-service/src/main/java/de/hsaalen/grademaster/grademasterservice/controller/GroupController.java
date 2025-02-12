package de.hsaalen.grademaster.grademasterservice.controller;

import de.hsaalen.grademaster.grademasterservice.domain.*;
import de.hsaalen.grademaster.grademasterservice.dto.GroupDTO;
import de.hsaalen.grademaster.grademasterservice.dto.GroupEvaluationDTO;
import de.hsaalen.grademaster.grademasterservice.repository.CourseRepository;
import de.hsaalen.grademaster.grademasterservice.repository.UserRepository;
import de.hsaalen.grademaster.grademasterservice.service.GroupService;
import de.hsaalen.grademaster.grademasterservice.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/private/v1/groups")
public class GroupController {

    private final GroupService groupService;
    private final GroupRepository groupRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    /**
     * Konstruktor für den GroupController.
     * @param groupService Der Service, der für die Logik von Gruppen verantwortlich ist.
     * @param groupRepository Das Repository zum Speichern und Abrufen von Gruppen.
     * @param courseRepository Das Repository zum Speichern und Abrufen von Kursen.
     * @param userRepository Das Repository zum Speichern und Abrufen von Benutzern.
     */
    @Autowired
    public GroupController(GroupService groupService, GroupRepository groupRepository, CourseRepository courseRepository, UserRepository userRepository) {
        this.groupService = groupService;
        this.groupRepository = groupRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    /**
     * Erzeugt eine neue Gruppe für einen bestimmten Kurs.
     * @param courseId Die ID des Kurses, dem die Gruppe zugeordnet wird.
     * @param group Die zu erstellende Gruppe.
     * @return Eine Antwort mit dem Statuscode und einer Nachricht.
     */
    @PostMapping("/course/{courseId}")
    public ResponseEntity<String> createGroup(@PathVariable Long courseId, @RequestBody Group group) {
        try {
            groupService.createGroup(courseId, group);
            Course course = courseRepository.findById(courseId).get();
            if (course.getBewertungsschemas() != null) {
                groupService.assignEvaluationSchemaToGroup(group);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body("Group created successfully.");
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Group already exists.");
            }
            return ResponseEntity.badRequest().body("Invalid group name.");
        }
    }

    /**
     * Ruft alle Gruppen für einen bestimmten Kurs ab.
     * @param courseId Die ID des Kurses.
     * @return Eine Liste von DTOs, die die Gruppen repräsentieren.
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<GroupDTO>> getGroupsByCourse(@PathVariable Long courseId) {
        try {
            // Hole alle Gruppen des Kurses
            List<Group> groups = groupService.getGroupsByCourse(courseId);

            // Wandle die Gruppen in DTOs um
            List<GroupDTO> groupDTOs = new ArrayList<>();
            for (Group group : groups) {
                List<GroupEvaluationDTO> evaluationDTOs = new ArrayList<>();
                for (GroupEvaluation evaluation : group.getGroupEvaluations()) {
                    GroupEvaluationDTO evaluationDTO = new GroupEvaluationDTO(evaluation.getId(), evaluation.getScore());
                    evaluationDTOs.add(evaluationDTO);
                }
                GroupDTO groupDTO = new GroupDTO();
                groupDTO.setId(group.getId());
                groupDTO.setName(group.getName());
                groupDTO.setCourseId(group.getCourse().getId());
                groupDTO.setStudents(group.getStudents());
                groupDTO.setEvaluations(evaluationDTOs);
                groupDTOs.add(groupDTO);
            }

            return ResponseEntity.ok(groupDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Fügt einem bestimmten Studenten eine Gruppe hinzu.
     * @param groupId Die ID der Gruppe.
     * @param studentId Die ID des Studenten, der hinzugefügt werden soll.
     * @return Eine Antwort mit dem Statuscode und einer Nachricht.
     */
    @PostMapping("/{groupId}/add-student/{studentId}")
    public ResponseEntity<String> addStudentToGroup(@PathVariable Long groupId, @PathVariable Long studentId) {
        try {
            groupService.addStudentToGroup(groupId, studentId);
            return ResponseEntity.ok("Student added to group successfully.");
        }
        catch (IllegalArgumentException e) {
            if (e.getMessage().contains("Student not found.")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Student not found");
            } else if (e.getMessage().contains("Group not found.")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Group not found");
            } else if (e.getMessage().contains("Student is not enrolled in the course.")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Student is not enrolled in the course");
            }else if (e.getMessage().contains("Student is in a different group")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Student is in a different group");
            }
            return ResponseEntity.badRequest().body("unexpected error");
        }

    }

    /**
     * Entfernt einen Studenten aus einer Gruppe.
     * @param groupId Die ID der Gruppe.
     * @param studentId Die ID des Studenten, der entfernt werden soll.
     * @return Eine Antwort mit dem Statuscode und einer Nachricht.
     */
    @DeleteMapping("/{groupId}/remove-student/{studentId}")
    public ResponseEntity<String> removeStudentFromGroup(@PathVariable Long groupId, @PathVariable Long studentId) {
        groupService.removeStudentFromGroup(groupId, studentId);
        return ResponseEntity.ok("Student removed from group successfully.");
    }

    //Aufgabe 12
    /**
     * Ruft eine Gruppe anhand ihrer ID ab.
     * @param groupId Die ID der Gruppe.
     * @return Ein DTO, das die Gruppeninformationen enthält.
     */
    @GetMapping("/{groupId}")
    public ResponseEntity<GroupDTO> getGroupById(@PathVariable Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found."));
        List<Student> students = new ArrayList<>();
        for (Student student : group.getStudents()) {
            students.add(student);
        }

        List<GroupEvaluationDTO> evaluationDTOs = new ArrayList<>();
        for (GroupEvaluation evaluation : group.getGroupEvaluations()) {
            GroupEvaluationDTO evaluationDTO = new GroupEvaluationDTO(evaluation.getId(), evaluation.getScore());
            evaluationDTOs.add(evaluationDTO);
        }

        GroupDTO groupDTO = new GroupDTO();
        groupDTO.setId(group.getId());
        groupDTO.setName(group.getName());
        groupDTO.setCourseId(group.getCourse().getId());
        groupDTO.setStudents(students);
        groupDTO.setEvaluations(evaluationDTOs);

        return ResponseEntity.ok(groupDTO);
    }

    /**
     * Ruft alle Studenten einer bestimmten Gruppe ab.
     * @param groupId Die ID der Gruppe.
     * @return Eine Liste von Studenten, die zur Gruppe gehören.
     */
    @GetMapping("/{groupId}/students")
    public ResponseEntity<List<Student>> getStudentsInGroup(@PathVariable Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found."));
        return ResponseEntity.ok(group.getStudents());
    }

    /**
     * Löscht eine Gruppe anhand ihrer ID.
     * @param groupId Die ID der zu löschenden Gruppe.
     * @return Eine Antwort mit dem Statuscode und einer Nachricht.
     */
    @DeleteMapping("/{groupId}")
    public ResponseEntity<String> deleteGroup(@PathVariable Long groupId) {
        if (!groupRepository.existsById(groupId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Group not found.");
        }
        groupRepository.deleteById(groupId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Group deleted successfully.");
    }

    /**
     * Weist einer Gruppe ein Bewertungsschema zu.
     * @param groupId Die ID der Gruppe, der das Bewertungsschema zugewiesen werden soll.
     * @return Eine Antwort mit dem Statuscode.
     */
    @PutMapping("/assigneEvaluation/{groupId}")
    public ResponseEntity<Void> assignEvaluationSchemaToGroup(@PathVariable Long groupId) {
        try {
            Group group = groupRepository.findById(groupId)
                    .orElseThrow(() -> new IllegalArgumentException("Group not found"));
            groupService.assignEvaluationSchemaToGroup(group);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Ruft alle Bewertungen einer Gruppe ab.
     * @param groupId Die ID der Gruppe.
     * @return Eine Liste von DTOs, die die Bewertungen der Gruppe repräsentieren.
     */
    @GetMapping("/evaluations/{groupId}")
    public ResponseEntity<List<GroupEvaluationDTO>> getGroupEvaluations(@PathVariable Long groupId) {
        try {
            List<GroupEvaluation> evaluations = groupService.getGroupEvaluations(groupId);
            List<GroupEvaluationDTO> groupEvaluationDTO = new ArrayList<>();
            for (GroupEvaluation evaluation : evaluations) {
                GroupEvaluationDTO groupEvaluationDTOList = new GroupEvaluationDTO(evaluation.getId(), evaluation.getScore());
                groupEvaluationDTO.add(groupEvaluationDTOList);
            }

            return ResponseEntity.ok(groupEvaluationDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Speichert neue Bewertungen für eine Gruppe.
     * @param groupId Die ID der Gruppe.
     * @param evaluations Die neuen Bewertungen, die gespeichert werden sollen.
     * @return Eine Antwort mit dem Statuscode.
     */
    @PutMapping("/{groupId}/evaluations")
    public ResponseEntity<Void> saveGroupEvaluations(@PathVariable Long groupId, @RequestBody List<GroupEvaluationDTO> evaluations) {
        try {
            groupService.saveEvaluations(groupId, evaluations);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Aufgabe 22 - Sprint 5
    /**
     * Berechnet die Gesamtbewertung einer Gruppe.
     * @param groupId Die ID der Gruppe, deren Gesamtbewertung berechnet werden soll.
     * @return Eine Antwort mit der Gesamtbewertung der Gruppe.
     */
    @GetMapping("/{groupId}/overall-evaluation")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<Map<String, Object>> getGroupOverallEvaluation(@PathVariable Long groupId) {
        try {
            Map<String, Object> evaluation = groupService.calculateGroupOverallEvaluation(groupId);
            return ResponseEntity.ok(evaluation);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "No grading schema defined in Notenspiegel."));
        }
    }
}