package com.example.demo.subs;

import com.example.demo.appuser.AppUser;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
public class Sub {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nameSubs;
    private String namePlan;
    private int cost;
    private LocalDateTime dateStart;
    private String paymentMethods;
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private AppUser user;

    public Sub(String nameSubs, String namePlan, int cost, LocalDateTime dateStart,  String paymentMethods, AppUser user) {
        this.nameSubs = nameSubs;
        this.namePlan = namePlan;
        this.cost = cost;
        this.dateStart = dateStart;
        this.paymentMethods = paymentMethods;
        this.user = user;
    }

    public Sub() {

    }
}