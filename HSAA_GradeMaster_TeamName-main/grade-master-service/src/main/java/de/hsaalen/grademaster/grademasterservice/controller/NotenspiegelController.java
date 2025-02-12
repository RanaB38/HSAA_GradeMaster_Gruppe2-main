package de.hsaalen.grademaster.grademasterservice.controller;

import de.hsaalen.grademaster.grademasterservice.domain.Notenspiegel;
import de.hsaalen.grademaster.grademasterservice.service.NotenspiegelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/public/v1/notenspiegel")
public class NotenspiegelController {
    private final NotenspiegelService notenspiegelService;

    /**
     * Konstruktor für den NotenspiegelController.
     * @param notenspiegelService Der Service, der für die Logik des Notenspiegels verantwortlich ist.
     */
    @Autowired
    public NotenspiegelController(NotenspiegelService notenspiegelService) {
        this.notenspiegelService = notenspiegelService;
    }

    /**
     * Ruft alle Notenspiegel-Daten ab.
     * @return Eine Liste von Notenspiegel-Objekten.
     * @throws ResponseStatusException Wenn keine Notenspiegel-Daten vorhanden sind, wird ein Fehler 204 (No Content) zurückgegeben.
     */
    @GetMapping
    public List<Notenspiegel> getNotenspiegel() {
        List<Notenspiegel> notenspiegelList = notenspiegelService.getAllNotenspiegel();
        if (notenspiegelList == null || notenspiegelList.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "No data available");
        }
        return notenspiegelList;
    }

    /**
     * Initialisiert den Notenspiegel mit den Standarddaten.
     * Diese Methode wird aufgerufen, um den Notenspiegel zu initialisieren.
     */
    @PostMapping("/initialize")
    public void initializeNotenspiegel() {
        notenspiegelService.initializeNotenspiegel();
    }
}