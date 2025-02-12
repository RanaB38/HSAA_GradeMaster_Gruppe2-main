package de.hsaalen.grademaster.grademasterservice.repository;

import de.hsaalen.grademaster.grademasterservice.domain.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository für die Entität {@link Course}.
 * Bietet CRUD-Operationen sowie benutzerdefinierte Abfragen für spezifische Kursinformationen.
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    /**
     * Sucht einen Kurs anhand des Namens.
     *
     * @param name Der Name des Kurses.
     * @return Ein {@link Optional} mit dem gefundenen Kurs oder leer, falls kein Kurs existiert.
     */
    @Query("SELECT k FROM Course k WHERE k.name = ?1")
    Optional<Course> findCourseByName(String name);

    /**
     * Findet einen Kurs anhand der ID und lädt zusätzlich die zugehörigen Bewertungsschemata.
     *
     * @param courseId Die ID des Kurses.
     * @return Ein {@link Optional} mit dem gefundenen Kurs, inklusive der Bewertungsschemata.
     */
    @Query("SELECT c FROM Course c JOIN FETCH c.bewertungsschemas WHERE c.id = :courseId")
    Optional<Course> findCourseWithBewertungsschemaById(@Param("courseId") Long courseId);

    // Methode, um zu prüfen, ob ein Kurs mit einem bestimmten Namen existiert
    // boolean existsByName(String courseName);
}

