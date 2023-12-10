package com.example.demo.gmail;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.GmailScopes;
import com.google.api.services.gmail.model.ListMessagesResponse;
import com.google.api.services.gmail.model.Message;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.google.api.services.gmail.GmailScopes.MAIL_GOOGLE_COM;

@Service
@Slf4j
public class GmailService {

    /**
     * Application name.
     */
    private static final String APPLICATION_NAME = "MySubs";

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    private static final String TOKENS_DIRECTORY_PATH = "tokens";


    private static final List<String> SCOPES = List.of(MAIL_GOOGLE_COM);
    private static final String CREDENTIALS_FILE_PATH = "/credential3.json";


    private Credential getCredentials(final NetHttpTransport HTTP_TRANSPORT)
            throws IOException {
        // Load client secrets.
        InputStream in = GmailService.class.getResourceAsStream(CREDENTIALS_FILE_PATH);
        if (in == null) {
            throw new FileNotFoundException("Resource not found: " + CREDENTIALS_FILE_PATH);
        }
        GoogleClientSecrets clientSecrets =
                GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .build();

        LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8888).build();
        Credential credential = new AuthorizationCodeInstalledApp(flow, receiver).authorize("me");
        return credential;
    }


    public List<String> getEmails() throws IOException, GeneralSecurityException {
        log.info("gg");
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        Gmail service = new Gmail.Builder(HTTP_TRANSPORT, JSON_FACTORY, getCredentials(HTTP_TRANSPORT))
                .setApplicationName(APPLICATION_NAME)
                .build();
        try {

            ListMessagesResponse response = service.users().messages().list("me").execute();

            List<Message> messages = new ArrayList<Message>(response.getMessages());

            Map<String, Boolean> subscriptionMap = new HashMap<>();
            subscriptionMap.put("Яндекс.Плюс", true);
            subscriptionMap.put("Apple Music", true);
            subscriptionMap.put("Google Play Музыка", false);
            subscriptionMap.put("Амедиатека", false);
            subscriptionMap.put("Netflix", false);
            subscriptionMap.put("IVI", false);
            subscriptionMap.put("Okko", false);
            subscriptionMap.put("Apple+", false);
            subscriptionMap.put("YouTube Premium", false);
            subscriptionMap.put("Apple Arcade", false);
            subscriptionMap.put("Okko Sport", false);
            subscriptionMap.put("Storytel", false);
            subscriptionMap.put("Bookmate", false);
            subscriptionMap.put("Grow Food", false);


            List<String> list = messages.stream().parallel().map(message -> {
                try {
                    return service.users().messages().get("me", message.getId()).execute().getSnippet();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }).collect(Collectors.toList());

            return subscriptionMap.keySet().stream().filter(key -> checkStringInList(list, key)).collect(Collectors.toList());

        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }


    public boolean checkStringInList(List<String> list, String searchString) {
        for (String str : list) {
            if (str.contains(searchString)) {
                return true;
            }
        }
        return false;
    }
}
