package com.smartfacility.service;

import com.smartfacility.model.Asset;
import com.smartfacility.repository.AssetRepository;
import com.smartfacility.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssetService {

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public List<Asset> getAssetsByFacilityId(Long facilityId) {
        return assetRepository.findByFacilityId(facilityId);
    }

    public Optional<Asset> getAssetById(Long id) {
        return assetRepository.findById(id);
    }

    public Asset createAsset(Asset asset) {
        if (!facilityRepository.existsById(asset.getFacilityId())) {
            throw new RuntimeException("Facility not found for this asset");
        }
        if (assetRepository.existsBySerialNumberIgnoreCase(asset.getSerialNumber())) {
            throw new RuntimeException("Asset with this serial number already exists");
        }
        return assetRepository.save(asset);
    }

    public Asset updateAsset(Long id, Asset updatedAsset) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        if (!facilityRepository.existsById(updatedAsset.getFacilityId())) {
            throw new RuntimeException("Facility not found for this asset");
        }

        asset.setAssetName(updatedAsset.getAssetName());
        asset.setCategory(updatedAsset.getCategory());
        asset.setSerialNumber(updatedAsset.getSerialNumber());
        asset.setCondition(updatedAsset.getCondition());
        asset.setFacilityId(updatedAsset.getFacilityId());

        return assetRepository.save(asset);
    }

    public void deleteAsset(Long id) {
        if (!assetRepository.existsById(id)) {
            throw new RuntimeException("Asset not found");
        }
        assetRepository.deleteById(id);
    }
}
