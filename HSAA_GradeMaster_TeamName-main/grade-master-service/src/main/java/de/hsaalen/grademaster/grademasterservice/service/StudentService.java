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
import java.util.Map;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final GroupService groupService;
    private final CourseService courseService;

    private final WebClient webClient;

    private static final Map<String, Student> STUDENTS = Map.ofEntries(
            Map.entry("10000", new Student("10000", "Ethan Baker", "ethan.baker@example.com")),
            Map.entry("10001", new Student("10001", "Sophia Carter", "sophia.carter@example.com")),
            Map.entry("10002", new Student("10002", "Liam Scott", "liam.scott@example.com")),
            Map.entry("10003", new Student("10003", "Olivia Turner", "olivia.turner@example.com")),
            Map.entry("10004", new Student("10004", "Noah Parker", "noah.parker@example.com")),
            Map.entry("10005", new Student("10005", "Ava Collins", "ava.collins@example.com")),
            Map.entry("10006", new Student("10006", "Mason Ramirez", "mason.ramirez@example.com")),
            Map.entry("10007", new Student("10007", "Isabella Gray", "isabella.gray@example.com")),
            Map.entry("10008", new Student("10008", "Lucas Bennett", "lucas.bennett@example.com")),
            Map.entry("10009", new Student("10009", "Mia Brooks", "mia.brooks@example.com")),
            Map.entry("10010", new Student("10010", "Elijah Reed", "elijah.reed@example.com")),
            Map.entry("10011", new Student("10011", "Charlotte Ross", "charlotte.ross@example.com")),
            Map.entry("10012", new Student("10012", "James Peterson", "james.peterson@example.com")),
            Map.entry("10013", new Student("10013", "Amelia Cooper", "amelia.cooper@example.com")),
            Map.entry("10014", new Student("10014", "Benjamin Morgan", "benjamin.morgan@example.com")),
            Map.entry("10015", new Student("10015", "Harper Sanders", "harper.sanders@example.com")),
            Map.entry("10016", new Student("10016", "Alexander Kelly", "alexander.kelly@example.com")),
            Map.entry("10017", new Student("10017", "Evelyn Foster", "evelyn.foster@example.com")),
            Map.entry("10018", new Student("10018", "William Adams", "william.adams@example.com")),
            Map.entry("10019", new Student("10019", "Abigail Bailey", "abigail.bailey@example.com")),
            Map.entry("10020", new Student("10020", "Henry Martinez", "henry.martinez@example.com")),
            Map.entry("10021", new Student("10021", "Emily James", "emily.james@example.com")),
            Map.entry("10022", new Student("10022", "Sebastian Howard", "sebastian.howard@example.com")),
            Map.entry("10023", new Student("10023", "Ella Ward", "ella.ward@example.com")),
            Map.entry("10024", new Student("10024", "Jack King", "jack.king@example.com")),
            Map.entry("10025", new Student("10025", "Scarlett Green", "scarlett.green@example.com")),
            Map.entry("10026", new Student("10026", "Daniel White", "daniel.white@example.com")),
            Map.entry("10027", new Student("10027", "Grace Hall", "grace.hall@example.com")),
            Map.entry("10028", new Student("10028", "Logan Allen", "logan.allen@example.com")),
            Map.entry("10029", new Student("10029", "Chloe Young", "chloe.young@example.com")),
            Map.entry("10030", new Student("10030", "Jackson Rivera", "jackson.rivera@example.com")),
            Map.entry("10031", new Student("10031", "Victoria Cox", "victoria.cox@example.com")),
            Map.entry("10032", new Student("10032", "Samuel Diaz", "samuel.diaz@example.com")),
            Map.entry("10033", new Student("10033", "Hannah Simmons", "hannah.simmons@example.com")),
            Map.entry("10034", new Student("10034", "Joseph Myers", "joseph.myers@example.com")),
            Map.entry("10035", new Student("10035", "Lily Perry", "lily.perry@example.com")),
            Map.entry("10036", new Student("10036", "Matthew Edwards", "matthew.edwards@example.com")),
            Map.entry("10037", new Student("10037", "Zoe Murphy", "zoe.murphy@example.com")),
            Map.entry("10038", new Student("10038", "Aiden Clark", "aiden.clark@example.com")),
            Map.entry("10039", new Student("10039", "Layla Brooks", "layla.brooks@example.com")),
            Map.entry("10040", new Student("10040", "David Mitchell", "david.mitchell@example.com")),
            Map.entry("10041", new Student("10041", "Penelope Bell", "penelope.bell@example.com")),
            Map.entry("10042", new Student("10042", "Andrew Moore", "andrew.moore@example.com")),
            Map.entry("10043", new Student("10043", "Madison Cook", "madison.cook@example.com")),
            Map.entry("10044", new Student("10044", "Gabriel Rogers", "gabriel.rogers@example.com")),
            Map.entry("10045", new Student("10045", "Aria Ramirez", "aria.ramirez@example.com")),
            Map.entry("10046", new Student("10046", "Anthony Torres", "anthony.torres@example.com")),
            Map.entry("10047", new Student("10047", "Sofia Sanders", "sofia.sanders@example.com")),
            Map.entry("10048", new Student("10048", "Joshua Jenkins", "joshua.jenkins@example.com")),
            Map.entry("10049", new Student("10049", "Elizabeth Hughes", "elizabeth.hughes@example.com")),
            Map.entry("10050", new Student("10050", "Ryan Coleman", "ryan.coleman@example.com"))
    );

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
        try {
            return webClient.get()
                    .uri(uriBuilder -> uriBuilder.queryParam("matriculationNumber", studentId).build())
                    .retrieve()
                    .bodyToMono(StudentDTO.class)
                    .block();
        }catch (Exception e) {
           Student student =  STUDENTS.get(studentId);
           return new StudentDTO (student.getId(), student.getName(), student.getEmail());

        }

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
