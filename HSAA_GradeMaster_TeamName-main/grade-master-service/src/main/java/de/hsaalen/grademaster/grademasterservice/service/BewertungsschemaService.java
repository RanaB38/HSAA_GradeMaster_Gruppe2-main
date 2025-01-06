package de.hsaalen.grademaster.grademasterservice.service;

import de.hsaalen.grademaster.grademasterservice.domain.Bewertungsschema;
import de.hsaalen.grademaster.grademasterservice.domain.Course;
import de.hsaalen.grademaster.grademasterservice.repository.BewertungsschemaRepository;
import de.hsaalen.grademaster.grademasterservice.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BewertungsschemaService {
    private final BewertungsschemaRepository bewertungsschemaRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public BewertungsschemaService(BewertungsschemaRepository bewertungsschemaRepository, CourseRepository courseRepository) {
        this.bewertungsschemaRepository = bewertungsschemaRepository;
        this.courseRepository = courseRepository;
    }

    public List getBewertungsschemaByCourseId(Long courseId) {
        return bewertungsschemaRepository.findByCourseId(courseId);
    }

    public void initializeBewertungsschemaForCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("Course not found"));
        Bewertungsschema initialScheme = Bewertungsschema.builder()
                .topic("Topic #1")
                .percentage(100)
                .course(course)
                .build();
        bewertungsschemaRepository.save(initialScheme);
    }

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

        // Aktualisieren des Schemas
        course.getBewertungsschemas().clear(); // Altes Schema entfernen
        for (Bewertungsschema schema : bewertungsschemaList) {
            course.addBewertungsschema(schema); // Neues Schema hinzufügen
        }

        // Speichern des aktualisierten Kurses
        courseRepository.save(course);
    }
}