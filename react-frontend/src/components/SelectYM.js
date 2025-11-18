import * as React from 'react';
import { 
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from '@mui/material';
  
export default function SelectYM({ search }) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    const [year, setYear] = React.useState(currentYear);
    const [month, setMonth] = React.useState(currentMonth);
  
    const handleSearch = () => {
      console.log(`조회: ${year}년 ${month}월`);
      if (search) search(year, month);
    };
  
    return (
      <Box display="flex" alignItems="center" gap={2} p={2}>
        {/* 연도 선택 */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>연도</InputLabel>
          <Select
            value={year}
            label="연도"
            onChange={(e) => setYear(e.target.value)}
          >
            {[2023, 2024, 2025, 2026].map((y) => (
              <MenuItem key={y} value={y}>
                {y}년
              </MenuItem>
            ))}
          </Select>
        </FormControl>
  
        {/* 월 선택 */}
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>월</InputLabel>
          <Select
            value={month}
            label="월"
            onChange={(e) => setMonth(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <MenuItem key={m} value={m}>
                {m}월
              </MenuItem>
            ))}
          </Select>
        </FormControl>
  
        {/* 조회 버튼 */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ height: 40 }}
        >
          조회
        </Button>
      </Box>
    );
  }
  