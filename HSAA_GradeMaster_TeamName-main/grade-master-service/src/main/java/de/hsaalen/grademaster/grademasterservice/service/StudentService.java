package de.hsaalen.grademaster.grademasterservice.service;

import de.hsaalen.grademaster.grademasterservice.domain.Student;
import de.hsaalen.grademaster.grademasterservice.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
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

    //Methode, um einen Kurs anhand der ID zu Löschen
    public void deleteStudent(Long studentId) {
        boolean exists = studentRepository.existsById(studentId);                                   //Überprüft, ob ein Student mit derselben
        if(!exists) {                                                                               //ID schon existiert
            throw new IllegalStateException("student with id" + studentId + " does not exist");     //Wenn nein, dann Fehler
        }
        studentRepository.deleteById(studentId);                                                    //Wenn ja, dann löschen aus der DB
    }

    //Methode, um Studenten anhand ID zu suchen, und wenn nicht vorhanden Fehlermeldung
    public Student getStudentById(Long studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Student with ID " + studentId + " not found"));      //Fehler, wenn ID nicht existiert
    }
}
