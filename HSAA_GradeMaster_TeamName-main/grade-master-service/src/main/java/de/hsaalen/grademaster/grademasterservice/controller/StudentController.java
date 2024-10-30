package de.hsaalen.grademaster.grademasterservice.controller;

import de.hsaalen.grademaster.grademasterservice.domain.Student;
import de.hsaalen.grademaster.grademasterservice.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/student")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    //Liste aller Studenten aus der DB
    @GetMapping
    public List<Student> getStudents() {
        return studentService.getStudents();
    }

    //Fehlerbehandlung für das Hinzufügen eines Studenten mit doppelter ID
    @PostMapping
    public ResponseEntity<String> registerNewStudent(@RequestBody Student student) {
        // Überprüfen auf leere Felder, damit Name und Email vorhanden sind
        if (student.getName() == null || student.getName().isEmpty() ||
                student.getEmail() == null || student.getEmail().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Name and email are required and cannot be empty.");
        }
        try {
            studentService.addNewStudent(student);          //Versucht den neuen Student hinzuzufügen
            return ResponseEntity.status(HttpStatus.CREATED).body("Student created successfully.");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage()); // 409 bei doppelter ID
        }
    }

    //Fehlerbehandlung für das Löschen eines Studenten mit nicht vorhandener ID
    @DeleteMapping(path = "{studentId}")
    public ResponseEntity<String> deleteStudent(@PathVariable("studentId") Long studentId) {
        try {
            studentService.deleteStudent(studentId);         //Versucht den Student anhand der ID zu löschen
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Student deleted successfully.");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()); // 404 wenn die ID nicht existiert
        }
    }

    //Student nach ID finden
    @GetMapping(path = "{studentId}")
    public ResponseEntity<Student> getStudentById(@PathVariable("studentId") Long studentId) {
        Student student = studentService.getStudentById(studentId);
        return ResponseEntity.ok(student);          //200 bei gefundenem Kurs
    }

}


