package de.hsaalen.grademaster.grademasterservice.controller;

import de.hsaalen.grademaster.grademasterservice.domain.Student;
import de.hsaalen.grademaster.grademasterservice.dto.StudentDTO;
import de.hsaalen.grademaster.grademasterservice.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = "api/private/v1/student")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    //Liste aller Studenten aus der DB
    @GetMapping
    public List<StudentDTO> getStudents() {

        List<Student> students = studentService.getStudents();  //Liste aller studenten holen
        List<StudentDTO>studentsDTO = new ArrayList<>();        //Leere liste für DTO

        //Liste der Studenten in die leere liste von StudetenDTO übergeben mit den benötigten parametern
        for (Student student : students) {
            StudentDTO studentDTO = new StudentDTO(student.getId(), student.getName(),student.getEmail());
            studentsDTO.add(studentDTO);
        }

        //Liste zurückgeben mit HTTP 200 als antwort
        return ResponseEntity.ok(studentsDTO).getBody();
    }

    //Fehlerbehandlung für das Hinzufügen eines Studenten mit doppelter ID
    @PostMapping
    public ResponseEntity<String> registerNewStudent(@RequestBody Student student) {

        // Überprüfen auf leere Felder, damit Name und Email vorhanden sind
        if (student.getId() == null || student.getId().describeConstable().isEmpty() ||
                student.getName() == null || student.getName().isEmpty() ||
                student.getEmail() == null || student.getEmail().isEmpty()) {

            //HTTP 400 zurückgeben wenn was fehlt
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Name and email are required and cannot be empty.");
        }

        try {
            //Versucht den neuen Student hinzuzufügen
            studentService.addNewStudent(student);
            return ResponseEntity.status(HttpStatus.CREATED).body("Student created successfully.");

        } catch (IllegalStateException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage()); // 409 bei doppelter ID
        }
    }

    //Fehlerbehandlung für das Löschen eines Studenten mit nicht vorhandener ID
    @DeleteMapping(path = "{studentId}")
    public ResponseEntity<String> deleteStudent(@PathVariable("studentId") Long studentId) {

        try {
            studentService.deleteStudent(studentId); //Versucht den Student anhand der ID zu löschen
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Student deleted successfully.");

        } catch (IllegalStateException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()); // 404 wenn die ID nicht existiert
        }
    }

    //Student nach ID finden
    @GetMapping(path = "{studentId}")
    public ResponseEntity<Student> getStudentById(@PathVariable("studentId") Long studentId) {

        Student student = studentService.getStudentById(studentId); //Studenten mit der ID holen
        return ResponseEntity.ok(student);                          //200 bei gefundenem Kurs
    }

    //Daten eines Studenten aktualisieren
    @PutMapping(path = "{studentId}")
    public ResponseEntity<String> updateStudent(@PathVariable("studentId") Long studentId, @RequestBody Student student) {

        try {
            studentService.updateStudent(studentId, student); //Die Daten des Studenten aktualisieren
            return ResponseEntity.status(HttpStatus.OK).body("Student updated successfully.");
        }

        catch (IllegalStateException e) {
            //Fehler HTTP 404 wenn er nicht gefunden wurde
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}


