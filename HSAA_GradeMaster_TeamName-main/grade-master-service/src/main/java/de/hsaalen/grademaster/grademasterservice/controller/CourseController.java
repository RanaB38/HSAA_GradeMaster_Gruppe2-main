package de.hsaalen.grademaster.grademasterservice.controller;

import de.hsaalen.grademaster.grademasterservice.domain.Course;
import de.hsaalen.grademaster.grademasterservice.domain.Group;
import de.hsaalen.grademaster.grademasterservice.domain.Student;
import de.hsaalen.grademaster.grademasterservice.dto.CourseDTO;
import de.hsaalen.grademaster.grademasterservice.dto.StudentDTO;
import de.hsaalen.grademaster.grademasterservice.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestController                             //RestController - verarbeitet HTTP-Anfragen
@RequestMapping(path = "api/private/v1/course")    //angeben des Pfads
public class CourseController {

    private final  CourseService  courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    //Liste aller Kurse aus der DB
    @GetMapping
    public List<CourseDTO> getCourse() {

        List<Course> courses = courseService.getCourses();  //Alle kurse holen in die Liste
        List<CourseDTO> coursesDTO = new ArrayList<>();     //Leere Liste für CourseDTO

        //Liste der Kurse in Liste von CourseDTO übergeben
        for (Course course : courses) {

            List<StudentDTO> studentsDTO = new ArrayList<>(); //Leere liste für StudentenDTO um die Studenten zu übergeben

            //Studenten in die Liste von StudentDTO übergeben
            for (Student student : course.getStudents()) {

                StudentDTO studentDTO = new StudentDTO(student.getId(), student.getName(),student.getEmail());
                studentsDTO.add(studentDTO);
            }

            CourseDTO courseDTO = new CourseDTO(course.getId(), course.getName(), course.getDescription(), studentsDTO);
            coursesDTO.add(courseDTO);
        }
        //Liste der Kurse mit einem HTTP 200 zurückgeben
        return ResponseEntity.ok(coursesDTO).getBody();
    }


    //Fehlerbehandlung für das Hinzufügen eines neuen Kurses mit doppeltem Namen
    @PostMapping
    public ResponseEntity<String> registerNewCourse(@RequestBody Course course) {
        // Überprüfen auf leere Felder, damit Name  vorhanden ist
        if (course.getName() == null || course.getName().isEmpty()) {
            //Wenn der Name fehlt HTTP 400 zurückgeben
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Name is required and cannot be empty.");
        }

        try {
            courseService.addNewCourse(course);       //Versucht den neuen Kurs hinzuzufügen
            return ResponseEntity.status(HttpStatus.CREATED).body("Course created successfully.");
        }

        catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage()); // 409 bei doppeltem Name
        }
    }

    //Fehlerbehandlung für das Löschen eines Kurses mit nicht vorhandener Id
    @DeleteMapping(path = "{courseId}")
    public ResponseEntity<String> deleteCourse(@PathVariable("courseId") Long courseId) {

        try {
            courseService.deleteCourse(courseId);       //Versucht den Kurs anhand der Id zu löschen
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Course deleted successfully.");
        }
        catch (IllegalStateException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()); // 404 wenn die Id nicht existiert
        }
    }


    //Kurs nach ID finden
    @GetMapping(path = "{courseId}")
    public ResponseEntity<Course> getCourseById(@PathVariable("courseId") Long courseId) {

        Course course = courseService.getCourseById(courseId);  //Kurs mit ID holen
        return ResponseEntity.ok(course);                       //200 bei gefundenem Kurs
    }


    //Aufgabe 03 - Zuweisung

    // POST-Endpunkt, um einen Studenten zu einem Kurs hinzuzufügen
    @PostMapping("/{courseId}/student/{studentId}")
    public ResponseEntity<String> assignStudentToCourse(@PathVariable Long courseId, @PathVariable Long studentId) {
        try {
            //Studenten dem Kurs hinzufügen
            courseService.assignStudent(courseId, studentId);
            return ResponseEntity.status(HttpStatus.CREATED).body("Student assigned successfully.");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason()); // 409 wenn doppelt
        }
    }

    // GET-Endpunkt, um alle Studenten eines bestimmten Kurses zu erhalten
    @GetMapping("/{courseId}/students")
    public ResponseEntity<List<Student>> getStudentsInCourse(@PathVariable Long courseId) {

        List<Student> students = courseService.getStudentsInCourse(courseId);   //Studenten des Kurses holen
        return ResponseEntity.ok(students);                                     // Gibt die Liste der Studenten zurück
    }

    @PutMapping(path = "{courseId}")
    public ResponseEntity<String> updateCourse(@PathVariable("courseId") Long courseId, @RequestBody Course course) {
        try {
            //Kurs aktualisieren
            courseService.updateCourse(courseId, course);
            return ResponseEntity.status(HttpStatus.OK).body("Course updated successfully.");
        }
        catch (IllegalStateException e) {
            //Bei fehler HTTP 404 zurückgeben
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
