package com.tech.store.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ping")
public class PingController {

    @GetMapping
    public ResponseEntity<Void> getPing() {
        return ResponseEntity.ok().build();
    }

    @RequestMapping(method = RequestMethod.HEAD)
    public ResponseEntity<Void> headPing() {
        return ResponseEntity.ok().build();
    }
}
