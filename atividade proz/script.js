// Configuração do gráfico
let regressionChart;
let dataPoints = [];
const chartContext = document.getElementById('regressionChart')?.getContext('2d');

if (chartContext) {
    regressionChart = new Chart(chartContext, {
        type: 'scatter',
        data: { datasets: [{ label: 'Pontos', data: [], backgroundColor: 'blue' }] },
        options: {
            responsive: true,
            onClick: (e) => {
                const rect = e.chart.canvas.getBoundingClientRect();
                const x = e.native.offsetX;
                const y = e.native.offsetY;
                const xValue = regressionChart.scales.x.getValueForPixel(x);
                const yValue = regressionChart.scales.y.getValueForPixel(y);
                dataPoints.push({ x: xValue, y: yValue });
                updateChart();
            },
            scales: { x: { type: 'linear', min: 0, max: 10 }, y: { min: 0, max: 10 } }
        }
    });

    document.getElementById('clearData').addEventListener('click', () => {
        dataPoints = [];
        updateChart();
    });
}

function updateChart() {
    regressionChart.data.datasets[0].data = dataPoints;
    if (dataPoints.length > 1) {
        const { slope, intercept } = linearRegression(dataPoints);
        const line = [
            { x: 0, y: intercept },
            { x: 10, y: slope * 10 + intercept }
        ];
        if (regressionChart.data.datasets.length > 1) {
            regressionChart.data.datasets[1].data = line;
        } else {
            regressionChart.data.datasets.push({
                label: 'Regressão Linear',
                type: 'line',
                data: line,
                borderColor: 'red',
                borderWidth: 2,
                fill: false
            });
        }
    }
    regressionChart.update();
}

function linearRegression(points) {
    const n = points.length;
    const sumX = points.reduce((a, p) => a + p.x, 0);
    const sumY = points.reduce((a, p) => a + p.y, 0);
    const sumXY = points.reduce((a, p) => a + p.x * p.y, 0);
    const sumX2 = points.reduce((a, p) => a + p.x * p.x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
}
