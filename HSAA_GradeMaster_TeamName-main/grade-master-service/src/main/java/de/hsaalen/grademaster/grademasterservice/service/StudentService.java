package de.hsaalen.grademaster.grademasterservice.service;

import de.hsaalen.grademaster.grademasterservice.domain.Course;
import de.hsaalen.grademaster.grademasterservice.domain.Student;
import de.hsaalen.grademaster.grademasterservice.dto.StudentDTO;
import de.hsaalen.grademaster.grademasterservice.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final GroupService groupService;
    private final CourseService courseService;

    private final WebClient webClient;

    @Autowired
    public StudentService(StudentRepository studentRepository, GroupService groupService, CourseService courseService) {
        this.studentRepository = studentRepository;
        this.groupService = groupService;
        this.courseService = courseService;
        this.webClient = WebClient.builder().baseUrl("https://hsaa-student-service.azurewebsites.net/api/v1/students")
                .defaultHeader("Api-Key", "63492993-4d04-4bf1-b991-0e92339e7c90")
                .build();
    }

    public StudentDTO getStudentData(String studentId) {
        boolean exits =  studentRepository.existsById(Long.valueOf(studentId));
        if (exits) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student sxists");
        }

        return webClient.get()
                .uri(uriBuilder -> uriBuilder.queryParam("matriculationNumber", studentId).build())
                .retrieve()
                .bodyToMono(StudentDTO.class)
                .block();
    }

    //Methode, um alle Studenten aus der DB zu holen
    public List<Student> getStudents() {
        return studentRepository.findAll();
    }

    //Methode, um einen neuen Studenten hinzuzufügen, mit Fehlerbehandlung für doppelte ID
    public void addNewStudent(Student student) {
        Optional<Student> studentOptional = studentRepository.findStudentById(student.getId());     //Überprüft, ob ein Student mit derselben
        if(studentOptional.isPresent()) {                                                           //ID schon existiert
            throw new ResponseStatusException (
                    HttpStatus.CONFLICT, "Student with ID " + student.getId() + " already exists"); //Wenn ja, dann Fehler
        }
        studentRepository.save(student);                                                            //Wenn nein, dann speichern in der DB

    }

    //Methode, um einen Studenten anhand der ID zu Löschen
    public void deleteStudent(Long studentId) {
        boolean exists = studentRepository.existsById(studentId);                                   //Überprüft, ob ein Student mit derselben
        if(!exists) {                                                                               //ID schon existiert
            throw new IllegalStateException("student with id " + studentId + " does not exist");     //Wenn nein, dann Fehler
        }
        //Variable exits ist True
        else {
            //Liste der Kurse des Studenten Kopieren
            List<Course> courseList =new ArrayList<>(studentRepository.findStudentById(studentId).get().getCourses());
            //Wenn die Liste der Kurse in courseList nicht leer ist
            if (!courseList.isEmpty()) {
                for (Course course : courseList) {
                    //Student aus dem Kurs entfernen
                    courseService.deleteStudent(course.getId(), studentId);
                }
            }
            //löschen aus der DB
            studentRepository.deleteById(studentId);
        }
    }

    //Methode, um Studenten anhand ID zu suchen, und wenn nicht vorhanden Fehlermeldung
    public Student getStudentById(Long studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student with ID " + studentId + " not found"));      //Fehler, wenn ID nicht existiert
    }

    public void updateStudent(Long studentId, Student student) {
        //Überprüfen ob der student mit der ID schon existiert
        boolean exists = studentRepository.existsById(studentId);
        //Falls er nicht existiert fehler
        if (!exists) {
            throw new IllegalStateException("student with id" + studentId + " does not exist");
        }
        //Wenn der Student existiert wird er aktualisiert in der DB gespeichert
        studentRepository.save(student);
    }
}
