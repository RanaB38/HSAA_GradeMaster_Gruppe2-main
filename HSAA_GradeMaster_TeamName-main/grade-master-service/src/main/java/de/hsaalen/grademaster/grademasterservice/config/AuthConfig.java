package de.hsaalen.grademaster.grademasterservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class AuthConfig {

    /**
     * Erstellt und liefert einen Passwort-Encoder.
     * @return Eine Instanz des NoOpPasswordEncoders.
     **/

    @Bean
    PasswordEncoder getPasswordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    /**
     * Konfiguriert die Sicherheitsregeln für die Anwendung.
     * Definiert Zugriffsrechte für Endpunkte, z.B. H2 DB Konsole
     * @param httpSecurity Die HttpSecurity-Konfiguration.
     * @return Die konfigurierte SecurityFilterChain.
     * @throws Exception Falls ein Fehler bei der Sicherheitskonfiguration auftritt.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.authorizeRequests()
                .requestMatchers("/h2/**").permitAll()
                .requestMatchers("/public/**").permitAll()
                .requestMatchers(HttpMethod.GET,"/api/private/**").hasAnyRole("STUDENT", "LECTURER")
                .requestMatchers(HttpMethod.PUT,"/api/private/**").hasAnyRole("LECTURER")
                .requestMatchers(HttpMethod.POST,"/api/private/**").hasAnyRole("LECTURER")
                .requestMatchers(HttpMethod.DELETE,"/api/private/**").hasAnyRole("LECTURER")
                .and()
                .httpBasic(withDefaults());

        httpSecurity.csrf(AbstractHttpConfigurer::disable);
        httpSecurity.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin));
        httpSecurity.cors(withDefaults());


        return httpSecurity.build();
    }

}