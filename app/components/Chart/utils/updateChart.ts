import type { Chart } from '@antv/g2';

import { EAmount } from '../enums';
import { getCommonXAxisProps } from './getCommonXAxisProps';
import { getCommonYAxisProps } from './getCommonYAxisProps';
import type {
  TChartCurrency,
  TChartData,
  TChartVariant1,
  TFormatCryptoCurrency,
  TFormatCurrency,
  TFormatNumber,
} from '../types';
import { EChartVariants } from '../types';

export function updateChart({
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
                            }: {
  banknote?: string;
  chart: Chart;
  colorLabelXAxis: string;
  colorLabelYAxis: string;
  currencyCode?: string;
  currencyUnit?: string;
  listCurrenciesShow?: TChartCurrency[];
  max?: number;
  min?: number;
  tickInterval?: number;
  ticks?: number[];
  variantChart: EChartVariants;
  formatNumber?: TFormatNumber;
  data: TChartData[];
  formatCryptoCurrency?: TFormatCryptoCurrency;
  formatCurrency?: TFormatCurrency;
}) {
  const START_Y_AXIS_FACTOR = 0.99;
  min = min && min * START_Y_AXIS_FACTOR;
  const minVisibleValue = (2 * Math.abs((max || 100) - (min || 0))) / 100;
  chart.axis('month', getCommonXAxisProps(colorLabelXAxis));

  chart.tooltip({
    itemTpl:
      '<li class="g2-tooltip-list-item"><div style="margin-bottom: 4px">{crypto}</div><div>{fiat}</div></li>',
  });

  const checkCurrency = (type: EAmount) => {
    if (!listCurrenciesShow) return false;
    return listCurrenciesShow.includes(type);
  };

  const valuesSize = chart.width / data.length > 16 ? 16 : 8;

  const mapSingleValueData = (data: TChartVariant1[]) => {
    return data.map((value) => ({
      ...value,
      valueAdjusted:
        value.value &&
        Math.sign(value.value.crypto) * Math.max(Math.abs(value.value.crypto), minVisibleValue),
    }));
  };

  const singleValueTooltip = [
    'value',
    (value: { crypto: number; fiat: number }) => {
      return {
        name: 'value',
        ...(checkCurrency(EAmount.Crypto) && {
          crypto: `${currencyUnit}${
            formatCryptoCurrency?.(value.crypto, banknote ?? '') ?? value.crypto
          }`,
        }),
        ...(checkCurrency(EAmount.Fiat) && {
          fiat: `${currencyUnit}${formatCurrency?.(value.fiat, currencyCode ?? '') ?? value.fiat}`,
        }),
      };
    },
  ] as const;

  if (variantChart === EChartVariants.Variant1) {
    chart.data(mapSingleValueData(data));
    chart.axis('valueAdjusted', getCommonYAxisProps(colorLabelYAxis));
    chart.scale('valueAdjusted', {
      ticks,
      min,
      max,
      nice: true,
      formatter: (val) => {
        return `${currencyUnit}${formatNumber ? formatNumber(val) : val} ${banknote}`;
      },
    });
    chart.legend(false);

    chart
      .interval()
      .position('month*valueAdjusted')
      .tooltip(...singleValueTooltip)
      .size({ values: [valuesSize] })
      .style({ radius: 4 })
      .color('valueAdjusted', () => 'black')
      .adjust([{ type: 'dodge', dodgeBy: 'part', marginRatio: 1 }]);
  }
}