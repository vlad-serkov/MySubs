package com.example.demo.subs;

import com.example.demo.appuser.AppUser;
import com.example.demo.appuser.AppUserRepository;
import javassist.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubService {
    private final SubRepository subRepository;
    private final AppUserRepository userRepository;

    public void createSub(SubDto subDto) throws NotFoundException {
        AppUser user = userRepository.findByEmail(subDto.getEmail())
                .orElseThrow(()->new NotFoundException(String.format("user with this email: %s not found", subDto.getEmail())));
        subRepository.save(new Sub(subDto.getNameSubs(),
                subDto.getNamePlan(),
                subDto.getCost(),
                subDto.getDateStart(),
                subDto.getPaymentMethods(),
                user));
    }
    public List<SubDto> findSubsByEmail(String email) throws NotFoundException {
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(()->new NotFoundException(String.format("user with this email: %s not found", email)));
        List<SubDto> subs = new ArrayList<>();
        user.getSubs().forEach( sub -> {
            for (int i = 0; i < 12; i++) {
                subs.add(new SubDto(sub.getNameSubs(),
                        sub.getCost(),
                        sub.getDateStart().plusDays(i*30)));
            }
        });
        return subs;
    }
}
