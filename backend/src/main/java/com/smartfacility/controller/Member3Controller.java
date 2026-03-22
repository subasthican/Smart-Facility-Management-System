package com.smartfacility.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/member3")
public class Member3Controller {

    @GetMapping("/feature")
    public String getMember3Feature() {
        return "Member 3 Feature Data";
    }
}