package de.hsaalen.grademaster.grademasterservice.controller;

import de.hsaalen.grademaster.grademasterservice.domain.Bewertungsschema;
import de.hsaalen.grademaster.grademasterservice.domain.Course;
import de.hsaalen.grademaster.grademasterservice.domain.Group;
import de.hsaalen.grademaster.grademasterservice.domain.Student;
import de.hsaalen.grademaster.grademasterservice.dto.CourseDTO;
import de.hsaalen.grademaster.grademasterservice.dto.StudentDTO;
import de.hsaalen.grademaster.grademasterservice.dto.StudentWithGradeDTO;
import de.hsaalen.grademaster.grademasterservice.service.CourseService;
import de.hsaalen.grademaster.grademasterservice.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController                             //RestController - verarbeitet HTTP-Anfragen
@RequestMapping(path = "api/private/v1/course")    //angeben des Pfads
public class CourseController {

    private final  CourseService  courseService;
    private final GroupService groupService;

    @Autowired
    public CourseController(CourseService courseService, GroupService groupService) {
        this.courseService = courseService;
        this.groupService = groupService;
    }

    /**
     * Holt die Liste aller Kurse aus der Datenbank.
     * @return Eine Liste von CourseDTOs
     */
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

    /**
     * Fügt einen neuen Kus hinzu, mit Fehlerbehandlung für doppelte Namen
     * @param course Das hinzuzufügende Kursobjekt.
     * @return Eine HTTP-Response mit Statuscode.
     */
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

    /**
     * Löscht einen Kurs anhand seiner ID mit Fehlerbehandlung
     * @param courseId Die ID des zu löschenden Kurses
     * @return Eine HTTP-Response mit Statuscode
     */
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


    /**
     * Ruft einen Kurs anhand der ID ab.
     * @param courseId Die ID des Kurses.
     * @return Das gefundene Kursobjekt
     */
    @GetMapping(path = "{courseId}")
    public ResponseEntity<Course> getCourseById(@PathVariable("courseId") Long courseId) {

        Course course = courseService.getCourseById(courseId);  //Kurs mit ID holen
        return ResponseEntity.ok(course);                       //200 bei gefundenem Kurs
    }


    //Aufgabe 03 - Zuweisung

    /**
     * Weist einem Kurs einen Studenten zu.
     * @param courseId Die ID des Kurses.
     * @param studentId Die ID des Studenten.
     * @return Eine HTTP-Response mit Statuscode.
     */
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

    /**
     * Ruft alle Studenten eines bestimmten Kurses ab.
     * @param courseId Die ID des Kurses.
     * @return Eine Liste von Studenten mit Bewertungen.
     */
    @GetMapping("/{courseId}/students")
    public ResponseEntity<List<StudentWithGradeDTO>> getStudentsInCourse(@PathVariable Long courseId) {

        List<Student> students = courseService.getStudentsInCourse(courseId);   //Studenten des Kurses holen
        List<Group> groups = groupService.getGroupsByCourse(courseId);
        List< StudentWithGradeDTO> studentWithGradeDTOS = new ArrayList<>();

        for (Student student : students) {
            Group studentGroup = null;
            String grade = "Noch nicht Bewertet";
            for (Group group : groups) {
                //Gruppe des Studenten zuweisen und dann die schleife abbrechen
                if(group.getStudents().contains(student)) {
                    studentGroup = group;
                    break;
                }
            }

            if(studentGroup != null){
                try {
                    Map<String, Object> evaluationResult = groupService.calculateGroupOverallEvaluation(studentGroup.getId());
                    grade = (String) evaluationResult.get("grade");
                }catch (Exception e){
                    grade = "Noch nicht Bewertet";
                }


            }
            studentWithGradeDTOS.add(new StudentWithGradeDTO(student.getId(), student.getName(), student.getEmail(), grade));

        }
        return ResponseEntity.ok(studentWithGradeDTOS);                                     // Gibt die Liste der Studenten zurück
    }

    /**
     * Aktualisiert die Informationen eines bestehenden Kurses.
     * @param courseId Die ID des Kurses.
     * @param course   Das aktualisierte Kursobjekt.
     * @return HTTP 200 bei Erfolg oder HTTP 404 bei Fehler.
     */
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

    //Aufgabe 15 - Sprint 4
    /**
     * Holt das Bewertungsschema eines bestimmten Kurses.
     * @param courseId Die ID des Kurses.
     * @return Eine Liste von Bewertungsschemata.
     */
    @GetMapping("/{courseId}/bewertungsschema")
    public List<Bewertungsschema> getBewertungsschema(@PathVariable Long courseId) {
        return courseService.getBewertungsschemaForCourse(courseId);
    }


    /**
     * Fügt ein neues Bewertungsschema zu einem Kurs hinzu.
     * @param courseId Die ID des Kurses.
     * @param bewertungsschema  Das neue Bewertungsschema.
     * @return HTTP 201 bei Erfolg.
     */
    @PostMapping("/{courseId}/bewertungsschema")
    public ResponseEntity<String> addBewertungsschema(@PathVariable Long courseId, @RequestBody Bewertungsschema bewertungsschema) {
        courseService.addBewertungsschemaToCourse(courseId, bewertungsschema);
        return ResponseEntity.status(HttpStatus.CREATED).body("Bewertungsschema hinzugefügt.");
    }

    /**
     * Löscht ein Bewertungsschema von einem Kurs.
     * @param courseId Die ID des Kurses.
     * @param bewertungsschemaId Die ID des Bewertungsschemas.
     * @return HTTP 204 bei Erfolg.
     */
    @DeleteMapping("/{courseId}/bewertungsschema/{bewertungsschemaId}")
    public ResponseEntity<String> deleteBewertungsschema(@PathVariable Long courseId, @PathVariable Long bewertungsschemaId) {
        courseService.removeBewertungsschemaFromCourse(courseId, bewertungsschemaId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Bewertungsschema entfernt.");
    }

}