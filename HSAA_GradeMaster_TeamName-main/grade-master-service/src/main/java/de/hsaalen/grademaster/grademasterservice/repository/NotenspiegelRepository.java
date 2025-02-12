package de.hsaalen.grademaster.grademasterservice.repository;

import de.hsaalen.grademaster.grademasterservice.domain.Notenspiegel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository-Schnittstelle für Notenspiegel-Entitäten.
 */
@Repository
public interface NotenspiegelRepository extends JpaRepository<Notenspiegel, Long> {
}