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
import java.util.Objects;

@RestController
@RequestMapping(path = "api/private/v1/student")
public class StudentController {

    private final StudentService studentService;

    /**
     * Konstruktor für den StudentController.
     * @param studentService Der Service, der für die Logik der Studenten verantwortlich ist.
     */
    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    /**
     * Ruft die Daten eines bestimmten Studenten anhand seiner ID ab.
     * @param studentId Die ID des Studenten.
     * @return Die StudentDTO mit den entsprechenden Daten des Studenten.
     */
    @GetMapping(path = "/data/{studentId}")
    public ResponseEntity<StudentDTO> getStudentData(@PathVariable ("studentId") String studentId) {

        return ResponseEntity.ok(studentService.getStudentData(String.valueOf(studentId)));
    }


    /**
     * Ruft eine Liste aller Studenten ab.
     * @return Eine Liste von StudentDTOs mit den grundlegenden Informationen der Studenten.
     */
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


    /**
     * Registriert einen neuen Studenten.
     * Überprüft, ob alle erforderlichen Felder ausgefüllt sind und behandelt Fehler wie doppelte IDs.
     * @param student Die zu registrierenden Studentendaten.
     * @return Eine ResponseEntity mit dem Status-Code und einer Nachricht.
     */
    @PostMapping
    public ResponseEntity<Object> registerNewStudent(@RequestBody Student student) {
        // Überprüfen auf leere Felder, damit Name und Email vorhanden sind
        if (student.getId() == null || student.getId().describeConstable().isEmpty() ||
                student.getName() == null || student.getName().isEmpty() ||
                student.getEmail() == null || student.getEmail().isEmpty()) {

            //HTTP 400 zurückgeben wenn was fehlt
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Name and email are required and cannot be empty.");
        }
        StudentDTO studentDTO = new StudentDTO(student.getId(), student.getName(), student.getEmail());
        try {
            //Versucht den neuen Student hinzuzufügen
            studentService.addNewStudent(student);
            return ResponseEntity.status(HttpStatus.CREATED).body(studentDTO);

        } catch (IllegalStateException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage()); // 409 bei doppelter ID
        }
    }

    /**
     * Löscht einen Studenten anhand seiner ID.
     * @param studentId Die ID des zu löschenden Studenten.
     * @return Eine ResponseEntity mit dem Status-Code und einer Nachricht.
     */
    @DeleteMapping(path = "{studentId}")
    public ResponseEntity<String> deleteStudent(@PathVariable("studentId") Long studentId) {

        try {
            studentService.deleteStudent(studentId); //Versucht den Student anhand der ID zu löschen
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Student deleted successfully.");

        } catch (IllegalStateException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()); // 404 wenn die ID nicht existiert
        }
    }

    /**
     * Ruft einen Studenten anhand seiner ID ab.
     * @param studentId Die ID des Studenten.
     * @return Die Student-Objekt als ResponseEntity.
     */
    @GetMapping(path = "{studentId}")
    public ResponseEntity<Student> getStudentById(@PathVariable("studentId") Long studentId) {

        Student student = studentService.getStudentById(studentId); //Studenten mit der ID holen
        return ResponseEntity.ok(student);                          //200 bei gefundenem Kurs
    }

    /**
     * Aktualisiert die Daten eines bestehenden Studenten.
     * @param studentId Die ID des zu aktualisierenden Studenten.
     * @param student   Die neuen Studentendaten.
     * @return Eine ResponseEntity mit dem Status-Code und einer Nachricht.
     */
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