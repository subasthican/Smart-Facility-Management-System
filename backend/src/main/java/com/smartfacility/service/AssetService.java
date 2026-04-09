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

    @Autowired
    private NotificationService notificationService;

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public List<Asset> getAssetsByFacilityId(Long facilityId) {
        return assetRepository.findByFacilityId(facilityId);
    }

    public Optional<Asset> getAssetById(Long id) {
        return assetRepository.findById(id);
    }

    public Asset createAsset(Asset asset, String actorEmail) {
        if (!facilityRepository.existsById(asset.getFacilityId())) {
            throw new RuntimeException("Facility not found for this asset");
        }
        if (assetRepository.existsBySerialNumberIgnoreCase(asset.getSerialNumber())) {
            throw new RuntimeException("Asset with this serial number already exists");
        }
        Asset saved = assetRepository.save(asset);

        notificationService.notifyUser(
                actorEmail,
                "Asset Created",
                "Asset '" + saved.getAssetName() + "' was created successfully.",
                "SUCCESS",
                "ASSET",
                saved.getId()
        );
        notificationService.notifyAdmins(
                "Asset Created",
                "Asset '" + saved.getAssetName() + "' was created by " + actorEmail + ".",
                "INFO",
                "ASSET",
                saved.getId(),
                actorEmail
        );

        return saved;
    }

    public Asset updateAsset(Long id, Asset updatedAsset, String actorEmail) {
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

        Asset saved = assetRepository.save(asset);

        notificationService.notifyUser(
            actorEmail,
            "Asset Updated",
            "Asset '" + saved.getAssetName() + "' was updated successfully.",
            "SUCCESS",
            "ASSET",
            saved.getId()
        );
        notificationService.notifyAdmins(
            "Asset Updated",
            "Asset '" + saved.getAssetName() + "' was updated by " + actorEmail + ".",
            "INFO",
            "ASSET",
            saved.getId(),
            actorEmail
        );

        return saved;
    }

        public void deleteAsset(Long id, String actorEmail) {
        if (!assetRepository.existsById(id)) {
            throw new RuntimeException("Asset not found");
        }

        notificationService.notifyUser(
            actorEmail,
            "Asset Deleted",
            "Asset #" + id + " was deleted.",
            "WARNING",
            "ASSET",
            id
        );
        notificationService.notifyAdmins(
            "Asset Deleted",
            "Asset #" + id + " was deleted by " + actorEmail + ".",
            "INFO",
            "ASSET",
            id,
            actorEmail
        );

        assetRepository.deleteById(id);
    }
}
