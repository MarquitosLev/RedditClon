package com.RedditClon_Backend.RedditClon_Backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
public class RedditClonController {
    @GetMapping("/ping")

    public String test() {
        String ok = "OK";
        return ok;
    }
}
