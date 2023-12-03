package com.example.demo.subs;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubRepository
        extends JpaRepository<Sub, Long> {

}