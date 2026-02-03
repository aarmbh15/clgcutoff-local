"use client"
import { Button } from "@/components/common/Button"
import { useEffect, useState } from "react"

type CounsellingType = {
  id?: number
  text?: string
  type?: "all-india" | "state"
}

type State = {
  id?: number
  code?: string
  text?: string
}

export default function AddQuotaCategorySubQuotaSubCategory() {
  const [selectedCounselling, setSelectedCounselling] = useState<CounsellingType | null>(null)
  const [counsellingTypeList, setCounsellingTypeList] = useState<CounsellingType[]>([])
  const [selectedState, setSelectedState] = useState<State | null>(null)
  const [stateList, setStateList] = useState<State[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [logs, setLogs] = useState<string[]>([])
  const [details, setDetails] = useState<any>(null)

  const addLog = (line: string) => {
    setLogs(prev => [...prev, line])
  }

  const fetchStates = async () => {
    const res = await fetch("/api/states")
    const json = await res.json()
    return json.data
  }

  const fetchCounsellingTypes = async () => {
    const res = await fetch("/api/counselling-types")
    const json = await res.json()
    return json.data
  }

  useEffect(() => {
    fetchStates()
      .then(setStateList)
      .catch(err => console.error("State load error:", err))
  }, [])

  useEffect(() => {
    fetchCounsellingTypes()
      .then(setCounsellingTypeList)
      .catch(err => console.error("Counselling load error:", err))
  }, [])

  const handleFetchAndInsert = async () => {
    setLogs([])
    setDetails(null)
    setMessage("")
    if (!selectedCounselling) {
      setMessage("Please select a counselling Type.")
      return
    }
    if (selectedCounselling.id === 2 && !selectedState) {
      setMessage("Please select a state.")
      return
    }

    setIsLoading(true)

    try {
      const stateCode = selectedState?.code ?? null
      const ress = await fetch(`/api/college-tables?stateCode=${stateCode}`)
      const { data: collegeData, error } = await ress.json()
      if (error) throw error
      addLog(`📥 Fetched ${collegeData.length} records for ${stateCode || "All India"}`)

      // Build unique sets/maps for quotas, subQuotas, categories, subCategories
      const uniqueQuotas = new Map();
      const uniqueSubQuotas = new Map();
      const uniqueCategories = new Map();
      const uniqueSubCategories = new Map();
// console.log("College data: ",collegeData)
let count = 1;
      for (const row of collegeData || []) {
        if (row.quota && row.courseType) {
          const key = `${row.quota.trim()}|${row.courseType.trim()}`;
          // console.log("KEY1: ",key)
          if (!uniqueQuotas.has(key)) {
            //  console.log("KEY2: ",count++,key)
            uniqueQuotas.set(key, {
              
              text: row.quota.trim(),
              courseType: row.courseType.trim(),
            });
          }
        }
        if (row.subQuota && row.quota && row.courseType) {
          const key = `${row.subQuota.trim()}|${row.quota.trim()}|${row.courseType.trim()}`;
          if (!uniqueSubQuotas.has(key)) {
            uniqueSubQuotas.set(key, {
              text: row.subQuota.trim(),
              quotaName: row.quota.trim(),
              courseType: row.courseType.trim(),
            });
          }
        }
        if (row.category && row.quota && row.courseType) {
          const key = `${row.category.trim()}|${row.quota.trim()}|${row.courseType.trim()}`;
          if (!uniqueCategories.has(key)) {
            uniqueCategories.set(key, {
              text: row.category.trim(),
              quotaName: row.quota.trim(),
              courseType: row.courseType.trim(),
            });
          }
        }
        if (row.subCategory && row.category && row.quota && row.courseType) {
          const key = `${row.subCategory.trim()}|${row.category.trim()}|${row.quota.trim()}|${row.courseType.trim()}`;
          if (!uniqueSubCategories.has(key)) {
            uniqueSubCategories.set(key, {
              text: row.subCategory.trim(),
              categoryName: row.category.trim(),
              quotaName: row.quota.trim(),
              courseType: row.courseType.trim(),
            });
          }
        }
      }
// counselling_type_id
      const res = await fetch("/api/admin/bulk-insert-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotas: Array.from(uniqueQuotas.values()),
          subQuotas: Array.from(uniqueSubQuotas.values()),
          categories: Array.from(uniqueCategories.values()),
          subCategories: Array.from(uniqueSubCategories.values()),
          counsellingTypeId: selectedCounselling.id,
          stateCode: selectedCounselling.id === 2 ? selectedState?.code : null,
        }),
      });
      const result = await res.json();
      setDetails(result);
      setMessage("All data imported successfully!");
      if (result.logs) setLogs(result.logs);
    } catch (error) {
      console.error(error)
      setMessage("Error during data import. Check logs below.")
      addLog("🚨 Unexpected error during import: " + error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Seat Import Manager</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Counselling Type</label>
          <select
            value={selectedCounselling?.id || ""}
            onChange={(e) => {
              const selected = counsellingTypeList.find(c => c.id === Number(e.target.value))
              setSelectedCounselling(selected || null)
              setSelectedState(null)
            }}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          >
            <option value="">Select Counselling Type</option>
            {counsellingTypeList.map((c) => (
              <option key={c.id} value={c.id}>{c.text}</option>
            ))}
          </select>
        </div>

        {selectedCounselling?.id === 2 && (
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <select
              value={selectedState?.code || ""}
              onChange={(e) => {
                const selected = stateList.find(s => s.code === e.target.value)
                setSelectedState(selected || null)
              }}
              className="w-full p-2 border rounded"
              disabled={isLoading}
            >
              <option value="">Select State</option>
              {stateList.map(state => (
                <option key={state?.code} value={state?.code}>{state.text}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <Button
        onClick={handleFetchAndInsert}
        className="px-4 py-2 text-white rounded"
        disabled={
          !selectedCounselling ||
          (selectedCounselling.type === "state" && !selectedState) ||
          isLoading
        }
      >
        {isLoading ? "Processing..." : "Import Data"}
      </Button>

      {message && (
        <div className="mt-4 p-3 text-sm rounded bg-gray-100 text-gray-800">
          {message}
        </div>
      )}

      {logs.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Logs:</h2>
          <div className="bg-gray-100 p-3 rounded max-h-96 overflow-y-auto text-sm whitespace-pre-wrap">
            {logs.map((log, idx) => (
              <div key={idx} className="mb-1">{log}</div>
            ))}
          </div>
        </div>
      )}

      {details && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Server Response:</h2>
          <div className="bg-gray-100 p-3 rounded max-h-96 overflow-x-auto text-xs whitespace-pre-wrap">
            {JSON.stringify(details, null, 2)}
          </div>
        </div>
      )}
    </div>
  )
}