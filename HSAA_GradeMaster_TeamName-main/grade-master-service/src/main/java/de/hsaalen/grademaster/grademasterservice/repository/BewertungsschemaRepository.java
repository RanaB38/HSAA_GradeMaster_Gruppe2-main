package de.hsaalen.grademaster.grademasterservice.repository;

import de.hsaalen.grademaster.grademasterservice.domain.Bewertungsschema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository-Schnittstelle für Bewertungsschema-Entitäten.
 **/

@Repository
public interface BewertungsschemaRepository extends JpaRepository<Bewertungsschema, Long> {

    /**
     * Findet alle Bewertungsschemas anhand einer Kurs-ID.
     */
    List<Bewertungsschema> findByCourseId(Long courseId);
}
