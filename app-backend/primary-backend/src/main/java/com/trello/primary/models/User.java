package com.trello.primary.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // A convenient shortcut annotation that bundles @ToString, @EqualsAndHashCode, @Getter (for all fields), and @Setter (for all non-final fields).
@Builder // Automatically generates a "Builder" pattern class for your entity. This lets you instantiate objects cleanly like this: User.builder().username("test").email("test@test.com").build()
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private String username;
    private String email;
    private String password;

}
