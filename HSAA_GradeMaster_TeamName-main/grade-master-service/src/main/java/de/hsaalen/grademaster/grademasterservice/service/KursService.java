package de.hsaalen.grademaster.grademasterservice.service;

import de.hsaalen.grademaster.grademasterservice.domain.Kurs;
import de.hsaalen.grademaster.grademasterservice.domain.Student;
import de.hsaalen.grademaster.grademasterservice.repository.KursRepository;
import de.hsaalen.grademaster.grademasterservice.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class KursService {

    private final KursRepository kursRepository;
    private final StudentRepository studentRepository;          //für die Aufgabe 03

    @Autowired
    public KursService(KursRepository kursRepository, StudentRepository studentRepository) {
        this.kursRepository = kursRepository;
        this.studentRepository = studentRepository;             //für die Aufgabe 03
    }

    //Methode, um alle Kurse aus der DB zu holen
    public List<Kurs> getKurse() {
        return kursRepository.findAll();
    }

    //Methode, um einen neuen Kurs hinzuzufügen, mit Fehlerbehandlung für doppelten Namen
    public void addNewKurs(Kurs kurs) {
        Optional<Kurs> kursOptional = kursRepository.findKursByName(kurs.getName());                //Überprüft, ob ein Kurs mit demselben
        if(kursOptional.isPresent()) {                                                              //Namen schon existiert
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Kurs with Name " + kurs.getName() + " already exists");   //Wenn ja, dann Fehler
        }
        kursRepository.save(kurs);                                                                  //Wenn nein, dann speichern in der DB

    }

    //Methode, um einen Kurs anhand der Id zu Löschen
    public void deleteKurs(Long kursId) {
        boolean exists = kursRepository.existsById(kursId);
        if(!exists) {                                                                           //Überprüft, ob ein Kurs mit demselben
            throw new IllegalStateException("Kurs with Id " + kursId + " does not exist");  //Namen schon existiert
        }                                                                                       //Wenn nein, dann Fehler
        kursRepository.deleteById(kursId);                                                  //Wenn ja, dann löschen aus der DB
    }

    //Methode, um Kurse anhand ID zu suchen, und wenn nicht vorhanden Fehlermeldung
    public Kurs getKursById(Long kursId) {
        return kursRepository.findById(kursId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Kurs with ID " + kursId + " not found"));       //Fehler, wenn ID nicht existiert
    }


    //Aufgabe 03 - Zuweisung

    // Methode zur Zuweisung eines Studenten zu einem Kurs
    public void assignStudent(Long kursId, Long studentId) {
        Kurs kurs = kursRepository.findById(kursId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kurs not found."));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found."));

        // Prüfen, ob der Student bereits im Kurs ist
        if (kurs.getStudents().contains(student)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Student is already assigned in this course.");  //409, wenn ja
        }

        kurs.addStudent(student);                                       // Student hinzufügen, wenn noch nicht vorhanden
        kursRepository.save(kurs);                                      // Kurs mit aktualisierter Studentenliste speichern
    }

    // Methode, um alle Studenten eines Kurses abzurufen
    public List<Student> getStudentsInKurs(Long kursId) {
        Kurs kurs = kursRepository.findById(kursId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kurs not found."));   //404
        return kurs.getStudents();                                      // Gibt alle Studenten des Kurses zurück
    }

    public void updateKurs(Long kursId, Kurs kurs) {
        boolean exists = kursRepository.existsById(kursId);
        if (!exists) {
            throw new IllegalStateException("Kursid" + kursId + " does not exist");
        }
        // ID setzen damit kein neuer Kurs erstellt wird
        kurs.setId(kursId);
        kursRepository.save(kurs);
    }
}
