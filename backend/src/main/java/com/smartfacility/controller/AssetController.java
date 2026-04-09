package com.smartfacility.controller;

import com.smartfacility.model.Asset;
import com.smartfacility.service.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/assets")
@CrossOrigin(origins = "http://localhost:3000")
public class AssetController {

    @Autowired
    private AssetService assetService;

    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets() {
        return ResponseEntity.ok(assetService.getAllAssets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAssetById(@PathVariable Long id) {
        return assetService.getAssetById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body(error("Asset not found")));
    }

    @GetMapping("/facility/{facilityId}")
    public ResponseEntity<List<Asset>> getAssetsByFacility(@PathVariable Long facilityId) {
        return ResponseEntity.ok(assetService.getAssetsByFacilityId(facilityId));
    }

    @PostMapping
    public ResponseEntity<?> createAsset(@RequestBody Asset asset, Authentication auth) {
        try {
            return ResponseEntity.ok(assetService.createAsset(asset, auth.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAsset(@PathVariable Long id, @RequestBody Asset asset, Authentication auth) {
        try {
            return ResponseEntity.ok(assetService.updateAsset(id, asset, auth.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAsset(@PathVariable Long id, Authentication auth) {
        try {
            assetService.deleteAsset(id, auth.getName());
            return ResponseEntity.ok(success("Asset deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    private Map<String, String> error(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", message);
        return response;
    }

    private Map<String, String> success(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return response;
    }
}
