package com.trello.primary.repository;

import com.trello.primary.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    User findByUsername(String username);
    User findByEmail(String email);
}
//@Repository
//- This is a Spring marker annotation. It tells Spring Boot that this interface is a Data Access Object (DAO) responsible for interacting with the database. It also allows Spring to automatically translate underlying database errors into standard Spring exceptions.
//public interface UserRepository extends JpaRepository<User,Long> {
//- interface: Notice this is an interface, not a class. You don't have to write the actual code to save/find users. Spring Boot automatically generates the implementation in the background for you.
//            - extends JpaRepository<User, Long>: This is where the magic happens. By extending JpaRepository, this interface automatically inherits dozens of built-in database methods (like .save(), .findAll(), .findById(), .delete()).
//            - <User, Long>: These generics tell Spring two things: 1) This repository is managing the User entity, and 2) The primary key (@Id) of the User entity is of data type Long.
//    User findByUsername(String username);
//    User findByEmail(String email);
//}
//- Derived Query Methods: These are custom search methods. Spring Data JPA is smart enough to read the method name. When it sees findByUsername, it automatically generates and executes the SQL query: SELECT * FROM users WHERE username = ?. You don't need to write the SQL yourself; just naming the method correctly according to Spring's naming conventions is enough.