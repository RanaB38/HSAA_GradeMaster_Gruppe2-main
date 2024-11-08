package de.hsaalen.grademaster.grademasterservice.repository;

import de.hsaalen.grademaster.grademasterservice.domain.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseRepository
        extends JpaRepository<Course, Long> {

    //Methode, um einen Kurs anhand des Namens zu suchen
    @Query("SELECT k FROM Course k WHERE k.name = ?1")
    Optional<Course> findCourseByName(String name);

    //Methode, um zu prüfen, ob ein Kurs mit einem bestimmten Namen existiert
    boolean existsByName(String courseName);

    //Methode, um einen Kurs anhand des Namens zu löschen
    void deleteById(Long courseId);
}
