import { useState, useEffect, useCallback } from 'react'
import { activityService } from '../services/activityService'
import { toast } from 'react-toastify'

export const useActivities = (initialParams = {}) => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 })
  const [params, setParams] = useState(initialParams)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await activityService.getAll(params)
      setActivities(data.activities)
      setPagination({ total: data.total, page: data.page, pages: data.pages })
    } catch (err) {
      toast.error('โหลดข้อมูลไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => { fetch() }, [fetch])

  const deleteActivity = async (id) => {
    try {
      await activityService.remove(id)
      toast.success('ลบกิจกรรมสำเร็จ')
      fetch()
    } catch {
      toast.error('ลบไม่สำเร็จ')
    }
  }

  return { activities, loading, pagination, setParams, refetch: fetch, deleteActivity }
}