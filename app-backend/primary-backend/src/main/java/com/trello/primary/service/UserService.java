package com.trello.primary.service;

import com.trello.primary.models.User;
import com.trello.primary.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    public User registerUser(User user) {
        return userRepository.save(user);
    }
}
