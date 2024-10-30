package de.hsaalen.grademaster.grademasterservice.controller;

import de.hsaalen.grademaster.grademasterservice.domain.Kurs;
import de.hsaalen.grademaster.grademasterservice.domain.Student;
import de.hsaalen.grademaster.grademasterservice.service.KursService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController                             //RestController - verarbeitet HTTP-Anfragen
@RequestMapping(path = "api/v1/kurs")    //angeben des Pfads
public class KursController {

    private final KursService kursService;

    @Autowired
    public KursController(KursService kursService) {
        this.kursService = kursService;
    }

    //Liste aller Kurse aus der DB
    @GetMapping
    public List<Kurs> getKurse() {
        return kursService.getKurse();
    }


    //Fehlerbehandlung für das Hinzufügen eines neuen Kurses mit doppeltem Namen
    @PostMapping
    public ResponseEntity<String> registerNewKurs(@RequestBody Kurs kurs) {
        // Überprüfen auf leere Felder, damit Name und Description vorhanden sind
        if (kurs.getName() == null || kurs.getName().isEmpty() ||
                kurs.getDescription() == null || kurs.getDescription().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Name and description are required and cannot be empty.");
        }

        try {
            kursService.addNewKurs(kurs);       //Versucht den neuen Kurs hinzuzufügen
            return ResponseEntity.status(HttpStatus.CREATED).body("Kurs created successfully.");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage()); // 409 bei doppeltem Name
        }
    }

    //Fehlerbehandlung für das Löschen eines Kurses mit nicht vorhandenem Namen
    @DeleteMapping(path = "{kursName}")
    public ResponseEntity<String> deleteKurs(@PathVariable("kursName") String kursName) {
        try {
            kursService.deleteKurs(kursName);       //Versucht den Kurs anhand des Namens zu löschen
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Kurs deleted successfully.");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage()); // 404 wenn der Name nicht existiert
        }
    }

    //Kurs nach ID finden
    @GetMapping(path = "{kursId}")
    public ResponseEntity<Kurs> getKursById(@PathVariable("kursId") Long kursId) {
        Kurs kurs = kursService.getKursById(kursId);
        return ResponseEntity.ok(kurs);     //200 bei gefundenem Kurs
    }


    //Aufgabe 03 - Zuweisung

    // POST-Endpunkt, um einen Studenten zu einem Kurs hinzuzufügen
    @PostMapping("/{kursId}/assign/{studentId}")
    public ResponseEntity<String> assignStudentToKurs(@PathVariable Long kursId, @PathVariable Long studentId) {
        try {
            kursService.assignStudent(kursId, studentId);
            return ResponseEntity.status(HttpStatus.CREATED).body("Student assigned successfully.");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());            // 409 wenn doppelt
        }
    }

    // GET-Endpunkt, um alle Studenten eines bestimmten Kurses zu erhalten
    @GetMapping("/{kursId}/students")
    public ResponseEntity<List<Student>> getStudentsInKurs(@PathVariable Long kursId) {
        List<Student> students = kursService.getStudentsInKurs(kursId);
        return ResponseEntity.ok(students);                                                 // Gibt die Liste der Studenten zurück
    }

}
