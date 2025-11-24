package com.sangjun.demo.controller;

import java.util.*;
import java.util.stream.Collectors;


import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/card")
public class CardGame {

    private List<Integer> deck = new ArrayList<>();
    private Set<Integer> flipped = new HashSet<>();
    private int score = 0;

    @GetMapping("/start")
    public Map<String, Object> startGame() {
        deck.clear();
        flipped.clear();
        score = 0;

        Random rand = new Random();
        for (int i = 0; i < 36; i++) {
            deck.add(rand.nextInt(100) + 1); // 1~10 점수
        }

        List<String> masked = new ArrayList<>();
        for (int i = 0; i < deck.size(); i++) masked.add("?");

        return Map.of(
            "cards", masked,
            "score", score
        );
    }

    @GetMapping("/flip")
    public Map<String, Object> flipCard(@RequestParam int index) {
        if (index < 0 || index >= deck.size() || flipped.contains(index)) {
            return Map.of("message", "잘못된 선택 또는 이미 오픈됨", "score", score);
        }

        int value = deck.get(index);
        score += value;
        flipped.add(index);

        List<String> current = new ArrayList<>();
        for (int i = 0; i < deck.size(); i++) {
            if (flipped.contains(i)) current.add(String.valueOf(deck.get(i)));
            else current.add("?");
        }

        return Map.of(
            "openedIndex", index,
            "openedValue", value,
            "cards", current,
            "score", score,
            "message", value + " 점 획득!"
        );
    }
}
