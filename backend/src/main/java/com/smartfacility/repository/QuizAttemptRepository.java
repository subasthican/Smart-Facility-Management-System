package com.smartfacility.repository;

import com.smartfacility.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserEmailOrderBySubmittedAtDesc(String userEmail);
    Optional<QuizAttempt> findTopByQuizIdAndUserEmailOrderBySubmittedAtDesc(Long quizId, String userEmail);
    long countByQuizId(Long quizId);
    void deleteByQuizId(Long quizId);
}
