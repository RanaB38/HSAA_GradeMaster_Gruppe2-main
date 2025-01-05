package de.hsaalen.grademaster.grademasterservice.service;

import de.hsaalen.grademaster.grademasterservice.domain.Bewertungsschema;
import de.hsaalen.grademaster.grademasterservice.domain.Course;
import de.hsaalen.grademaster.grademasterservice.repository.BewertungsschemaRepository;
import de.hsaalen.grademaster.grademasterservice.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BewertungsschemaService {
    private final BewertungsschemaRepository bewertungsschemaRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public BewertungsschemaService(BewertungsschemaRepository bewertungsschemaRepository, CourseRepository courseRepository) {
        this.bewertungsschemaRepository = bewertungsschemaRepository;
        this.courseRepository = courseRepository;
    }

    public List getBewertungsschemaByCourseId(Long courseId) {
        return bewertungsschemaRepository.findByCourseId(courseId);
    }

    public void initializeBewertungsschemaForCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("Course not found"));
        Bewertungsschema initialScheme = Bewertungsschema.builder()
                .topic("Topic #1")
                .percentage(100)
                .course(course)
                .build();
        bewertungsschemaRepository.save(initialScheme);
    }
}
