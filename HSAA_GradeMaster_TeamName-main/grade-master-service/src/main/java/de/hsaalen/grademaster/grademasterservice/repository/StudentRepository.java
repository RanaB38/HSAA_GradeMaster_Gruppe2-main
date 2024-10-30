package de.hsaalen.grademaster.grademasterservice.repository;

import de.hsaalen.grademaster.grademasterservice.domain.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository
        extends JpaRepository<Student, Long> {

    //Methode, um einen Studenten anhand der ID zu suchen
    @Query("SELECT s FROM Student s WHERE s.id = ?1")
    Optional <Student> findStudentById(Long id);
}
