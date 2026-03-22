package com.smartfacility.repository;

import com.smartfacility.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByFacilityId(Long facilityId);
    List<Asset> findByCategoryIgnoreCase(String category);
    boolean existsBySerialNumberIgnoreCase(String serialNumber);
}
