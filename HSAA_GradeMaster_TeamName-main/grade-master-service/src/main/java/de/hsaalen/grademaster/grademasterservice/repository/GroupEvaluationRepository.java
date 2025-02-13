package de.hsaalen.grademaster.grademasterservice.repository;

import de.hsaalen.grademaster.grademasterservice.domain.Bewertungsschema;
import de.hsaalen.grademaster.grademasterservice.domain.GroupEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupEvaluationRepository extends JpaRepository<GroupEvaluation, Long> {
    List<GroupEvaluation> findByEvaluation(Bewertungsschema evaluation);
}
