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

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public Optional<Facility> getFacilityById(Long id) {
        return facilityRepository.findById(id);
    }

    public Facility createFacility(Facility facility) {
        if (facilityRepository.existsByNameIgnoreCase(facility.getName())) {
            throw new RuntimeException("Facility with this name already exists");
        }
        return facilityRepository.save(facility);
    }

    public Facility updateFacility(Long id, Facility updatedFacility) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found"));

        facility.setName(updatedFacility.getName());
        facility.setType(updatedFacility.getType());
        facility.setLocation(updatedFacility.getLocation());
        facility.setCapacity(updatedFacility.getCapacity());
        facility.setStatus(updatedFacility.getStatus());
        facility.setDescription(updatedFacility.getDescription());

        return facilityRepository.save(facility);
    }

    public void deleteFacility(Long id) {
        if (!facilityRepository.existsById(id)) {
            throw new RuntimeException("Facility not found");
        }
        facilityRepository.deleteById(id);
    }
}
