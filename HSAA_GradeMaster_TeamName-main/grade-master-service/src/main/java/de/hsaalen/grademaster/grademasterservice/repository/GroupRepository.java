package de.hsaalen.grademaster.grademasterservice.repository;

import de.hsaalen.grademaster.grademasterservice.domain.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository-Schnittstelle für Group-Entitäten.
 */

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {

    /**
     * Findet alle Gruppen eines bestimmten Kurses anhand der Kurs-ID.
     * @return Liste der Gruppen für den gegebenen Kurs
     */

    List<Group> findByCourseId(Long courseId);

    /**
     * Überprüft, ob eine Gruppe mit einem bestimmten Namen in einem Kurs existiert.
     * @return true, wenn die Gruppe existiert, sonst false
     */
    boolean existsByCourseIdAndName(Long courseId, String name);
}
