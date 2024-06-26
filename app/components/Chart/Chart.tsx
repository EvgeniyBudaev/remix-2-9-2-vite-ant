"use client";

import { memo, useEffect, useRef, useState, type FC } from 'react';
import type { Chart as ChartAntvG2 } from '@antv/g2';

import { DATA_TEST_ID } from './constants';
import type {
  EChartVariants,
  TChartCurrency,
  TChartData,
  TFormatCryptoCurrency,
  TFormatCurrency,
  TFormatNumber,
} from './types';
import { createChart, updateChart } from './utils';

export type TChartProps = {
  className?: string;
  banknote?: string;
  colorLabelXAxis?: string;
  colorLabelYAxis?: string;
  currencyCode?: string;
  currencyUnit?: string;
  data: TChartData[];
  heightChart?: number;
  listCurrenciesShow?: TChartCurrency[];
  max?: number;
  min?: number;
  theme?: string;
  tickInterval?: number;
  ticks?: number[];
  variantChart: EChartVariants;
  widthChart?: number;
  isAutoFit?: boolean;
  formatNumber?: TFormatNumber;
  formatCryptoCurrency?: TFormatCryptoCurrency;
  formatCurrency?: TFormatCurrency;
  dataTestId?: string;
};

const ChartComponent: FC<TChartProps> = ({
                                           className,
                                           banknote,
                                           colorLabelXAxis = 'black',
                                           colorLabelYAxis = 'black',
                                           currencyCode,
                                           currencyUnit,
                                           data,
                                           heightChart = 273,
                                           listCurrenciesShow,
                                           max,
                                           min,
                                           theme,
                                           tickInterval,
                                           ticks,
                                           variantChart,
                                           widthChart,
                                           isAutoFit = true,
                                           formatNumber,
                                           formatCryptoCurrency,
                                           formatCurrency,
                                           dataTestId = DATA_TEST_ID,
                                         }) => {
  const chartContainer = useRef<HTMLDivElement | null>(null);
  const [chart, setChart] = useState<ChartAntvG2 | null>(null);

  useEffect(() => {
    if (chartContainer.current) {
      if ("innerHTML" in chartContainer.current) {
        chartContainer.current.innerHTML = '';
      }
      setChart(
        createChart({
          container: chartContainer.current,
          height: heightChart,
          width: widthChart,
          autoFit: isAutoFit,
        }),
      );
    }
  }, [data, heightChart, isAutoFit, widthChart]);

  useEffect(() => {
    if (chart) {
      updateChart({
        banknote,
        chart,
        colorLabelXAxis,
        colorLabelYAxis,
        currencyCode,
        currencyUnit,
        listCurrenciesShow,
        max,
        min,
        tickInterval,
        ticks,
        variantChart,
        formatNumber,
        formatCryptoCurrency,
        formatCurrency,
        data,
      });
      chart.render();
    }
  }, [
    banknote,
    chart,
    colorLabelXAxis,
    colorLabelYAxis,
    currencyCode,
    currencyUnit,
    listCurrenciesShow,
    max,
    min,
    theme,
    tickInterval,
    ticks,
    variantChart,
    formatNumber,
    data,
    formatCryptoCurrency,
    formatCurrency,
  ]);

  return <div className={className} ref={chartContainer} data-testid={dataTestId} />;
};

export const Chart = memo(ChartComponent);