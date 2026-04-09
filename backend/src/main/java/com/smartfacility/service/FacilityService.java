package com.smartfacility.service;

import com.smartfacility.model.Facility;
import com.smartfacility.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacilityService {

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private NotificationService notificationService;

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public Optional<Facility> getFacilityById(Long id) {
        return facilityRepository.findById(id);
    }

    public Facility createFacility(Facility facility, String actorEmail) {
        if (facilityRepository.existsByNameIgnoreCase(facility.getName())) {
            throw new RuntimeException("Facility with this name already exists");
        }
        Facility saved = facilityRepository.save(facility);

        notificationService.notifyUser(
                actorEmail,
                "Facility Created",
                "Facility '" + saved.getName() + "' was created successfully.",
                "SUCCESS",
                "FACILITY",
                saved.getId()
        );
        notificationService.notifyAdmins(
                "Facility Created",
                "Facility '" + saved.getName() + "' was created by " + actorEmail + ".",
                "INFO",
                "FACILITY",
                saved.getId(),
                actorEmail
        );

        return saved;
    }

    public Facility updateFacility(Long id, Facility updatedFacility, String actorEmail) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found"));

        facility.setName(updatedFacility.getName());
        facility.setType(updatedFacility.getType());
        facility.setLocation(updatedFacility.getLocation());
        facility.setCapacity(updatedFacility.getCapacity());
        facility.setStatus(updatedFacility.getStatus());
        facility.setDescription(updatedFacility.getDescription());

        Facility saved = facilityRepository.save(facility);

        notificationService.notifyUser(
            actorEmail,
            "Facility Updated",
            "Facility '" + saved.getName() + "' was updated successfully.",
            "SUCCESS",
            "FACILITY",
            saved.getId()
        );
        notificationService.notifyAdmins(
            "Facility Updated",
            "Facility '" + saved.getName() + "' was updated by " + actorEmail + ".",
            "INFO",
            "FACILITY",
            saved.getId(),
            actorEmail
        );

        return saved;
    }

        public void deleteFacility(Long id, String actorEmail) {
        if (!facilityRepository.existsById(id)) {
            throw new RuntimeException("Facility not found");
        }

        notificationService.notifyUser(
            actorEmail,
            "Facility Deleted",
            "Facility #" + id + " was deleted.",
            "WARNING",
            "FACILITY",
            id
        );
        notificationService.notifyAdmins(
            "Facility Deleted",
            "Facility #" + id + " was deleted by " + actorEmail + ".",
            "INFO",
            "FACILITY",
            id,
            actorEmail
        );

        facilityRepository.deleteById(id);
    }
}
