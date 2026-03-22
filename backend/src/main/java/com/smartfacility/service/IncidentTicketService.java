package com.smartfacility.service;

import com.smartfacility.model.IncidentTicket;
import com.smartfacility.repository.IncidentTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class IncidentTicketService {

    @Autowired
    private IncidentTicketRepository ticketRepository;

    public List<IncidentTicket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<IncidentTicket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    public IncidentTicket createTicket(IncidentTicket ticket) {
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public IncidentTicket updateTicket(Long id, IncidentTicket ticketDetails) {
        Optional<IncidentTicket> optionalTicket = ticketRepository.findById(id);
        if (optionalTicket.isPresent()) {
            IncidentTicket ticket = optionalTicket.get();
            ticket.setTitle(ticketDetails.getTitle());
            ticket.setDescription(ticketDetails.getDescription());
            ticket.setLocation(ticketDetails.getLocation());
            ticket.setResourceType(ticketDetails.getResourceType());
            ticket.setResourceId(ticketDetails.getResourceId());
            ticket.setPriority(ticketDetails.getPriority());
            ticket.setStatus(ticketDetails.getStatus());
            ticket.setAssignedTo(ticketDetails.getAssignedTo());
            ticket.setTechnicianNotes(ticketDetails.getTechnicianNotes());
            ticket.setImageUrl(ticketDetails.getImageUrl());
            ticket.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(ticket);
        }
        return null;
    }

    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }

    public List<IncidentTicket> getTicketsByReporter(String reportedBy) {
        return ticketRepository.findByReportedBy(reportedBy);
    }

    public List<IncidentTicket> getTicketsByAssignee(String assignedTo) {
        return ticketRepository.findByAssignedTo(assignedTo);
    }

    public List<IncidentTicket> getTicketsByStatus(String status) {
        return ticketRepository.findByStatus(status);
    }

    public List<IncidentTicket> getTicketsByPriority(String priority) {
        return ticketRepository.findByPriority(priority);
    }
}