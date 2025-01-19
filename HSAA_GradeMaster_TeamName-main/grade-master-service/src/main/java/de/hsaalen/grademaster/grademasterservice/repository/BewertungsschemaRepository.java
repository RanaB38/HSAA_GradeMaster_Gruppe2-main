package de.hsaalen.grademaster.grademasterservice.repository;

import de.hsaalen.grademaster.grademasterservice.domain.Bewertungsschema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BewertungsschemaRepository extends JpaRepository<Bewertungsschema, Long> {
    List<Bewertungsschema> findByCourseId(Long courseId);
}
