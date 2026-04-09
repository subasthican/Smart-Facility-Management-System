import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api";

const createDefaultQuestion = () => ({
  questionText: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
});

const Quizzes = () => {
  const { token, user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [adminQuizzes, setAdminQuizzes] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [attemptHistory, setAttemptHistory] = useState([]);

  const [activeQuizId, setActiveQuizId] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [scoreResult, setScoreResult] = useState(null);

  const [draft, setDraft] = useState({
    title: "",
    description: "",
    active: true,
    questions: [createDefaultQuestion()],
  });

  const [editingQuizId, setEditingQuizId] = useState(null);

  const authHeaders = useMemo(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }), [token]);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (isAdmin) {
        const response = await fetch(`${API_BASE}/quizzes/admin`, { headers: authHeaders });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load quizzes");
        setAdminQuizzes(data);
      } else {
        const [quizRes, attemptsRes] = await Promise.all([
          fetch(`${API_BASE}/quizzes`, { headers: authHeaders }),
          fetch(`${API_BASE}/quizzes/my-attempts`, { headers: authHeaders }),
        ]);
        const quizData = await quizRes.json();
        const attemptsData = await attemptsRes.json();

        if (!quizRes.ok) throw new Error(quizData.error || "Failed to load quizzes");
        if (!attemptsRes.ok) throw new Error(attemptsData.error || "Failed to load attempt history");

        setQuizList(quizData);
        setAttemptHistory(attemptsData);
      }
    } catch (err) {
      setError(err.message || "Unable to load quiz module");
    } finally {
      setLoading(false);
    }
  }, [authHeaders, isAdmin]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const loadQuizById = async (quizId) => {
    setError("");
    setSuccess("");
    setScoreResult(null);
    try {
      const response = await fetch(`${API_BASE}/quizzes/${quizId}`, { headers: authHeaders });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load selected quiz");
      setActiveQuizId(quizId);
      setActiveQuiz(data);
      setAnswers({});
    } catch (err) {
      setError(err.message || "Failed to load quiz");
    }
  };

  const updateDraftQuestion = (questionIndex, updater) => {
    setDraft((prev) => {
      const nextQuestions = [...prev.questions];
      nextQuestions[questionIndex] = updater(nextQuestions[questionIndex]);
      return { ...prev, questions: nextQuestions };
    });
  };

  const addQuestion = () => {
    setDraft((prev) => ({ ...prev, questions: [...prev.questions, createDefaultQuestion()] }));
  };

  const removeQuestion = (questionIndex) => {
    setDraft((prev) => {
      const nextQuestions = prev.questions.filter((_, idx) => idx !== questionIndex);
      return { ...prev, questions: nextQuestions.length ? nextQuestions : [createDefaultQuestion()] };
    });
  };

  const editQuiz = async (quizId) => {
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_BASE}/quizzes/${quizId}`, { headers: authHeaders });
      const quiz = await response.json();
      if (!response.ok) throw new Error(quiz.error || "Failed to load quiz for editing");

      const questions = quiz.questions.map((q) => ({
        questionText: q.questionText,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
      }));

      setDraft({
        title: quiz.title,
        description: quiz.description,
        active: quiz.active,
        questions,
      });
      setEditingQuizId(quizId);
    } catch (err) {
      setError(err.message || "Failed to load quiz for editing");
    }
  };

  const cancelEdit = () => {
    setEditingQuizId(null);
    setDraft({
      title: "",
      description: "",
      active: true,
      questions: [createDefaultQuestion()],
    });
    setError("");
    setSuccess("");
  };

  const deleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) {
      return;
    }

    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_BASE}/quizzes/${quizId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete quiz");

      setSuccess("Quiz deleted successfully");
      await loadInitialData();
    } catch (err) {
      setError(err.message || "Failed to delete quiz");
    }
  };

  const createQuiz = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        title: draft.title.trim(),
        description: draft.description.trim(),
        active: draft.active,
        questions: draft.questions.map((q) => ({
          questionText: q.questionText.trim(),
          options: q.options.map((opt) => opt.trim()),
          correctOptionIndex: Number(q.correctOptionIndex),
        })),
      };

      const url = editingQuizId ? `${API_BASE}/quizzes/${editingQuizId}` : `${API_BASE}/quizzes`;
      const method = editingQuizId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || (editingQuizId ? "Quiz update failed" : "Quiz creation failed"));

      setSuccess(editingQuizId ? "Quiz updated successfully" : "Quiz created successfully");
      setEditingQuizId(null);
      setDraft({
        title: "",
        description: "",
        active: true,
        questions: [createDefaultQuestion()],
      });

      await loadInitialData();
    } catch (err) {
      setError(err.message || (editingQuizId ? "Quiz update failed" : "Quiz creation failed"));
    } finally {
      setSaving(false);
    }
  };

  const submitQuiz = async (e) => {
    e.preventDefault();
    if (!activeQuizId) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({
          questionId: Number(questionId),
          selectedOptionIndex,
        })),
      };

      const response = await fetch(`${API_BASE}/quizzes/${activeQuizId}/submit`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Quiz submission failed");

      setScoreResult(data);
      setSuccess("Quiz submitted successfully");
      await loadInitialData();
    } catch (err) {
      setError(err.message || "Quiz submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const selectOption = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  return (
    <section className="sf-page">
      <PageHeader
        breadcrumb="Workspace / Quiz"
        title="Quiz Management"
        subtitle={isAdmin ? "Create and manage MCQ quizzes for students." : "Take quizzes and track your scores."}
      />

      {error && (
        <div className="mb-4 rounded-xl border border-rose-300/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {success}
        </div>
      )}

      {loading ? (
        <div className="sf-card p-6 text-sm sf-subtitle">Loading quiz module...</div>
      ) : isAdmin ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={createQuiz} className="sf-card p-5">
            <h3 className="mb-4 text-lg font-bold sf-title">
              {editingQuizId ? "Edit Quiz" : "Create Quiz"}
            </h3>

            <label className="sf-label">Title</label>
            <input
              className="sf-input mb-3"
              value={draft.title}
              onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Campus Safety Basics"
            />

            <label className="sf-label">Description</label>
            <textarea
              className="sf-input mb-3"
              rows={2}
              value={draft.description}
              onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Short quiz description"
            />

            <label className="mb-4 inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setDraft((prev) => ({ ...prev, active: e.target.checked }))}
              />
              <span className="sf-subtitle">Active quiz</span>
            </label>

            <div className="space-y-4">
              {draft.questions.map((question, qIdx) => (
                <div key={`q-${qIdx}`} className="rounded-xl border border-white/10 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold">Question {qIdx + 1}</p>
                    <button type="button" onClick={() => removeQuestion(qIdx)} className="sf-btn-secondary text-xs">
                      Remove
                    </button>
                  </div>

                  <input
                    className="sf-input mb-3"
                    placeholder="Question text"
                    value={question.questionText}
                    onChange={(e) => updateDraftQuestion(qIdx, (old) => ({ ...old, questionText: e.target.value }))}
                  />

                  <div className="space-y-2">
                    {question.options.map((option, optIdx) => (
                      <div key={`q-${qIdx}-o-${optIdx}`} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qIdx}`}
                          checked={Number(question.correctOptionIndex) === optIdx}
                          onChange={() => updateDraftQuestion(qIdx, (old) => ({ ...old, correctOptionIndex: optIdx }))}
                        />
                        <input
                          className="sf-input"
                          placeholder={`Option ${optIdx + 1}`}
                          value={option}
                          onChange={(e) =>
                            updateDraftQuestion(qIdx, (old) => {
                              const options = [...old.options];
                              options[optIdx] = e.target.value;
                              return { ...old, options };
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={addQuestion} className="sf-btn-secondary">
                + Add Question
              </button>
              <button type="submit" disabled={saving} className="sf-btn-primary">
                {saving ? "Saving..." : (editingQuizId ? "Update Quiz" : "Create Quiz")}
              </button>
              {editingQuizId && (
                <button type="button" onClick={cancelEdit} className="sf-btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="sf-card p-5">
            <h3 className="mb-4 text-lg font-bold sf-title">Created Quizzes</h3>
            {adminQuizzes.length === 0 ? (
              <p className="sf-subtitle text-sm">No quizzes created yet.</p>
            ) : (
              <div className="space-y-3">
                {adminQuizzes.map((quiz) => (
                  <article key={quiz.id} className="rounded-xl border border-white/10 p-4">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <h4 className="text-base font-semibold">{quiz.title}</h4>
                      <span className="rounded-full border border-white/20 px-2 py-1 text-xs">
                        {quiz.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="mb-2 text-sm sf-subtitle">{quiz.description || "No description"}</p>
                    <p className="mb-3 text-xs sf-subtitle">
                      Questions: {quiz.questionCount} | Attempts: {quiz.attemptCount}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => editQuiz(quiz.id)}
                        className="sf-btn-secondary text-xs"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteQuiz(quiz.id)}
                        className="sf-btn-secondary text-xs hover:border-rose-500/40 hover:bg-rose-500/10"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="sf-card p-4">
            <h3 className="mb-3 text-base font-bold sf-title">Available Quizzes</h3>
            {quizList.length === 0 ? (
              <p className="sf-subtitle text-sm">No active quizzes available.</p>
            ) : (
              <div className="space-y-2">
                {quizList.map((quiz) => (
                  <button
                    key={quiz.id}
                    type="button"
                    onClick={() => loadQuizById(quiz.id)}
                    className={`w-full rounded-xl border px-3 py-3 text-left ${
                      activeQuizId === quiz.id ? "border-emerald-300/60 bg-emerald-500/10" : "border-white/10"
                    }`}
                  >
                    <p className="text-sm font-semibold">{quiz.title}</p>
                    <p className="text-xs sf-subtitle">{quiz.questionCount} questions</p>
                    {typeof quiz.lastScore === "number" && (
                      <p className="mt-1 text-xs text-emerald-300">
                        Last score: {quiz.lastScore}/{quiz.lastTotalQuestions}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}

            <hr className="my-4 border-white/10" />
            <h4 className="mb-2 text-sm font-semibold">My Attempts</h4>
            {attemptHistory.length === 0 ? (
              <p className="sf-subtitle text-xs">No attempts yet.</p>
            ) : (
              <div className="space-y-2">
                {attemptHistory.slice(0, 6).map((attempt) => (
                  <div key={attempt.attemptId} className="rounded-lg border border-white/10 px-3 py-2 text-xs">
                    <p className="font-semibold">{attempt.quizTitle}</p>
                    <p className="sf-subtitle">Score: {attempt.score}/{attempt.totalQuestions}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sf-card p-5">
            {!activeQuiz ? (
              <p className="sf-subtitle text-sm">Select a quiz on the left to start.</p>
            ) : (
              <form onSubmit={submitQuiz}>
                <h3 className="text-xl font-bold sf-title">{activeQuiz.title}</h3>
                <p className="mb-4 mt-1 text-sm sf-subtitle">{activeQuiz.description || "No description"}</p>

                <div className="space-y-4">
                  {activeQuiz.questions?.map((question, idx) => (
                    <article key={question.id} className="rounded-xl border border-white/10 p-4">
                      <p className="mb-3 text-sm font-semibold">
                        {idx + 1}. {question.questionText}
                      </p>
                      <div className="space-y-2">
                        {question.options?.map((option, optionIndex) => (
                          <label key={`${question.id}-${optionIndex}`} className="flex cursor-pointer items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name={`q-${question.id}`}
                              checked={answers[question.id] === optionIndex}
                              onChange={() => selectOption(question.id, optionIndex)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button type="submit" disabled={submitting} className="sf-btn-primary">
                    {submitting ? "Submitting..." : "Submit Quiz"}
                  </button>
                  {scoreResult && (
                    <p className="text-sm font-semibold text-emerald-300">
                      Score: {scoreResult.score}/{scoreResult.totalQuestions} ({scoreResult.percentage}%)
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Quizzes;
