package com.sangjun.demo.controller;

import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
public class GuessNumber {

    /* ------------------------ 몬스터 풀 ------------------------ */
    private static final Map<MonsterGrade, List<Monster>> MONSTER_POOL = Map.of(
        MonsterGrade.NORMAL, List.of(
            new Monster("슬라임", MonsterGrade.NORMAL, 3),
            new Monster("고블린", MonsterGrade.NORMAL, 4),
            new Monster("박쥐", MonsterGrade.NORMAL, 2)
        ),
        MonsterGrade.RARE, List.of(
            new Monster("스켈레톤", MonsterGrade.RARE, 7),
            new Monster("늑대", MonsterGrade.RARE, 6)
        ),
        MonsterGrade.EPIC, List.of(
            new Monster("미믹", MonsterGrade.EPIC, 15),
            new Monster("리치", MonsterGrade.EPIC, 18)
        ),
        MonsterGrade.LEGENDARY, List.of(
            new Monster("드래곤", MonsterGrade.LEGENDARY, 50)
        )
    );

    /* ------------------------ 등급 변환(재료 소환용) ------------------------ */
    private static final Map<MonsterGrade, MonsterGrade> MATERIAL_UPGRADE_MAP = Map.of(
        MonsterGrade.NORMAL, MonsterGrade.RARE,
        MonsterGrade.RARE, MonsterGrade.EPIC,
        MonsterGrade.EPIC, MonsterGrade.LEGENDARY,
        MonsterGrade.LEGENDARY, MonsterGrade.LEGENDARY
    );

    /* ------------------------ BASE → TARGET 확률 ------------------------ */
    private static final Map<MonsterGrade, Integer> BASE_RATE = Map.of(
        MonsterGrade.NORMAL, 5,
        MonsterGrade.RARE, 10,
        MonsterGrade.EPIC, 60,
        MonsterGrade.LEGENDARY, 25
    );

    private static final Map<MonsterGrade, Integer> TARGET_RATE = Map.of(
        MonsterGrade.NORMAL, 70,
        MonsterGrade.RARE, 25,
        MonsterGrade.EPIC, 4,
        MonsterGrade.LEGENDARY, 1
    );

    private static final int MAX_TRIES = 15;
    private static final int FORCE_NORMAL_TRY = 10;


    /* ------------------------ 동적 확률 계산 ------------------------ */
    private Map<MonsterGrade, Double> getDynamicRate(int tryCount) {

        if (tryCount >= MAX_TRIES) {
            Map<MonsterGrade, Double> r = new HashMap<>();
            TARGET_RATE.forEach((k, v) -> r.put(k, v.doubleValue()));
            return r;
        }

        if (tryCount >= FORCE_NORMAL_TRY) {
            return Map.of(
                MonsterGrade.NORMAL, 100.0,
                MonsterGrade.RARE, 0.0,
                MonsterGrade.EPIC, 0.0,
                MonsterGrade.LEGENDARY, 0.0
            );
        }

        double ratio = (double) tryCount / FORCE_NORMAL_TRY;
        Map<MonsterGrade, Double> temp = new EnumMap<>(MonsterGrade.class);

        for (MonsterGrade g : MonsterGrade.values()) {
            double base = BASE_RATE.get(g);
            double target = TARGET_RATE.get(g);
            double value = base + (target - base) * ratio;
            temp.put(g, Math.max(value, 0));
        }

        double sum = temp.values().stream().mapToDouble(Double::doubleValue).sum();
        Map<MonsterGrade, Double> normalized = new EnumMap<>(MonsterGrade.class);

        for (MonsterGrade g : MonsterGrade.values()) {
            normalized.put(g, (temp.get(g) / sum) * 100);
        }

        return normalized;
    }


    /* ------------------------ 등급 랜덤 선택 ------------------------ */
    private MonsterGrade pickGrade(int tryCount) {
        Map<MonsterGrade, Double> rate = getDynamicRate(tryCount);

        double roll = Math.random() * 100;
        double sum = 0;

        for (MonsterGrade g : MonsterGrade.values()) {
            sum += rate.get(g);
            if (roll <= sum) return g;
        }
        return MonsterGrade.NORMAL;
    }

    private Monster getRandomMonsterByGrade(MonsterGrade grade) {
        List<Monster> list = MONSTER_POOL.get(grade);
        return list.get(new Random().nextInt(list.size()));
    }

    private Monster getRandomMonster(int tryCount) {
        MonsterGrade g = pickGrade(tryCount);
        return getRandomMonsterByGrade(g);
    }

    /* ------------------------ 숫자 게임 ------------------------ */
    private int targetNumber = new Random().nextInt(100) + 1;
    private int tryCount = 0;

    @GetMapping("/guess")
    public Map<String, Object> guessNumber(@RequestParam("number") int number) {
        Map<String, Object> response = new HashMap<>();
        tryCount++;

        if (tryCount > MAX_TRIES) {
            response.put("message", "15번 실패! 게임 오버!");
            tryCount = 0;
            targetNumber = new Random().nextInt(100) + 1;
            return response;
        }

        if (number < targetNumber) {
            response.put("message", "너무 낮아요!");
            return response;
        } else if (number > targetNumber) {
            response.put("message", "너무 높아요!");
            return response;
        } else {
            Monster m = getRandomMonster(tryCount);
            response.put("message", "정답입니다!");
            response.put("monster", m);
            response.put("tryCount", tryCount);

            targetNumber = new Random().nextInt(100) + 1;
            tryCount = 0;
            return response;
        }
    }

    /* ------------------------ 재료로 상위 등급 몬스터 소환 ------------------------ */
    @GetMapping("/material/spawn")
    public Monster spawnByMaterial(@RequestParam("materialGrade") String materialGrade) {

        MonsterGrade baseGrade = MonsterGrade.valueOf(materialGrade.toUpperCase());

        // 다음 등급 결정
        MonsterGrade nextGrade = MATERIAL_UPGRADE_MAP.getOrDefault(baseGrade, MonsterGrade.NORMAL);

        // 해당 등급에서 랜덤 몬스터 반환
        return getRandomMonsterByGrade(nextGrade);
    }


    /* ------------------------ 현재 확률 조회 ------------------------ */
    @GetMapping("/rate")
    public Map<MonsterGrade, Double> getCurrentRate() {
        return getDynamicRate(tryCount);
    }

    /* ------------------------ 몬스터 저장 ------------------------ */
    private final List<Monster> myMonsters = new ArrayList<>();

    @PostMapping("/saveMonster")
    public void saveMonster(@RequestBody Monster monster) {
        myMonsters.add(monster);
    }

    @GetMapping("/myMonsters")
    public List<Monster> getMyMonsters() {
        return myMonsters;
    }
}
