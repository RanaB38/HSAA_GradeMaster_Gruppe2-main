package de.hsaalen.grademaster.grademasterservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GradeMasterServiceApplication {

    /**
     * Die main-Methode ist der Einstiegspunkt der Anwendung.
     * Sie startet die Spring Boot-Anwendung, indem sie die Methode run() von SpringApplication aufruft.
     * Dadurch wird die Anwendung gestartet und die Spring Boot-Konfiguration geladen.
     * @param args Befehlszeilenargumente, die beim Start der Anwendung übergeben werden können.
     */
    public static void main(String[] args) {
        SpringApplication.run(GradeMasterServiceApplication.class, args);
    }

}

