package de.hsaalen.grademaster.grademasterservice.controller;

import de.hsaalen.grademaster.grademasterservice.domain.Notenspiegel;
import de.hsaalen.grademaster.grademasterservice.service.NotenspiegelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/public/v1/notenspiegel")
public class NotenspiegelController {
    private final NotenspiegelService notenspiegelService;

    @Autowired
    public NotenspiegelController(NotenspiegelService notenspiegelService) {
        this.notenspiegelService = notenspiegelService;
    }

    @GetMapping
    public List<Notenspiegel> getNotenspiegel() {
        List<Notenspiegel> notenspiegelList = notenspiegelService.getAllNotenspiegel();
        if (notenspiegelList == null || notenspiegelList.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "No data available");
        }
        return notenspiegelList;
    }

    @PostMapping("/initialize")
    public void initializeNotenspiegel() {
        notenspiegelService.initializeNotenspiegel();
    }
}
