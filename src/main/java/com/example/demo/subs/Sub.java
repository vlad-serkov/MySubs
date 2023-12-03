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
    private String name;
    private String namePlan;
    private int cost;
    private LocalDateTime date;
    private String paymentMethods;
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private AppUser user;

    public Sub(String name, String namePlan, int cost, LocalDateTime date, String paymentMethods, AppUser user) {
        this.name = name;
        this.namePlan = namePlan;
        this.cost = cost;
        this.date = date;
        this.paymentMethods = paymentMethods;
        this.user = user;
    }

    public Sub() {

    }
}