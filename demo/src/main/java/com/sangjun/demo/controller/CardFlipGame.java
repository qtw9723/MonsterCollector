package com.sangjun.demo.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/card")
public class CardFlipGame {

    private List<Integer> deck;      // 섞인 카드 더미
    private int current = 1;         // 지금 뒤집어야 하는 올바른 숫자
    private final int MAX_CARD = 20; // 카드 개수 (조절 가능)

    // 게임 시작
    @GetMapping("/start")
    public Map<String, Object> startGame() {
        deck = new ArrayList<>();

        for (int i = 1; i <= MAX_CARD; i++) deck.add(i);

        Collections.shuffle(deck);
        current = 1;

        Map<String, Object> res = new HashMap<>();
        res.put("message", "게임 시작! 총 " + MAX_CARD + "장의 카드가 섞였습니다.");
        res.put("cards", deck.stream().map(i -> "?").toList()); // 뒷면 카드들
        return res;
    }

    // 카드 선택
    @GetMapping("/flip")
    public Map<String, Object> flipCard(@RequestParam("index") int index) {

        Map<String, Object> res = new HashMap<>();

        if (deck == null) {
            res.put("error", "게임을 시작하세요! /card/start");
            return res;
        }

        if (index < 0 || index >= deck.size()) {
            res.put("error", "유효하지 않은 카드 번호입니다.");
            return res;
        }

        int number = deck.get(index); // 카드의 실제 숫자

        // 올바른 숫자를 뒤집지 못함 = 게임 오버
        if (number != current) {
            res.put("message", "잘못된 숫자! " + current + "을(를) 뒤집어야 했습니다.");
            res.put("opened", number);
            res.put("successCount", current - 1);
            res.put("gameOver", true);

            // 마지막 성공 숫자를 기반으로 몬스터 확률 전달
            res.put("rate", getDynamicRate(current - 1));
            return res;
        }

        // 올바른 숫자 성공!
        res.put("opened", number);
        res.put("message", number + " 성공!");

        current++;

        // 모든 카드 성공 → 완승
        if (current > MAX_CARD) {
            res.put("message", "모든 카드를 순서대로 맞췄습니다! 완벽!");
            res.put("successCount", MAX_CARD);
            res.put("gameOver", true);
            res.put("rate", getDynamicRate(MAX_CARD));
            return res;
        }

        res.put("gameOver", false);
        res.put("next", current); // 다음으로 뒤집어야 하는 숫자
        return res;
    }

    // 기존 확률 계산 함수 그대로 재사용
    private Map<MonsterGrade, Double> getDynamicRate(int successCount) {
        // successCount는 tryCount와 동일하게 취급
        if (successCount <= 0) successCount = 1;

        double ratio = Math.min(successCount / 15.0, 1.0);

        Map<MonsterGrade, Double> result = new HashMap<>();

        // 기존의 BASE_RATE, TARGET_RATE 사용 (네가 만든 거 그대로)
        for (MonsterGrade g : MonsterGrade.values()) {
            double base = GuessNumber.BASE_RATE.get(g);
            double target = GuessNumber.TARGET_RATE.get(g);
            result.put(g, base + (target - base) * ratio);
        }

        return result;
    }
}
