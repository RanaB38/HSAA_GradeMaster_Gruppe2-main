package de.hsaalen.grademaster.grademasterservice.repository;

import de.hsaalen.grademaster.grademasterservice.domain.Kurs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KursRepository
        extends JpaRepository<Kurs, Long> {

    //Methode, um einen Kurs anhand des Namens zu suchen
    @Query("SELECT k FROM Kurs k WHERE k.name = ?1")
    Optional<Kurs> findKursByName(String name);

    //Methode, um zu prüfen, ob ein Kurs mit einem bestimmten Namen existiert
    boolean existsByName(String kursName);

    //Methode, um einen Kurs anhand des Namens zu löschen
    void deleteByName(String kursName);
}
