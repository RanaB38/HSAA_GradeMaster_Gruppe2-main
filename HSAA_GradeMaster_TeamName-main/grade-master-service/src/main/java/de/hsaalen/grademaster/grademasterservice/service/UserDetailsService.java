package de.hsaalen.grademaster.grademasterservice.service;


import de.hsaalen.grademaster.grademasterservice.domain.WebUser;
import de.hsaalen.grademaster.grademasterservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    @Autowired
    private UserRepository repo;

    /**
     * Wird von Spring Security aufgerufen, um einen Benutzer anhand des Benutzernamens zu laden.
     * Wenn der Benutzer existiert, werden die Benutzerinformationen (Benutzername, Passwort und Rollen) zurückgegeben.
     * Andernfalls wird eine Ausnahme geworfen.
     * @param username Der Benutzername des zu ladenden Benutzers.
     * @return Ein UserDetails-Objekt mit den Benutzerinformationen.
     * @throws UsernameNotFoundException Wird geworfen, wenn der Benutzer nicht gefunden wird.
     */
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        WebUser user = repo.findByUsername(username);

        if (user != null) {

            return new User(user.getUsername(), user.getPassword(), userAuthorities(user.getRole()));

        } else {

            throw new UsernameNotFoundException("User not found with username: " + username);
        }
    }

    /**
     * Hilfsmethode zur Erstellung der Benutzerberechtigungen (Authorities) basierend auf der Rolle des Benutzers.
     * Spring Security erwartet, dass Benutzerrechte als "GrantedAuthority" übergeben werden.
     * @param roles Die Rolle des Benutzers (z. B. "ROLE_USER").
     * @return Eine Liste von SimpleGrantedAuthority-Objekten, die die Berechtigungen des Benutzers repräsentieren.
     */
    private static List<SimpleGrantedAuthority> userAuthorities(final String roles) {

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(roles));

        return authorities;
    }
}

