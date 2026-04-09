package com.smartfacility.service;

import com.smartfacility.model.Quiz;
import com.smartfacility.model.QuizAttempt;
import com.smartfacility.model.QuizQuestion;
import com.smartfacility.repository.QuizAttemptRepository;
import com.smartfacility.repository.QuizRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Transactional
    public Quiz createQuiz(String title, String description, Boolean active, List<QuizQuestionInput> questionInputs, String creatorEmail) {
        if (title == null || title.trim().isEmpty()) {
            throw new RuntimeException("Quiz title is required");
        }
        if (questionInputs == null || questionInputs.isEmpty()) {
            throw new RuntimeException("At least one question is required");
        }

        Quiz quiz = new Quiz();
        quiz.setTitle(title.trim());
        quiz.setDescription(description == null ? "" : description.trim());
        quiz.setActive(active == null ? true : active);
        quiz.setCreatedByEmail(creatorEmail);
        quiz.setCreatedAt(LocalDateTime.now());

        List<QuizQuestion> questions = new ArrayList<>();
        for (int i = 0; i < questionInputs.size(); i++) {
            QuizQuestionInput input = questionInputs.get(i);
            validateQuestionInput(input, i);

            QuizQuestion question = new QuizQuestion();
            question.setQuiz(quiz);
            question.setQuestionText(input.questionText().trim());
            question.setOptions(new ArrayList<>(input.options()));
            question.setCorrectOptionIndex(input.correctOptionIndex());
            questions.add(question);
        }

        quiz.setQuestions(questions);
        return quizRepository.save(quiz);
    }

    @Transactional
    public Quiz updateQuiz(Long quizId, String title, String description, Boolean active, List<QuizQuestionInput> questionInputs, String userEmail) {
        Optional<Quiz> quizOpt = quizRepository.findById(quizId);
        if (quizOpt.isEmpty()) {
            throw new RuntimeException("Quiz not found");
        }

        Quiz quiz = quizOpt.get();

        if (title == null || title.trim().isEmpty()) {
            throw new RuntimeException("Quiz title is required");
        }
        if (questionInputs == null || questionInputs.isEmpty()) {
            throw new RuntimeException("At least one question is required");
        }

        quiz.setTitle(title.trim());
        quiz.setDescription(description == null ? "" : description.trim());
        quiz.setActive(active == null ? true : active);

        List<QuizQuestion> managedQuestions = quiz.getQuestions();
        managedQuestions.clear();
        for (int i = 0; i < questionInputs.size(); i++) {
            QuizQuestionInput input = questionInputs.get(i);
            validateQuestionInput(input, i);

            QuizQuestion question = new QuizQuestion();
            question.setQuiz(quiz);
            question.setQuestionText(input.questionText().trim());
            question.setOptions(new ArrayList<>(input.options()));
            question.setCorrectOptionIndex(input.correctOptionIndex());
            managedQuestions.add(question);
        }

        return quizRepository.save(quiz);
    }

    @Transactional
    public void deleteQuiz(Long quizId, String userEmail) {
        Optional<Quiz> quizOpt = quizRepository.findById(quizId);
        if (quizOpt.isEmpty()) {
            throw new RuntimeException("Quiz not found");
        }

        Quiz quiz = quizOpt.get();

        quizAttemptRepository.deleteByQuizId(quizId);
        quizRepository.delete(quiz);
    }

    @Transactional
    public List<Quiz> getAllQuizzesForAdmin() {
        return quizRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public List<Quiz> getAvailableQuizzesForUsers() {
        return quizRepository.findByActiveTrueOrderByCreatedAtDesc();
    }

    @Transactional
    public Quiz getQuizById(Long quizId) {
        Optional<Quiz> quizOpt = quizRepository.findById(quizId);
        if (quizOpt.isEmpty()) {
            throw new RuntimeException("Quiz not found");
        }
        return quizOpt.get();
    }

    @Transactional
    public SubmissionResult submitQuiz(Long quizId, String userEmail, Map<Long, Integer> selectedAnswers) {
        Quiz quiz = getQuizById(quizId);
        if (!Boolean.TRUE.equals(quiz.getActive())) {
            throw new RuntimeException("Quiz is inactive");
        }

        int total = quiz.getQuestions().size();
        int score = 0;

        for (QuizQuestion question : quiz.getQuestions()) {
            Integer selected = selectedAnswers.get(question.getId());
            if (selected != null && selected.equals(question.getCorrectOptionIndex())) {
                score++;
            }
        }

        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuiz(quiz);
        attempt.setUserEmail(userEmail);
        attempt.setScore(score);
        attempt.setTotalQuestions(total);
        attempt.setSubmittedAt(LocalDateTime.now());
        quizAttemptRepository.save(attempt);

        return new SubmissionResult(attempt.getId(), score, total);
    }

    @Transactional
    public List<QuizAttempt> getAttemptsForUser(String userEmail) {
        return quizAttemptRepository.findByUserEmailOrderBySubmittedAtDesc(userEmail);
    }

    @Transactional
    public Optional<QuizAttempt> getLatestAttempt(Long quizId, String userEmail) {
        return quizAttemptRepository.findTopByQuizIdAndUserEmailOrderBySubmittedAtDesc(quizId, userEmail);
    }

    public long getAttemptCount(Long quizId) {
        return quizAttemptRepository.countByQuizId(quizId);
    }

    private void validateQuestionInput(QuizQuestionInput input, int index) {
        if (input == null) {
            throw new RuntimeException("Question " + (index + 1) + " is missing");
        }

        String text = input.questionText();
        if (text == null || text.trim().isEmpty()) {
            throw new RuntimeException("Question " + (index + 1) + " text is required");
        }

        List<String> options = input.options();
        if (options == null || options.size() < 2) {
            throw new RuntimeException("Question " + (index + 1) + " needs at least 2 options");
        }

        for (String option : options) {
            if (option == null || option.trim().isEmpty()) {
                throw new RuntimeException("Question " + (index + 1) + " has an empty option");
            }
        }

        Integer correctOptionIndex = input.correctOptionIndex();
        if (correctOptionIndex == null || correctOptionIndex < 0 || correctOptionIndex >= options.size()) {
            throw new RuntimeException("Question " + (index + 1) + " has an invalid correct answer index");
        }
    }

    public record QuizQuestionInput(String questionText, List<String> options, Integer correctOptionIndex) {
    }

    public record SubmissionResult(Long attemptId, Integer score, Integer totalQuestions) {
    }
}
