package com.smartfacility.controller;

import com.smartfacility.model.Quiz;
import com.smartfacility.model.QuizAttempt;
import com.smartfacility.model.QuizQuestion;
import com.smartfacility.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/quizzes")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping
    public ResponseEntity<?> createQuiz(@RequestBody CreateQuizRequest request, Authentication auth) {
        try {
            List<QuizService.QuizQuestionInput> inputs = request.questions().stream()
                    .map(q -> new QuizService.QuizQuestionInput(q.questionText(), q.options(), q.correctOptionIndex()))
                    .toList();

            Quiz quiz = quizService.createQuiz(
                    request.title(),
                    request.description(),
                    request.active(),
                    inputs,
                    auth.getName()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Quiz created successfully");
            response.put("quizId", quiz.getId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{quizId}")
    public ResponseEntity<?> updateQuiz(@PathVariable Long quizId, @RequestBody CreateQuizRequest request, Authentication auth) {
        try {
            List<QuizService.QuizQuestionInput> inputs = request.questions().stream()
                    .map(q -> new QuizService.QuizQuestionInput(q.questionText(), q.options(), q.correctOptionIndex()))
                    .toList();

            Quiz quiz = quizService.updateQuiz(
                    quizId,
                    request.title(),
                    request.description(),
                    request.active(),
                    inputs,
                    auth.getName()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Quiz updated successfully");
            response.put("quizId", quiz.getId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<?> deleteQuiz(@PathVariable Long quizId, Authentication auth) {
        try {
            quizService.deleteQuiz(quizId, auth.getName());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Quiz deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/admin")
    public ResponseEntity<?> getAllQuizzesForAdmin() {
        List<Map<String, Object>> data = quizService.getAllQuizzesForAdmin().stream()
                .map(quiz -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", quiz.getId());
                    item.put("title", quiz.getTitle());
                    item.put("description", quiz.getDescription());
                    item.put("active", quiz.getActive());
                    item.put("createdByEmail", quiz.getCreatedByEmail());
                    item.put("createdAt", quiz.getCreatedAt());
                    item.put("questionCount", quiz.getQuestions().size());
                    item.put("attemptCount", quizService.getAttemptCount(quiz.getId()));
                    return item;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(data);
    }

    @GetMapping
    public ResponseEntity<?> getAvailableQuizzes(Authentication auth) {
        List<Map<String, Object>> data = quizService.getAvailableQuizzesForUsers().stream()
                .map(quiz -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", quiz.getId());
                    item.put("title", quiz.getTitle());
                    item.put("description", quiz.getDescription());
                    item.put("questionCount", quiz.getQuestions().size());
                    item.put("createdAt", quiz.getCreatedAt());

                    Optional<QuizAttempt> latestAttempt = quizService.getLatestAttempt(quiz.getId(), auth.getName());
                    if (latestAttempt.isPresent()) {
                        item.put("lastScore", latestAttempt.get().getScore());
                        item.put("lastTotalQuestions", latestAttempt.get().getTotalQuestions());
                        item.put("lastSubmittedAt", latestAttempt.get().getSubmittedAt());
                    }
                    return item;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(data);
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<?> getQuizDetails(@PathVariable Long quizId, Authentication auth) {
        try {
            Quiz quiz = quizService.getQuizById(quizId);
            boolean isAdmin = hasRole(auth, "ROLE_ADMIN");

            Map<String, Object> response = new HashMap<>();
            response.put("id", quiz.getId());
            response.put("title", quiz.getTitle());
            response.put("description", quiz.getDescription());
            response.put("active", quiz.getActive());

            List<Map<String, Object>> questionData = quiz.getQuestions().stream()
                    .map(question -> mapQuestion(question, isAdmin))
                    .collect(Collectors.toList());
            response.put("questions", questionData);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(404).body(error);
        }
    }

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<?> submitQuiz(@PathVariable Long quizId, @RequestBody SubmitQuizRequest request, Authentication auth) {
        try {
            Map<Long, Integer> selectedAnswers = new HashMap<>();
            if (request.answers() != null) {
                for (AnswerPayload answer : request.answers()) {
                    if (answer.questionId() != null && answer.selectedOptionIndex() != null) {
                        selectedAnswers.put(answer.questionId(), answer.selectedOptionIndex());
                    }
                }
            }

            QuizService.SubmissionResult result = quizService.submitQuiz(quizId, auth.getName(), selectedAnswers);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Quiz submitted successfully");
            response.put("attemptId", result.attemptId());
            response.put("score", result.score());
            response.put("totalQuestions", result.totalQuestions());
            response.put("percentage", result.totalQuestions() == 0 ? 0 : (result.score() * 100) / result.totalQuestions());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/my-attempts")
    public ResponseEntity<?> getMyAttempts(Authentication auth) {
        List<Map<String, Object>> attempts = quizService.getAttemptsForUser(auth.getName()).stream()
                .map(attempt -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("attemptId", attempt.getId());
                    item.put("quizId", attempt.getQuiz().getId());
                    item.put("quizTitle", attempt.getQuiz().getTitle());
                    item.put("score", attempt.getScore());
                    item.put("totalQuestions", attempt.getTotalQuestions());
                    item.put("submittedAt", attempt.getSubmittedAt());
                    return item;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(attempts);
    }

    private Map<String, Object> mapQuestion(QuizQuestion question, boolean includeCorrect) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", question.getId());
        data.put("questionText", question.getQuestionText());
        data.put("options", question.getOptions());
        if (includeCorrect) {
            data.put("correctOptionIndex", question.getCorrectOptionIndex());
        }
        return data;
    }

    private boolean hasRole(Authentication auth, String role) {
        for (GrantedAuthority authority : auth.getAuthorities()) {
            if (role.equals(authority.getAuthority())) {
                return true;
            }
        }
        return false;
    }

    public record CreateQuizRequest(String title, String description, Boolean active, List<QuestionPayload> questions) {
    }

    public record QuestionPayload(String questionText, List<String> options, Integer correctOptionIndex) {
    }

    public record SubmitQuizRequest(List<AnswerPayload> answers) {
    }

    public record AnswerPayload(Long questionId, Integer selectedOptionIndex) {
    }
}
