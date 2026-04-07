import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer]);

import { MONTHS } from '../utils/constants';

interface ChartProps {
  data: number[];
  title: string;
}

export const Chart: React.FC<ChartProps> = ({ data, title }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    // Component Mount logic to configure the ECharts container
    if (!chartRef.current) return;

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current);
    }

    // Set or Update the properties
    const option: echarts.EChartsCoreOption = {
      title: {
        text: title,
        left: 'center',
        textStyle: { color: '#ffffff', fontWeight: 600, fontSize: 18 }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        textStyle: { color: '#f8fafc' },
        borderWidth: 0,
      },
      grid: {
        left: '2%',
        right: '4%',
        bottom: '5%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: MONTHS,
        axisLine: { lineStyle: { color: '#475569' } },
        axisLabel: { color: '#cbd5e1', margin: 12 }
      },
      yAxis: {
        type: 'value',
        name: 'Average RSP',
        nameTextStyle: { color: '#94a3b8', padding: [0, 0, 10, 0] },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#334155', type: 'dashed' } },
        axisLabel: { color: '#cbd5e1' }
      },
      series: [
        {
          name: 'Average RSP',
          type: 'bar',
          data,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#60a5fa' },
              { offset: 1, color: '#2563eb' } 
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          label: {
            show: true,
            position: 'top',
            color: '#e2e8f0',
            formatter: (params: any) => {
              return params.value === 0 ? '' : params.value as string;
            }
          },
          animationDuration: 800,
          animationEasing: 'cubicOut'
        }
      ]
    };

    instanceRef.current.setOption(option);
  }, [data, title]);

  // Handle Resize correctly without losing memory
  useEffect(() => {
    if (!chartRef.current) return;
    
    let timeoutId: ReturnType<typeof setTimeout>;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => instanceRef.current?.resize(), 100);
    });
    
    resizeObserver.observe(chartRef.current);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, []);

  // Cleanup chart completely on unmount
  useEffect(() => {
    return () => {
      if (instanceRef.current) {
        instanceRef.current.dispose();
        instanceRef.current = null;
      }
    };
  }, []);

  return <div className="chart-wrapper" ref={chartRef} style={{ width: '100%', height: '500px' }} />;
};
