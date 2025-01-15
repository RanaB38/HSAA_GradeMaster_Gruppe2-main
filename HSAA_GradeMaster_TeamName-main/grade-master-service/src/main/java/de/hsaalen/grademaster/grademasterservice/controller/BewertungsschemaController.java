package de.hsaalen.grademaster.grademasterservice.controller;

import de.hsaalen.grademaster.grademasterservice.domain.Bewertungsschema;
import de.hsaalen.grademaster.grademasterservice.service.BewertungsschemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/private/v1/bewertungsschema")
public class BewertungsschemaController {
    private final BewertungsschemaService bewertungsschemaService;

    @Autowired
    public BewertungsschemaController(BewertungsschemaService bewertungsschemaService) {
        this.bewertungsschemaService = bewertungsschemaService;
    }

    @GetMapping("/course/{courseId}")
    public List<Bewertungsschema> getBewertungsschema(@PathVariable Long courseId) {
        return bewertungsschemaService.getBewertungsschemaByCourseId(courseId);
    }

    @PostMapping("/course/{courseId}/initialize")
    public void initializeBewertungsschema(@PathVariable Long courseId) {
        bewertungsschemaService.initializeBewertungsschemaForCourse(courseId);
    }

    @PostMapping("/course/{courseId}")
    public ResponseEntity<Void> updateBewertungsschema(
            @PathVariable Long courseId,
            @RequestBody List<Bewertungsschema> bewertungsschemaList) {
        bewertungsschemaService.updateBewertungsschema(courseId, bewertungsschemaList);
        return ResponseEntity.ok().build();
    }

}