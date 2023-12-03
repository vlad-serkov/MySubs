package com.example.demo.subs;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubDto {
    private String nameSubs;
    private String namePlan;
    private int cost;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm", iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime dateStart;

    private String paymentMethods;
    private String email;
    public SubDto(String nameSubs, int cost, LocalDateTime dateStart) {
        this.nameSubs = nameSubs;
        this.cost = cost;
        this.dateStart=dateStart;
    }
}
