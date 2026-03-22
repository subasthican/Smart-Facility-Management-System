package com.smartfacility.repository;

import com.smartfacility.model.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
    List<Facility> findByTypeIgnoreCase(String type);
    List<Facility> findByStatus(Facility.FacilityStatus status);
    boolean existsByNameIgnoreCase(String name);
}
