package com.smartfacility.service;

import com.smartfacility.model.Notebook;
import com.smartfacility.model.NotebookNote;
import com.smartfacility.repository.NotebookNoteRepository;
import com.smartfacility.repository.NotebookRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotebookService {

    @Autowired
    private NotebookRepository notebookRepository;

    @Autowired
    private NotebookNoteRepository notebookNoteRepository;

    @Transactional
    public Notebook createNotebook(String title, String description, String ownerEmail, String ownerRole) {
        if (title == null || title.trim().isEmpty()) {
            throw new RuntimeException("Notebook title is required");
        }

        Notebook notebook = new Notebook();
        notebook.setTitle(title.trim());
        notebook.setDescription(description == null ? "" : description.trim());
        notebook.setOwnerEmail(ownerEmail);
        notebook.setOwnerRole(ownerRole);
        notebook.setCreatedAt(LocalDateTime.now());
        notebook.setUpdatedAt(LocalDateTime.now());

        return notebookRepository.save(notebook);
    }

    @Transactional
    public List<Notebook> getNotebooksForUser(String userEmail, boolean isAdmin) {
        if (isAdmin) {
            return notebookRepository.findAll();
        }
        return notebookRepository.findByOwnerEmailOrderByUpdatedAtDesc(userEmail);
    }

    @Transactional
    public Notebook getNotebookById(Long notebookId, String userEmail, boolean isAdmin) {
        Optional<Notebook> notebookOpt = notebookRepository.findById(notebookId);
        if (notebookOpt.isEmpty()) {
            throw new RuntimeException("Notebook not found");
        }

        Notebook notebook = notebookOpt.get();
        if (!isAdmin && !notebook.getOwnerEmail().equals(userEmail)) {
            throw new RuntimeException("You can only access your own notebooks");
        }

        return notebook;
    }

    @Transactional
    public Notebook updateNotebook(Long notebookId, String title, String description, String userEmail, boolean isAdmin) {
        Notebook notebook = getNotebookById(notebookId, userEmail, isAdmin);

        if (title == null || title.trim().isEmpty()) {
            throw new RuntimeException("Notebook title is required");
        }

        notebook.setTitle(title.trim());
        notebook.setDescription(description == null ? "" : description.trim());
        notebook.setUpdatedAt(LocalDateTime.now());
        return notebookRepository.save(notebook);
    }

    @Transactional
    public void deleteNotebook(Long notebookId, String userEmail, boolean isAdmin) {
        Notebook notebook = getNotebookById(notebookId, userEmail, isAdmin);
        notebookRepository.delete(notebook);
    }

    @Transactional
    public List<NotebookNote> getNotesForNotebook(Long notebookId, String userEmail, boolean isAdmin) {
        Notebook notebook = getNotebookById(notebookId, userEmail, isAdmin);
        return notebookNoteRepository.findByNotebookIdOrderByPageNumberAscUpdatedAtDesc(notebook.getId());
    }

    @Transactional
    public NotebookNote createNote(Long notebookId, String title, String content, Integer pageNumber, String userEmail, boolean isAdmin) {
        Notebook notebook = getNotebookById(notebookId, userEmail, isAdmin);
        if (title == null || title.trim().isEmpty()) {
            throw new RuntimeException("Note title is required");
        }

        NotebookNote note = new NotebookNote();
        note.setNotebook(notebook);
        note.setTitle(title.trim());
        note.setContent(content == null ? "" : content.trim());
        note.setPageNumber(pageNumber == null || pageNumber < 1 ? 1 : pageNumber);
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());

        notebook.setUpdatedAt(LocalDateTime.now());
        notebookRepository.save(notebook);

        return notebookNoteRepository.save(note);
    }

    @Transactional
    public NotebookNote updateNote(Long notebookId, Long noteId, String title, String content, Integer pageNumber, String userEmail, boolean isAdmin) {
        Notebook notebook = getNotebookById(notebookId, userEmail, isAdmin);

        Optional<NotebookNote> noteOpt = notebookNoteRepository.findById(noteId);
        if (noteOpt.isEmpty()) {
            throw new RuntimeException("Note not found");
        }

        NotebookNote note = noteOpt.get();
        if (!note.getNotebook().getId().equals(notebook.getId())) {
            throw new RuntimeException("Note does not belong to the selected notebook");
        }

        if (title == null || title.trim().isEmpty()) {
            throw new RuntimeException("Note title is required");
        }

        note.setTitle(title.trim());
        note.setContent(content == null ? "" : content.trim());
        note.setPageNumber(pageNumber == null || pageNumber < 1 ? 1 : pageNumber);
        note.setUpdatedAt(LocalDateTime.now());

        notebook.setUpdatedAt(LocalDateTime.now());
        notebookRepository.save(notebook);

        return notebookNoteRepository.save(note);
    }

    @Transactional
    public void deleteNote(Long notebookId, Long noteId, String userEmail, boolean isAdmin) {
        Notebook notebook = getNotebookById(notebookId, userEmail, isAdmin);

        Optional<NotebookNote> noteOpt = notebookNoteRepository.findById(noteId);
        if (noteOpt.isEmpty()) {
            throw new RuntimeException("Note not found");
        }

        NotebookNote note = noteOpt.get();
        if (!note.getNotebook().getId().equals(notebook.getId())) {
            throw new RuntimeException("Note does not belong to the selected notebook");
        }

        notebookNoteRepository.delete(note);
        notebook.setUpdatedAt(LocalDateTime.now());
        notebookRepository.save(notebook);
    }
}
