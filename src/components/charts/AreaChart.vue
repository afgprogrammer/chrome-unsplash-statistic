<template>
    <div>
        <apexchart
            type="area"
            :options="chartOptions"
            :series="series"
        ></apexchart>
    </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
    props: ['dateList', 'values'],

    components: {
        apexchart: VueApexCharts
    },

    data() {
        return {
            chartOptions: {
                fill: {
                    colors: undefined,
                    opacity: 0,
                    type: 'solid'
                },
                grid: {
                    show: false
                },
                chart: {
                    height: 200,
                    type: 'area',
                    toolbar: {
                        show: false,
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    colors: ['#000'],
                    curve: 'smooth',
                    width: 2
                },
                yaxis: {
                    labels: {
                        show: false
                    }
                },
                xaxis: {
                    labels: {
                        show: false
                    },
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    },
                    crosshairs: {
                        show: true,
                    },
                    tooltip: {
                        enabled: false,
                    },
                    type: 'datetime',
                    categories: this.dateList
                },
                tooltip: {
                    intersect: false,
                    inverseOrder: false,
                    enabledOnSeries: true,
                    theme: 'dark',
                    followCursor: false,
                    marker: {
                        show: false,
                    },
                    y: {
                        formatter: undefined,
                        title: {
                            formatter: (seriesName) => '',
                        },
                    },
                    z: {
                        show: false,
                    },
                    x: {
                        show: true,
                        format: 'dd MMM y',
                    }
                },
            },
            series: [{
                data: this.values
            }],
        }
    },
}
</script>
