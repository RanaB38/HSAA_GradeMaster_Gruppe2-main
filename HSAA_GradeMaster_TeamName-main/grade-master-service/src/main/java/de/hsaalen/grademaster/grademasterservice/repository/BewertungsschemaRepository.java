package de.hsaalen.grademaster.grademasterservice.repository;

import de.hsaalen.grademaster.grademasterservice.domain.Bewertungsschema;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BewertungsschemaRepository extends JpaRepository<Bewertungsschema, Long> {
    List<Bewertungsschema> findByCourseId(Long courseId);
}
