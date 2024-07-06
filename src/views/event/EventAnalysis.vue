<template>
  <div>
    <div ref="barChart" style="width: 100%; height: 400px;"></div>
    <div ref="lineChart" style="width: 100%; height: 400px;"></div>
  </div>
</template>


<script lang='ts' setup>
import type {Ref} from 'vue';
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { getEvents } from '@/services/eventService';
import { message } from 'ant-design-vue';

interface EventData {
  id: number;
  event_type: number;
  event_date: string;
  event_desc: string;
  oldperson_id: number;
  event_location: string;
  image: string;
}

const barChart: Ref<HTMLElement | null> = ref(null);
const lineChart: Ref<HTMLElement | null> = ref(null);
let barChartInstance: echarts.ECharts | null = null;
let lineChartInstance: echarts.ECharts | null = null;

const eventTypeMapping: { [key: number]: string } = {
  1: '情感检测',
  2: '入侵检测',
  3: '陌生人检测',
  4: '义工交互',
  5: '摔倒检测'
};

const formatDate = (datetime: string): string => {
  const date = new Date(datetime);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const initBarChart = (data: EventData[]) => {
  if (barChart.value && !barChartInstance) {
    barChartInstance = echarts.init(barChart.value);
  }

  const eventCounts = data.reduce((acc: Record<string, number>, item: EventData) => {
    const typeName = eventTypeMapping[item.event_type] || '未知类型';
    acc[typeName] = (acc[typeName] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.keys(eventCounts);
  const counts = Object.values(eventCounts);

  const barOption = {
    title: {
      text: '各类型事件数量统计'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: categories
    },
    yAxis: {
      type: 'value'
    },
    series: [{ data: counts, type: 'bar' }]
  };

  barChartInstance?.setOption(barOption);
};

const initLineChart = (data: EventData[]) => {
  if (lineChart.value && !lineChartInstance) {
    lineChartInstance = echarts.init(lineChart.value);
  }
  
  const seriesData: Record<string, Record<string, number>> = data.reduce((acc, item) => {
  const typeName = eventTypeMapping[item.event_type] || '未知类型';
  const date = formatDate(item.event_date);
  if (!acc[typeName]) {
    acc[typeName] = {};
  }
  if (!acc[typeName][date]) {
    acc[typeName][date] = 0;
  }
  acc[typeName][date]++;
  return acc;
}, {} as Record<string, Record<string, number>>); // 使用类型断言确保初始值类型正确

  const dates = [...new Set(data.map(d => formatDate(d.event_date)))].sort();

  const series = Object.keys(seriesData).map(key => ({
    name: key,
    type: 'line',
    data: dates.map(date => seriesData[key][date] || 0)
  }));

  const lineOption = {
    title: {
      text: '事件数量日变化统计'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: {
      type: 'value'
    },
    series: series
  };

  lineChartInstance?.setOption(lineOption);
};

const fetchEvents = async () => {
  try {
    const eventData: EventData[] = await getEvents();
    initBarChart(eventData);
    initLineChart(eventData);
  } catch (error) {
    message.error('获取事件数据失败');
  }
};

onMounted(() => {
  fetchEvents();
});
</script>




