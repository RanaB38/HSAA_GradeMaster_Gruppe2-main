package de.hsaalen.grademaster.grademasterservice.controller;

import de.hsaalen.grademaster.grademasterservice.domain.Group;
import de.hsaalen.grademaster.grademasterservice.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/groups")
public class GroupController {

    private final GroupService groupService;

    @Autowired
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
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
        groupService.addStudentToGroup(groupId, studentId);
        return ResponseEntity.ok("Student added to group successfully.");
    }

    //Studenten aus einer Gruppe entfernen
    @DeleteMapping("/{groupId}/remove-student/{studentId}")
    public ResponseEntity<String> removeStudentFromGroup(@PathVariable Long groupId, @PathVariable Long studentId) {
        groupService.removeStudentFromGroup(groupId, studentId);
        return ResponseEntity.ok("Student removed from group successfully.");
    }
}