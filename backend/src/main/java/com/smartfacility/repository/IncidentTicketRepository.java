package com.smartfacility.repository;

import com.smartfacility.model.IncidentTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentTicketRepository extends JpaRepository<IncidentTicket, Long> {

    List<IncidentTicket> findByReportedBy(String reportedBy);
    List<IncidentTicket> findByAssignedTo(String assignedTo);
    List<IncidentTicket> findByStatus(String status);
    List<IncidentTicket> findByPriority(String priority);
}