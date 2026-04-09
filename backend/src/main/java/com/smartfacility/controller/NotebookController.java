package com.smartfacility.controller;

import com.smartfacility.model.Notebook;
import com.smartfacility.model.NotebookNote;
import com.smartfacility.service.NotebookService;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/notebooks")
@CrossOrigin(origins = "http://localhost:3000")
public class NotebookController {

    @Autowired
    private NotebookService notebookService;

    @GetMapping
    public ResponseEntity<?> getMyNotebooks(Authentication auth) {
        try {
            boolean isAdmin = hasRole(auth, "ROLE_ADMIN");
            List<Map<String, Object>> data = notebookService.getNotebooksForUser(auth.getName(), isAdmin)
                    .stream()
                    .map(this::mapNotebookSummary)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(data);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createNotebook(@RequestBody NotebookPayload request, Authentication auth) {
        try {
            String role = auth.getAuthorities().stream().findFirst().map(GrantedAuthority::getAuthority).orElse("ROLE_STUDENT");
            Notebook notebook = notebookService.createNotebook(request.title(), request.description(), auth.getName(), role.replace("ROLE_", ""));
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Notebook created successfully");
            response.put("notebookId", notebook.getId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    @GetMapping("/{notebookId}")
    public ResponseEntity<?> getNotebookDetails(@PathVariable Long notebookId, Authentication auth) {
        try {
            boolean isAdmin = hasRole(auth, "ROLE_ADMIN");
            Notebook notebook = notebookService.getNotebookById(notebookId, auth.getName(), isAdmin);

            Map<String, Object> response = mapNotebookSummary(notebook);
            response.put("notes", notebookService.getNotesForNotebook(notebookId, auth.getName(), isAdmin)
                    .stream()
                    .map(this::mapNote)
                    .collect(Collectors.toList()));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    @PutMapping("/{notebookId}")
    public ResponseEntity<?> updateNotebook(@PathVariable Long notebookId, @RequestBody NotebookPayload request, Authentication auth) {
        try {
            boolean isAdmin = hasRole(auth, "ROLE_ADMIN");
            Notebook notebook = notebookService.updateNotebook(notebookId, request.title(), request.description(), auth.getName(), isAdmin);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Notebook updated successfully");
            response.put("notebookId", notebook.getId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    @DeleteMapping("/{notebookId}")
    public ResponseEntity<?> deleteNotebook(@PathVariable Long notebookId, Authentication auth) {
        try {
            boolean isAdmin = hasRole(auth, "ROLE_ADMIN");
            notebookService.deleteNotebook(notebookId, auth.getName(), isAdmin);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Notebook deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    @PostMapping("/{notebookId}/notes")
    public ResponseEntity<?> createNote(@PathVariable Long notebookId, @RequestBody NotePayload request, Authentication auth) {
        try {
            boolean isAdmin = hasRole(auth, "ROLE_ADMIN");
            NotebookNote note = notebookService.createNote(notebookId, request.title(), request.content(), request.pageNumber(), auth.getName(), isAdmin);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Note created successfully");
            response.put("noteId", note.getId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    @PutMapping("/{notebookId}/notes/{noteId}")
    public ResponseEntity<?> updateNote(
            @PathVariable Long notebookId,
            @PathVariable Long noteId,
            @RequestBody NotePayload request,
            Authentication auth
    ) {
        try {
            boolean isAdmin = hasRole(auth, "ROLE_ADMIN");
            notebookService.updateNote(notebookId, noteId, request.title(), request.content(), request.pageNumber(), auth.getName(), isAdmin);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Note updated successfully");
            response.put("noteId", noteId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    @DeleteMapping("/{notebookId}/notes/{noteId}")
    public ResponseEntity<?> deleteNote(@PathVariable Long notebookId, @PathVariable Long noteId, Authentication auth) {
        try {
            boolean isAdmin = hasRole(auth, "ROLE_ADMIN");
            notebookService.deleteNote(notebookId, noteId, auth.getName(), isAdmin);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Note deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    private Map<String, Object> mapNotebookSummary(Notebook notebook) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", notebook.getId());
        item.put("title", notebook.getTitle());
        item.put("description", notebook.getDescription());
        item.put("ownerEmail", notebook.getOwnerEmail());
        item.put("ownerRole", notebook.getOwnerRole());
        item.put("createdAt", notebook.getCreatedAt());
        item.put("updatedAt", notebook.getUpdatedAt());
        item.put("noteCount", notebook.getNotes() == null ? 0 : notebook.getNotes().size());
        return item;
    }

    private Map<String, Object> mapNote(NotebookNote note) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", note.getId());
        item.put("title", note.getTitle());
        item.put("content", note.getContent());
        item.put("pageNumber", note.getPageNumber());
        item.put("createdAt", note.getCreatedAt());
        item.put("updatedAt", note.getUpdatedAt());
        return item;
    }

    private Map<String, String> error(String message) {
        Map<String, String> err = new HashMap<>();
        err.put("error", message);
        return err;
    }

    private boolean hasRole(Authentication auth, String role) {
        for (GrantedAuthority authority : auth.getAuthorities()) {
            if (role.equals(authority.getAuthority())) {
                return true;
            }
        }
        return false;
    }

    public record NotebookPayload(String title, String description) {
    }

    public record NotePayload(String title, String content, Integer pageNumber) {
    }
}
