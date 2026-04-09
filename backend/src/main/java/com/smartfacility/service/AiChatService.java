package com.smartfacility.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AiChatService {

    @Value("${ai.ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${ai.ollama.model:llama3.2}")
    private String ollamaModel;

    public Map<String, Object> chat(String prompt) {
        if (prompt == null || prompt.isBlank()) {
            throw new RuntimeException("Prompt cannot be empty");
        }

        RestTemplate restTemplate = new RestTemplate();
        String endpoint = ollamaBaseUrl + "/api/generate";

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", ollamaModel);
        payload.put("prompt", prompt);
        payload.put("stream", false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(endpoint, request, Map.class);
            Map<String, Object> body = response.getBody();

            if (body == null || body.get("response") == null) {
                throw new RuntimeException("No response from Ollama");
            }

            Map<String, Object> result = new HashMap<>();
            result.put("response", body.get("response"));
            result.put("model", body.getOrDefault("model", ollamaModel));
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to connect to Ollama. Ensure Ollama is running locally.");
        }
    }
}
