package de.hsaalen.grademaster.grademasterservice.service;

import de.hsaalen.grademaster.grademasterservice.domain.Bewertungsschema;
import de.hsaalen.grademaster.grademasterservice.domain.Course;
import de.hsaalen.grademaster.grademasterservice.domain.Group;
import de.hsaalen.grademaster.grademasterservice.domain.Student;
import de.hsaalen.grademaster.grademasterservice.repository.CourseRepository;
import de.hsaalen.grademaster.grademasterservice.repository.GroupRepository;
import de.hsaalen.grademaster.grademasterservice.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final GroupRepository groupRepository;

    @Autowired
    public CourseService(CourseRepository courseRepository, StudentRepository studentRepository, GroupRepository groupRepository) {
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
        this.groupRepository = groupRepository;
    }

    //Methode, um alle Kurse aus der DB zu holen
    public List<Course> getCourses() {
        return courseRepository.findAll();
    }

    //Methode, um einen neuen Kurs hinzuzufügen, mit Fehlerbehandlung für doppelten Namen
    public void addNewCourse(Course course) {
        Optional<Course> courseOptional = courseRepository.findCourseByName(course.getName());          //Überprüft, ob ein Kurs mit demselben
        if(courseOptional.isPresent()) {                                                                //Namen schon existiert
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Course with Name " + course.getName() + " already exists");   //Wenn ja, dann Fehler
        }
        courseRepository.save(course);                                                                  //Wenn nein, dann speichern in der DB

    }

    //Methode, um einen Kurs anhand der Id zu Löschen
    public void deleteCourse(Long courseId) {
        boolean exists = courseRepository.existsById(courseId);
        if(!exists) {                                                                           //Überprüft, ob ein Kurs mit demselben
            throw new IllegalStateException("Course with Id " + courseId + " does not exist");  //Namen schon existiert
        }                                                                                       //Wenn nein, dann Fehler
        //Wenn der Kurs existiert
        else {
            //Gruppen des Kurses holen und löschen bevor der Kurs gelöscht wird
            List<Group> courseGroupList = groupRepository.findByCourseId(courseId);
            for(Group group : courseGroupList) {
                groupRepository.deleteById(group.getId());
            }
            courseRepository.deleteById(courseId);                                               //dann löschen aus der DB
        }
    }

    //Methode, um Kurse anhand ID zu suchen, und wenn nicht vorhanden Fehlermeldung
    public Course getCourseById(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Course with ID " + courseId + " not found"));    //Fehler, wenn ID nicht existiert
    }

    // Methode zur Zuweisung eines Studenten zu einem Kurs
    public void assignStudent(Long courseId, Long studentId) {
        //Kurs mit der ID finden und übergeben, wenn der Kurs nicht gefunden wurde fehler
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found."));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found."));

        // Prüfen, ob der Student bereits im Kurs ist
        if (course.getStudents().contains(student)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Student is already assigned in this course.");  //409, wenn ja
        }

        course.addStudent(student);     // Student hinzufügen, wenn noch nicht vorhanden
        courseRepository.save(course);  // Kurs mit aktualisierter Studentenliste speichern
    }

    // Methode, um alle Studenten eines Kurses abzurufen
    public List<Student> getStudentsInCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found."));   //404
        return course.getStudents();                                      // Gibt alle Studenten des Kurses zurück
    }

    public void updateCourse(Long courseId, Course course) {
        boolean exists = courseRepository.existsById(courseId);
        if (!exists) {
            throw new IllegalStateException("CourseID" + courseId + " does not exist");
        }
        // ID setzen damit kein neuer Kurs erstellt wird
        course.setId(courseId);
        courseRepository.save(course);
    }

    //Sprint 3 - Aufgabe 11
    // Studenten in einen Kurs einschreiben
    public void enrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found."));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found."));
        course.addStudent(student); // Bidirektionale Zuordnung
        courseRepository.save(course);
    }

    //einen Studenten mit der ID aus dem Kurs entfernen
    public void deleteStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found."));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found."));
        List<Group> courseGroupList = groupRepository.findByCourseId(courseId);                     //Gruppen des Kurses
        //Mit einer Schleife Studenten aus der Gruppe entfernen falls er in einer ist
        for (Group group : courseGroupList) {
            if (group.getStudents().contains(student)) {
                group.getStudents().remove(student);
            }
        }
        course.removeStudent(student);
        courseRepository.save(course);
    }

    //Aufgabe 15 - Sprint 4
    public List<Bewertungsschema> getBewertungsschemaForCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found."));
        return course.getBewertungsschemas();
    }

    public void addBewertungsschemaToCourse(Long courseId, Bewertungsschema bewertungsschema) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found."));
        course.addBewertungsschema(bewertungsschema);
        courseRepository.save(course);
    }

    public void removeBewertungsschemaFromCourse(Long courseId, Long bewertungsschemaId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found."));
        Bewertungsschema bewertungsschema = course.getBewertungsschemas().stream()
                .filter(b -> b.getId().equals(bewertungsschemaId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Bewertungsschema not found."));
        course.removeBewertungsschema(bewertungsschema);
        courseRepository.save(course);
    }

    //Aufgabe 16 -Sprint 4
    // Methode zur Bearbeitung des Bewertungsschemas
    public void updateBewertungsschema(Long courseId, List<Bewertungsschema> bewertungsschemaList) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        // Summe muss 100% betragen
        int totalPercentage = bewertungsschemaList.stream().mapToInt(Bewertungsschema::getPercentage).sum();
        if (totalPercentage != 100) {
            throw new IllegalArgumentException("Die Gesamtgewichtung muss genau 100% betragen.");
        }

        // Topics müssen eindeutig sein
        long uniqueTopics = bewertungsschemaList.stream()
                .map(Bewertungsschema::getTopic)
                .distinct()
                .count();
        if (uniqueTopics != bewertungsschemaList.size()) {
            throw new IllegalArgumentException("Alle Topics müssen eindeutig sein.");
        }

        // Aktualisieren des Schemas
        course.getBewertungsschemas().clear();
        for (Bewertungsschema schema : bewertungsschemaList) {
            course.addBewertungsschema(schema);
        }

        courseRepository.save(course);
    }
}
