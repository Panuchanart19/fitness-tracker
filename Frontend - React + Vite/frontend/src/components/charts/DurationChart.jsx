import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend
} from 'chart.js'
import { useTheme } from '../../contexts/ThemeContext'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const DurationChart = ({ data = [] }) => {
  const { isDark } = useTheme()
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const textColor = isDark ? '#9ca3af' : '#6b7280'

  const chartData = {
    labels: data.map(d => d._id),
    datasets: [{
      label: 'เวลา (นาที)',
      data: data.map(d => d.duration),
      backgroundColor: 'rgba(59,130,246,0.7)',
      borderColor: '#3b82f6',
      borderWidth: 1,
      borderRadius: 8,
    }]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: textColor } },
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: textColor } },
      y: { grid: { color: gridColor }, ticks: { color: textColor } },
    },
  }

  return <Bar data={chartData} options={options} />
}

export default DurationChart