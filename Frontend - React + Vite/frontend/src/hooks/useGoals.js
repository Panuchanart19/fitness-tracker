import { useState, useEffect } from 'react'
import { goalService } from '../services/goalService'
import { toast } from 'react-toastify'

export const useGoals = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    try {
      setLoading(true)
      const { data } = await goalService.getAll()
      setGoals(data)
    } catch {
      toast.error('โหลดเป้าหมายไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { goals, loading, refetch: fetch }
}