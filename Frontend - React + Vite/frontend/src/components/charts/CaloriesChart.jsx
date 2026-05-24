import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { useTheme } from '../../contexts/ThemeContext'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const CaloriesChart = ({ data = [] }) => {
  const { isDark } = useTheme()
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const textColor = isDark ? '#9ca3af' : '#6b7280'

  const chartData = {
    labels: data.map(d => d._id),
    datasets: [{
      label: 'แคลอรี่ (kcal)',
      data: data.map(d => d.calories),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34,197,94,0.1)',
      borderWidth: 2.5,
      pointBackgroundColor: '#22c55e',
      pointRadius: 4,
      fill: true,
      tension: 0.4,
    }]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: textColor, font: { family: 'Inter' } } },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: textColor } },
      y: { grid: { color: gridColor }, ticks: { color: textColor } },
    },
  }

  return <Line data={chartData} options={options} />
}

export default CaloriesChart