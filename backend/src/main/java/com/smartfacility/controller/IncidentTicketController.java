package com.smartfacility.controller;

import com.smartfacility.model.IncidentTicket;
import com.smartfacility.service.IncidentTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/incident-tickets")
public class IncidentTicketController {

    @Autowired
    private IncidentTicketService ticketService;

    @GetMapping
    public List<IncidentTicket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentTicket> getTicketById(@PathVariable Long id) {
        Optional<IncidentTicket> ticket = ticketService.getTicketById(id);
        return ticket.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public IncidentTicket createTicket(@RequestBody IncidentTicket ticket, Authentication auth) {
        return ticketService.createTicket(ticket, auth.getName());
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncidentTicket> updateTicket(@PathVariable Long id, @RequestBody IncidentTicket ticketDetails, Authentication auth) {
        IncidentTicket updatedTicket = ticketService.updateTicket(id, ticketDetails, auth.getName());
        return updatedTicket != null ? ResponseEntity.ok(updatedTicket) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id, Authentication auth) {
        ticketService.deleteTicket(id, auth.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reporter/{email}")
    public List<IncidentTicket> getTicketsByReporter(@PathVariable String email) {
        return ticketService.getTicketsByReporter(email);
    }

    @GetMapping("/assignee/{email}")
    public List<IncidentTicket> getTicketsByAssignee(@PathVariable String email) {
        return ticketService.getTicketsByAssignee(email);
    }

    @GetMapping("/status/{status}")
    public List<IncidentTicket> getTicketsByStatus(@PathVariable String status) {
        return ticketService.getTicketsByStatus(status);
    }

    @GetMapping("/priority/{priority}")
    public List<IncidentTicket> getTicketsByPriority(@PathVariable String priority) {
        return ticketService.getTicketsByPriority(priority);
    }
}