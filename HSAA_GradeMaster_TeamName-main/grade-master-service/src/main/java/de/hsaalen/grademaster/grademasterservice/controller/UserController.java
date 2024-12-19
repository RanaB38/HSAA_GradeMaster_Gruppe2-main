package de.hsaalen.grademaster.grademasterservice.controller;

import de.hsaalen.grademaster.grademasterservice.domain.WebUser;
import de.hsaalen.grademaster.grademasterservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@AllArgsConstructor
@RestController
@RequestMapping(path = "api/public/v1/user")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping(path = "/auth")
    public ResponseEntity<WebUser> login(Principal principle) {

        WebUser user = userRepository.findByUsername(principle.getName());

        return new ResponseEntity<WebUser>(
                user,
                HttpStatus.OK
        );
    }


}