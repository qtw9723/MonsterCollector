<template>
  <v-card title="생산계획" flat>
    <v-row class="mb-3">
      <v-col cols="6">
        <v-select :items="years" v-model="selectedYear" label="연도"></v-select>
      </v-col>
      <v-col cols="6">
        <v-select :items="months" v-model="selectedMonth" label="월"></v-select>
      </v-col>
    </v-row>

    <v-btn color="success" class="mb-3" @click="loadPlan">조회하기</v-btn>
    <v-data-table
      :items="items"
      item-key="itemCode"
      class="elevation-1"
      :items-per-page="-1"  
      hide-default-footer   
    ></v-data-table>  


  </v-card>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth(),
      years: [2024, 2025, 2026],
      months: Array.from({ length: 12 }, (_, i) => i + 1),
      headers: [
  { text: '품목구분', value: 'itemType'},
        { text: '품목코드', value: 'itemCode' },
],
      items: []
    };
  },//data
  methods: {
    generateHeaders() {
      const lastDay = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
    const newHeaders = [
      { text: '품목구분', value: 'itemType', align: 'center' },
      { text: '품목코드', value: 'itemCode', align: 'center' },
    ];
    for (let day = 1; day <= lastDay; day++) {
      newHeaders.push({ text: String(day), value: `D${String(day).padStart(2, '0')}`, align: 'center' });
    }
    this.headers = [...newHeaders]; // 반드시 새 배열 할당
    },
  
    async loadPlan() {
      // 조회 시작 시 초기화
      this.items = [];
      this.generateHeaders();

      try {
        const res = await axios.get("http://192.168.2.50:8080/api/plan", {
          params: {
            year: this.selectedYear,
            month: this.selectedMonth
          }
        });

        // Vuetify 데이터테이블에 맞게 item 구성
        this.items = res.data.map(p => {
          const item = {
            itemType: p.itemType,
            itemCode: p.itemCode
          };
          // qty 배열을 D01~D31로 매핑
          p.qty.forEach((q, idx) => {
            const key = `D${String(idx + 1).padStart(2, "0")}`;
            item[key] = q;
          });
          return item;
        });
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>
