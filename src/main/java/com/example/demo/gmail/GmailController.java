package com.example.demo.gmail;

import com.example.demo.appuser.AppUser;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class GmailController {
    private final GmailService gmailService;

    @GetMapping("/test/message")
    public List<String> getAllUsers() throws GeneralSecurityException, IOException {
        return gmailService.getEmails();
    }
}
