package com.example.demo.subs;

import javassist.NotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(path = "api/v1/sub")
@AllArgsConstructor
public class SubController {
    SubService subService;


    @PostMapping
    @CrossOrigin(origins = "http://localhost:8082")
    public void register(@RequestBody SubDto request) throws NotFoundException {
        subService.createSub(request);
    }


    @GetMapping
    @CrossOrigin(origins = "http://localhost:8082/addsub")
    public List<SubDto> getSubs(@RequestParam("email") String email) throws NotFoundException {
        log.info("looooool"+email);
        return subService.findSubsByEmail(email);
    }

    @DeleteMapping("/{id}")
    @CrossOrigin(origins = "http://localhost:8082")
    public ResponseEntity<String> deleteSub(@PathVariable("id") Long subId) {
        try {
            subService.deleteSub(subId);
            return new ResponseEntity<>("Subscription deleted successfully", HttpStatus.OK);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
