package de.hsaalen.grademaster.grademasterservice.controller;

import de.hsaalen.grademaster.grademasterservice.domain.Group;
import de.hsaalen.grademaster.grademasterservice.domain.Student;
import de.hsaalen.grademaster.grademasterservice.service.GroupService;
import de.hsaalen.grademaster.grademasterservice.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/private/v1/groups")
public class GroupController {

    private final GroupService groupService;
    private final GroupRepository groupRepository;

    @Autowired
    public GroupController(GroupService groupService, GroupRepository groupRepository) {
        this.groupService = groupService;
        this.groupRepository = groupRepository;
    }

    //Gruppe zu einem Kurs hinzufügen
    @PostMapping("/course/{courseId}")
    public ResponseEntity<String> createGroup(@PathVariable Long courseId, @RequestBody Group group) {
        try {
            groupService.createGroup(courseId, group);
            return ResponseEntity.status(HttpStatus.CREATED).body("Group created successfully.");
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Group already exists.");
            }
            return ResponseEntity.badRequest().body("Invalid group name.");
        }
    }

    //Alle Gruppen eines Kurses abrufen
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Group>> getGroupsByCourse(@PathVariable Long courseId) {
        List<Group> groups = groupService.getGroupsByCourse(courseId);
        return ResponseEntity.ok(groups);
    }

    //Studenten zu einer Gruppe hinzufügen
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

    //Studenten aus einer Gruppe entfernen
    @DeleteMapping("/{groupId}/remove-student/{studentId}")
    public ResponseEntity<String> removeStudentFromGroup(@PathVariable Long groupId, @PathVariable Long studentId) {
        groupService.removeStudentFromGroup(groupId, studentId);
        return ResponseEntity.ok("Student removed from group successfully.");
    }

    //Aufgabe 12
    @GetMapping("/{groupId}")
    public ResponseEntity<Group> getGroupById(@PathVariable Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found."));
        return ResponseEntity.ok(group);
    }

    @GetMapping("/{groupId}/students")
    public ResponseEntity<List<Student>> getStudentsInGroup(@PathVariable Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found."));
        return ResponseEntity.ok(group.getStudents());
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<String> deleteGroup(@PathVariable Long groupId) {
        if (!groupRepository.existsById(groupId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Group not found.");
        }
        groupRepository.deleteById(groupId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Group deleted successfully.");
    }
}