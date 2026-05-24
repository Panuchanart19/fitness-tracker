import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS = ['#22c55e','#3b82f6','#f59e0b','#ef4444','#8b5cf6']

const PopularChart = ({ data = [] }) => {
  const chartData = {
    labels: data.map(d => d._id),
    datasets: [{
      data: data.map(d => d.count),
      backgroundColor: COLORS.slice(0, data.length),
      borderWidth: 2,
      borderColor: '#ffffff',
    }]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 16, font: { family: 'Inter', size: 12 } }
      }
    }
  }

  return <Doughnut data={chartData} options={options} />
}

export default PopularChart