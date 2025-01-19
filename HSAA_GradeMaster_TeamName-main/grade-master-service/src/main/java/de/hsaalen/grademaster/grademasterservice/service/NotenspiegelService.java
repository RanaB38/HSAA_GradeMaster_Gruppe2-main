package de.hsaalen.grademaster.grademasterservice.service;

import de.hsaalen.grademaster.grademasterservice.domain.Notenspiegel;
import de.hsaalen.grademaster.grademasterservice.repository.NotenspiegelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotenspiegelService {
    private final NotenspiegelRepository notenspiegelRepository;

    @Autowired
    public NotenspiegelService(NotenspiegelRepository notenspiegelRepository) {
        this.notenspiegelRepository = notenspiegelRepository;
    }

    public void initializeNotenspiegel() {
        if (notenspiegelRepository.count() == 0) {
            List<Notenspiegel> defaultEntries = List.of(
                    new Notenspiegel(null, 94.9, 100, "1.0", "Sehr gut"),
                    new Notenspiegel(null, 89.5, 94.9, "1.3", "Sehr gut (-)"),
                    new Notenspiegel(null, 84.3, 89.5, "1.7", "Gut (+)"),
                    new Notenspiegel(null, 79.0, 84.3, "2.0", "Gut"),
                    new Notenspiegel(null, 73.7, 79.0, "2.3", "Gut (-)"),
                    new Notenspiegel(null, 68.2, 73.7, "2.7", "Befriedigend (+)"),
                    new Notenspiegel(null, 63.1, 68.2, "3.0", "Befriedigend"),
                    new Notenspiegel(null, 57.9, 63.1, "3.3", "Befriedigend (-)"),
                    new Notenspiegel(null, 52.6, 57.9, "3.7", "Ausreichend (+)"),
                    new Notenspiegel(null, 50.0, 52.6, "4.0", "Ausreichend"),
                    new Notenspiegel(null, 0, 50.0, "5.0", "Nicht bestanden")
            );
            notenspiegelRepository.saveAll(defaultEntries);
        }
    }

    public List<Notenspiegel> getAllNotenspiegel() {
        return notenspiegelRepository.findAll();
    }
}
