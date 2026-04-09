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

    @Autowired
    private NotificationService notificationService;

    public List<IncidentTicket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<IncidentTicket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    public IncidentTicket createTicket(IncidentTicket ticket, String actorEmail) {
        ticket.setReportedBy(actorEmail);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        IncidentTicket savedTicket = ticketRepository.save(ticket);

        notificationService.notifyUser(
            actorEmail,
            "Ticket Created",
            "Your incident ticket '" + ticket.getTitle() + "' was created successfully.",
            "SUCCESS",
            "TICKET",
            savedTicket.getId()
        );
        notificationService.notifyAdmins(
            "New Incident Ticket",
            "A new incident ticket '" + ticket.getTitle() + "' was reported by " + actorEmail + ".",
            "INFO",
            "TICKET",
            savedTicket.getId(),
            actorEmail
        );

        return savedTicket;
    }

    public IncidentTicket updateTicket(Long id, IncidentTicket ticketDetails, String actorEmail) {
        Optional<IncidentTicket> optionalTicket = ticketRepository.findById(id);
        if (optionalTicket.isPresent()) {
            IncidentTicket ticket = optionalTicket.get();
            String oldStatus = ticket.getStatus();
            String oldAssignee = ticket.getAssignedTo();

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
            ticket.setReportedBy(ticket.getReportedBy());
            ticket.setUpdatedAt(LocalDateTime.now());

            IncidentTicket updatedTicket = ticketRepository.save(ticket);

            // Send notifications based on changes
            if (!oldStatus.equals(ticketDetails.getStatus())) {
                // Status changed
                notificationService.createTicketNotification(
                    ticket.getReportedBy(),
                    "Ticket Status Updated",
                    "Your ticket '" + ticket.getTitle() + "' status changed to " + ticketDetails.getStatus(),
                    "INFO",
                    id
                );
            }

            if (ticketDetails.getAssignedTo() != null && !ticketDetails.getAssignedTo().equals(oldAssignee)) {
                // Assigned to technician
                notificationService.createTicketNotification(
                    ticketDetails.getAssignedTo(),
                    "New Ticket Assigned",
                    "You have been assigned to ticket '" + ticket.getTitle() + "'",
                    "WARNING",
                    id
                );
            }

            notificationService.notifyAdmins(
                "Ticket Updated",
                "Ticket #" + id + " ('" + ticket.getTitle() + "') was updated by " + actorEmail + ".",
                "INFO",
                "TICKET",
                id,
                actorEmail
            );

            return updatedTicket;
        }
        return null;
    }

    public void deleteTicket(Long id, String actorEmail) {
        Optional<IncidentTicket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isPresent()) {
            IncidentTicket ticket = ticketOpt.get();
            notificationService.notifyUser(
                ticket.getReportedBy(),
                "Ticket Deleted",
                "Your incident ticket '" + ticket.getTitle() + "' was deleted.",
                "WARNING",
                "TICKET",
                id
            );
            notificationService.notifyAdmins(
                "Ticket Deleted",
                "Ticket #" + id + " ('" + ticket.getTitle() + "') was deleted by " + actorEmail + ".",
                "INFO",
                "TICKET",
                id,
                actorEmail
            );
        }
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