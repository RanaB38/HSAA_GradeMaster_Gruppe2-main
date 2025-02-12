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

    /**
     * Konstruktor für den `CourseService`, der die notwendigen Repositories injiziert.
     * @param courseRepository Das Repository für die Kurse.
     * @param studentRepository Das Repository für die Studenten.
     * @param groupRepository Das Repository für die Gruppen.
     */
    @Autowired
    public CourseService(CourseRepository courseRepository, StudentRepository studentRepository, GroupRepository groupRepository) {
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
        this.groupRepository = groupRepository;
    }

    /**
     * Holt alle Kurse aus der Datenbank.
     * @return Eine Liste aller Kurse.
     */
    public List<Course> getCourses() {
        return courseRepository.findAll();
    }

    /**
     * Fügt einen neuen Kurs hinzu.
     * Überprüft, ob der Kursname bereits existiert, um Konflikte zu vermeiden.
     * @param course Der Kurs, der hinzugefügt werden soll.
     */
    public void addNewCourse(Course course) {
        Optional<Course> courseOptional = courseRepository.findCourseByName(course.getName());          //Überprüft, ob ein Kurs mit demselben
        if(courseOptional.isPresent()) {                                                                //Namen schon existiert
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Course with Name " + course.getName() + " already exists");   //Wenn ja, dann Fehler
        }
        courseRepository.save(course);                                                                  //Wenn nein, dann speichern in der DB

    }

    /**
     * Löscht einen Kurs anhand seiner ID.
     * Prüft zuerst, ob der Kurs existiert. Wenn der Kurs existiert, werden auch die zugehörigen Gruppen gelöscht.
     * @param courseId Die ID des Kurses, der gelöscht werden soll.
     */
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

    /**
     * Sucht einen Kurs anhand der ID.
     * Wenn der Kurs nicht gefunden wird, wird eine Fehlermeldung geworfen.
     * @param courseId Die ID des Kurses.
     * @return Der gefundene Kurs.
     */
    public Course getCourseById(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Course with ID " + courseId + " not found"));    //Fehler, wenn ID nicht existiert
    }

    /**
     * Weist einen Studenten einem Kurs zu.
     * Überprüft, ob der Kurs und der Student existieren und ob der Student bereits im Kurs ist.
     * @param courseId Die ID des Kurses.
     * @param studentId Die ID des Studenten.
     */
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

    /**
     * Holt alle Studenten eines Kurses anhand der Kurs-ID.
     * @param courseId Die ID des Kurses.
     * @return Eine Liste der Studenten, die dem Kurs zugewiesen sind.
     */
    public List<Student> getStudentsInCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found."));   //404
        return course.getStudents();                                      // Gibt alle Studenten des Kurses zurück
    }

    /**
     * Aktualisiert die Informationen eines Kurses.
     * Überprüft, ob der Kurs existiert, und speichert dann die Änderungen.
     * @param courseId Die ID des zu aktualisierenden Kurses.
     * @param course Der Kurs mit den neuen Daten.
     */
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
    /**
     * Meldet einen Studenten in einem Kurs an.
     * @param courseId Die ID des Kurses.
     * @param studentId Die ID des Studenten.
     */
    public void enrollStudent(Long courseId, Long studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found."));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found."));
        course.addStudent(student); // Bidirektionale Zuordnung
        courseRepository.save(course);
    }

    /**
     * Entfernt einen Studenten aus einem Kurs.
     * Entfernt den Studenten aus allen zugehörigen Gruppen und dem Kurs.
     * @param courseId Die ID des Kurses.
     * @param studentId Die ID des Studenten.
     */
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
    /**
     * Holt das Bewertungsschema für einen Kurs.
     * @param courseId Die ID des Kurses.
     * @return Das Bewertungsschema des Kurses.
     */
    public List<Bewertungsschema> getBewertungsschemaForCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found."));
        return course.getBewertungsschemas();
    }

    /**
     * Fügt ein Bewertungsschema zu einem Kurs hinzu.
     * @param courseId Die ID des Kurses.
     * @param bewertungsschema Das Bewertungsschema, das hinzugefügt werden soll.
     */
    public void addBewertungsschemaToCourse(Long courseId, Bewertungsschema bewertungsschema) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found."));
        course.addBewertungsschema(bewertungsschema);
        courseRepository.save(course);
    }

    /**
     * Entfernt ein Bewertungsschema aus einem Kurs.
     * @param courseId Die ID des Kurses.
     * @param bewertungsschemaId Die ID des Bewertungsschemas, das entfernt werden soll.
     */
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
    /**
     * Aktualisiert das Bewertungsschema eines Kurses.
     * Überprüft, ob die Summe der Prozente 100% beträgt und ob die Themen eindeutig sind.
     * @param courseId Die ID des Kurses.
     * @param bewertungsschemaList Die Liste der neuen Bewertungsschemas.
     */
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
