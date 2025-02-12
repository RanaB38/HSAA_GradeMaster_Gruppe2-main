package de.hsaalen.grademaster.grademasterservice.repository;

import de.hsaalen.grademaster.grademasterservice.domain.WebUser;
import org.springframework.data.jpa.repository.JpaRepository;
/**
 * Repository-Schnittstelle für WebUser-Entitäten.
 */

public interface UserRepository extends JpaRepository<WebUser, String> {

    /**
     * Findet einen Benutzer anhand des Benutzernamens.

     * @return Gefundener WebUser
     */
    WebUser findByUsername(String username);


}
