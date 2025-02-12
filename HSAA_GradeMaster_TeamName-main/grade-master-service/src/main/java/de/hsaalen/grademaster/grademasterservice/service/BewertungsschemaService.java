package de.hsaalen.grademaster.grademasterservice.service;

import de.hsaalen.grademaster.grademasterservice.domain.Bewertungsschema;
import de.hsaalen.grademaster.grademasterservice.domain.Course;
import de.hsaalen.grademaster.grademasterservice.repository.BewertungsschemaRepository;
import de.hsaalen.grademaster.grademasterservice.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Der `BewertungsschemaService` verwaltet die Bewertungsschemas und deren Interaktionen mit den Kursen.
 * Dieser Service ermöglicht das Abrufen, Initialisieren, Aktualisieren und Löschen von Bewertungsschemas.
 */
@Service
public class BewertungsschemaService {
    private final BewertungsschemaRepository bewertungsschemaRepository;
    private final CourseRepository courseRepository;

    /**
     * Konstruktor für den `BewertungsschemaService`, der die notwendigen Repositories injiziert.
     * @param bewertungsschemaRepository Das Repository für das Bewertungsschema.
     * @param courseRepository Das Repository für die Kurse.
     */
    @Autowired
    public BewertungsschemaService(BewertungsschemaRepository bewertungsschemaRepository, CourseRepository courseRepository) {
        this.bewertungsschemaRepository = bewertungsschemaRepository;
        this.courseRepository = courseRepository;
    }

    /**
     * Holt das Bewertungsschema für einen Kurs anhand der Kurs-ID.
     * @param courseId Die ID des Kurses.
     * @return Eine Liste der Bewertungsschemas des Kurses.
     */
    public List getBewertungsschemaByCourseId(Long courseId) {
        return bewertungsschemaRepository.findByCourseId(courseId);
    }

    /**
     * Initialisiert ein Bewertungsschema für einen Kurs.
     * Erstellt ein neues Bewertungsschema mit 100% für das erste Thema und speichert es im Repository.
     * @param courseId Die ID des Kurses, für den das Bewertungsschema initialisiert werden soll.
     */
    public void initializeBewertungsschemaForCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("Course not found"));
        Bewertungsschema initialScheme = Bewertungsschema.builder()
                .topic("Topic #1")
                .percentage(100)
                .course(course)
                .build();
        bewertungsschemaRepository.save(initialScheme);
    }

    /**
     * Aktualisiert das Bewertungsschema eines Kurses.
     * Überprüft, ob die Gesamtgewichtung der Bewertungsschemas 100% ergibt, ob alle Themen eindeutig sind und ob mindestens ein Thema vorhanden ist.
     * Löscht bestehende Bewertungsschemas und speichert die neuen.
     * @param courseId Die ID des Kurses, für den das Bewertungsschema aktualisiert werden soll.
     * @param bewertungsschemaList Die Liste der neuen Bewertungsschemas.
     */
    public void updateBewertungsschema(Long courseId, List<Bewertungsschema> bewertungsschemaList) {
        // Lade den Kurs anhand der ID
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        // Summe der Prozente muss 100% betragen
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

        // Prüfen, ob mindestens ein Topic vorhanden bleibt
        if (bewertungsschemaList.isEmpty()) {
            throw new IllegalArgumentException("Es muss mindestens ein Topic vorhanden sein.");
        }

        // Alte Bewertungsschemas entfernen
        List<Bewertungsschema> existingSchemas = bewertungsschemaRepository.findByCourseId(courseId);
        for (Bewertungsschema existingSchema : existingSchemas) {
            bewertungsschemaRepository.deleteById(existingSchema.getId());
        }

        // Neue Bewertungsschemas hinzufügen
        for (Bewertungsschema schema : bewertungsschemaList) {
            schema.setId(null);
            schema.setCourse(course);
            bewertungsschemaRepository.save(schema);
        }
    }

    // Aufgabe 20 - Sprint 5
    /**
     * Löscht ein Bewertungsschema anhand der ID.
     * @param bewertungsschemaId Die ID des Bewertungsschemas, das gelöscht werden soll.
     */
    public void deleteBewertungsschema(Long bewertungsschemaId) {
        Bewertungsschema schema = bewertungsschemaRepository.findById(bewertungsschemaId)
                .orElseThrow(() -> new IllegalArgumentException("Bewertungsschema with id " + bewertungsschemaId + " does not exist."));

        bewertungsschemaRepository.deleteById(bewertungsschemaId);
    }

    /**
     * Holt ein Bewertungsschema anhand der ID.
     * @param bewertungsschemaId Die ID des Bewertungsschemas.
     * @return Ein Optional, das das Bewertungsschema enthält, wenn es gefunden wird.
     */
    public Optional<Bewertungsschema> getBewertungsschemaById(Long bewertungsschemaId) {
        return bewertungsschemaRepository.findById(bewertungsschemaId);
    }
}