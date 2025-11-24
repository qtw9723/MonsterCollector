package com.sangjun.demo.controller;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/card")
public class CardGame {

    private List<Integer> deck = new ArrayList<>();
    private int score = 0;

    @GetMapping("/start")
    public Map<String, Object> startGame() {
        deck.clear();
        score = 0;

        // 카드 1~10 랜덤 숫자 생성
        Random rand = new Random();
        for (int i = 0; i < 10; i++) {
            deck.add(rand.nextInt(10) + 1); // 1~10
        }

        List<String> masked = deck.stream().map(d -> "?").collect(Collectors.toList());

        return Map.of(
            "cards", masked,
            "message", "게임 시작! 카드를 선택하여 점수를 모으세요.",
            "score", score
        );
    }

    @GetMapping("/flip")
    public Map<String, Object> flipCard(@RequestParam int index) {
        if (index < 0 || index >= deck.size()) {
            return Map.of("message", "잘못된 카드 선택", "score", score);
        }

        int value = deck.get(index);
        score += value;

        // 카드 뒤집기 처리
        List<String> current = deck.stream()
                                   .map(d -> d == value ? String.valueOf(d) : "?")
                                   .collect(Collectors.toList());

        return Map.of(
            "opened", value,
            "cards", current,
            "score", score,
            "message", value + " 점 획득!"
        );
    }
}
