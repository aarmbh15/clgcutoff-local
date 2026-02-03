

// "use client"

// import { useEffect, useState } from "react"
// import { useDropzone } from "react-dropzone"
// import Papa from "papaparse"
// import { Button } from "@/components/common/Button"
// import { Card } from "@/components/common/Card"
// import { useAppState } from "@/hooks/useAppState"

// type CsvRow = Record<string, string>

// interface State {
//   code: string
//   text: string
// }

// const counsellingTypes = [
//   { id: 1, text: "All India Counselling" },
//   { id: 2, text: "State Counselling" },
// ]

// export default function BulkUploadForm() {
//   const { showToast } = useAppState()
//   const [file, setFile] = useState<File | null>(null)
//   const [parsedData, setParsedData] = useState<CsvRow[]>([])
//   const [logs, setLogs] = useState<string[]>([])
//   const [isUploading, setIsUploading] = useState(false)
//   const [details, setDetails] = useState<any>(null)

//   const [counsellingType, setCounsellingType] = useState<string>("")
//   const [stateCode, setStateCode] = useState<string>("")
//   const [stateList, setStateList] = useState<State[]>([])

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: { "text/csv": [".csv"] },
//     maxFiles: 1,
//     onDrop: (acceptedFiles) => {
//       const selectedFile = acceptedFiles[0]
//       setFile(selectedFile)
//       if (selectedFile) {
//         Papa.parse<CsvRow>(selectedFile, {
//           header: true,
//           skipEmptyLines: true,
//           complete: (results) => {
//             setParsedData(results.data)
//             setLogs([`📄 Parsed ${results.data.length} rows`])
//             setDetails(null)
//           },
//           error: () => {
//             showToast("error", "Failed to parse CSV")
//           },
//         })
//       }
//     },
//   })

//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const res = await fetch("/api/states")
//         const json = await res.json()
//         setStateList(json.data || [])
//       } catch {
//         showToast("error", "Failed to fetch states")
//       }
//     }
//     fetchStates()
//   }, [])

//   // const handleUpload = async () => {
//   //   if (!parsedData.length) return showToast("error", "No data to upload")
//   //   if (!counsellingType || (counsellingType === "State Counselling" && !stateCode)) {
//   //     return showToast("error", "Select counselling type and state")
//   //   }

//   //   setIsUploading(true)
//   //   setLogs(["🚀 Uploading..."])
//   //   setDetails(null)

//   //   try {
//   //     const res = await fetch("/api/admin/add_bulk_data", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({
//   //         data: parsedData,
//   //         counsellingType,
//   //         stateCode: counsellingType === "State Counselling" ? stateCode : "all",
//   //       }),
//   //     })

//   //     const json = await res.json()

//   //     if (res.ok) {
//   //       setLogs([
//   //         `✅ Inserted: ${json.inserted}`,
//   //         `✅ Updated: ${json.updated}`,
//   //         `❌ Failed: ${json.failed}`,
//   //         "📋 Details:",
//   //         ...(json.logs || []),
//   //       ])
//   //       setDetails(json)
//   //       showToast("success", "Upload complete")
//   //     } else {
//   //       setLogs(["❌ Upload failed", json.error])
//   //       setDetails(json)
//   //       showToast("error", json.error || "Upload failed")
//   //     }
//   //   } catch (err) {
//   //     setLogs(["❌ Network error"])
//   //     showToast("error", "Upload failed")
//   //   } finally {
//   //     setIsUploading(false)
//   //   }
//   // }
//   function chunkArray(array:any, size:any) {
//   const result = [];
//   for (let i = 0; i < array.length; i += size) {
//     result.push(array.slice(i, i + size));
//   }
//   return result;
// }
//   const handleUpload = async () => {
//   if (!parsedData.length) return showToast("error", "No data to upload")
//   if (!counsellingType || (counsellingType === "State Counselling" && !stateCode)) {
//     return showToast("error", "Select counselling type and state")
//   }

//   setIsUploading(true)
//   setLogs(["🚀 Uploading..."])
//   setDetails(null)

//   const BATCH_SIZE = 500;
//   const batches = chunkArray(parsedData, BATCH_SIZE);
//   let allLogs:any = [];
//   let allDetails = {
//     inserted: 0,
//     updated: 0,
//     failed: 0,
//     total: 0,
//     skippedDueToDuplicate: 0,
//     updatedRows: 0,
//     insertedRows: 0,
//     invalidBeforeInsert: 0,
//     batchStats: [],
//   };

//   for (let i = 0; i < batches.length; i++) {
//     setLogs((prev) => [...prev, `🚚 Uploading batch ${i + 1} of ${batches.length}...`]);
//     try {
//       const res = await fetch("/api/admin/add_bulk_data", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           data: batches[i],
//           counsellingType,
//           stateCode: counsellingType === "State Counselling" ? stateCode : "all",
//         }),
//       });

//       const json = await res.json();

//       if (res.ok) {
//         allLogs = [
//           ...allLogs,
//           `✅ Batch ${i + 1}: Inserted: ${json.inserted}, Updated: ${json.updated}, Failed: ${json.failed}`,
//           ...(json.logs || []),
//         ];
//         // Aggregate details
//         allDetails.inserted += json.inserted || 0;
//         allDetails.updated += json.updated || 0;
//         allDetails.failed += json.failed || 0;
//         allDetails.total += json.total || 0;
//         allDetails.skippedDueToDuplicate += json.skippedDueToDuplicate?.length || 0;
//         allDetails.updatedRows += json.updatedRows?.length || 0;
//         allDetails.insertedRows += json.insertedRows?.length || 0;
//         allDetails.invalidBeforeInsert += json.invalidBeforeInsert?.length || 0;
//         allDetails.batchStats.push(...(json.batchStats || []));
//       } else {
//         allLogs = [...allLogs, `❌ Batch ${i + 1} failed: ${json.error}`];
//       }
//     } catch (err) {
//       allLogs = [...allLogs, `❌ Batch ${i + 1} network error`];
//     }
//   }

//   setLogs([
//     `✅ Inserted: ${allDetails.inserted}`,
//     `✅ Updated: ${allDetails.updated}`,
//     `❌ Failed: ${allDetails.failed}`,
//     "📋 Details:",
//     ...allLogs,
//   ]);
//   setDetails(allDetails);
//   showToast("success", "Upload complete");
//   setIsUploading(false);
// };

//   return (
//     <div className="p-4">
//       <Card className="p-6 space-y-4">
//         <h2 className="text-xl font-semibold">Bulk Data Upload</h2>

//         {/* Counselling Type */}
//         <div>
//           <label className="block mb-1">Counselling Type</label>
//           <select
//             value={counsellingType}
//             onChange={(e) => {
//               setCounsellingType(e.target.value)
//               setStateCode("")
//             }}
//             className="w-full border p-2 rounded"
//           >
//             <option value="">Select</option>
//             {counsellingTypes.map(c => (
//               <option key={c.id} value={c.text}>{c.text}</option>
//             ))}
//           </select>
//         </div>

//         {/* State Dropdown */}
//         {counsellingType === "State Counselling" && (
//           <div>
//             <label className="block mb-1">Select State</label>
//             <select
//               value={stateCode}
//               onChange={(e) => setStateCode(e.target.value)}
//               className="w-full border p-2 rounded"
//             >
//               <option value="">Select State</option>
//               {stateList.map(s => (
//                 <option key={s.code} value={s.code}>{s.text}</option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Dropzone with conditional green border */}
//         <div
//           {...getRootProps()}
//           className={`p-6 text-center rounded cursor-pointer transition-all duration-300 border-2 border-dashed ${
//             file ? "border-green-500 bg-green-50 text-green-800" : "border-gray-300"
//           }`}
//         >
//           <input {...getInputProps()} />
//           {file ? <p>{file.name}</p> : <p>Click or drop a CSV file</p>}
//         </div>

//         {/* Upload button */}
//         <div className="flex justify-end gap-4">
//           <Button variant="outline" onClick={() => { setFile(null); setParsedData([]); setDetails(null); setLogs([]); }}>Clear</Button>
//           <Button onClick={handleUpload} disabled={isUploading || !file}>
//             {isUploading ? "Uploading..." : "Upload"}
//           </Button>
//         </div>

//         {/* Logs */}
//         {logs.length > 0 && (
//           <div className="bg-gray-50 border rounded p-3 mt-4 max-h-64 overflow-y-auto text-sm">
//             {logs.map((log, idx) => (
//               <div
//                 key={idx}
//                 className={
//                   log.startsWith("❌") ? "text-red-600" :
//                   log.startsWith("✅") || log.startsWith("🆕") ? "text-green-600" :
//                   ""
//                 }
//               >
//                 {log}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Details Table */}
//         {details && (
//           <div className="bg-gray-50 border rounded p-3 mt-4 max-h-96 overflow-x-auto text-xs">
//             <div className="mb-2 font-semibold">Server Details:</div>
//             <pre className="whitespace-pre-wrap break-all">
//               {JSON.stringify({
//                 inserted: details.inserted,
//                 updated: details.updated,
//                 failed: details.failed,
//                 total: details.total,
//                 skippedDueToDuplicate: details.skippedDueToDuplicate?.length,
//                 updatedRows: details.updatedRows?.length,
//                 insertedRows: details.insertedRows?.length,
//                 invalidBeforeInsert: details.invalidBeforeInsert?.length,
//               }, null, 2)}
//             </pre>

//             {details.skippedDueToDuplicate?.length > 0 && (
//               <div className="mt-2">
//                 <div className="font-semibold text-yellow-700">Skipped Duplicates:</div>
//                 <div className="overflow-x-auto max-h-40">
//                   <table className="min-w-full text-xs">
//                     <thead>
//                       <tr>
//                         <th className="border px-1">#</th>
//                         <th className="border px-1">Duplicate Row</th>
//                         <th className="border px-1">Duplicate Of</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {details.skippedDueToDuplicate.map((dup: any, idx: number) => (
//                         <tr key={idx}>
//                           <td className="border px-1">{dup.index} && {dup.duplicateOf.index}</td>
//                           <td className="border px-1">{JSON.stringify(dup.row)}</td>
//                           <td className="border px-1">{JSON.stringify(dup.duplicateOf.row)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {details.updatedRows?.length > 0 && (
//               <div className="mt-2">
//                 <div className="font-semibold text-blue-700">Updated Rows:</div>
//                 <div className="overflow-x-auto max-h-40">
//                   <table className="min-w-full text-xs">
//                     <thead>
//                       <tr>
//                         <th className="border px-1">#</th>
//                         <th className="border px-1">Row</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {details.updatedRows.map((row: any, idx: number) => (
//                         <tr key={idx}>
//                           <td className="border px-1">{row.index}</td>
//                           <td className="border px-1">{JSON.stringify(row.row)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {details.insertedRows?.length > 0 && (
//               <div className="mt-2">
//                 <div className="font-semibold text-green-700">Inserted Rows:</div>
//                 <div className="overflow-x-auto max-h-40">
//                   <table className="min-w-full text-xs">
//                     <thead>
//                       <tr>
//                         <th className="border px-1">#</th>
//                         <th className="border px-1">Row</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {details.insertedRows.map((row: any, idx: number) => (
//                         <tr key={idx}>
//                           <td className="border px-1">{row.index}</td>
//                           <td className="border px-1">{JSON.stringify(row.row)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {details.invalidBeforeInsert?.length > 0 && (
//               <div className="mt-2">
//                 <div className="font-semibold text-red-700">Invalid Rows (Missing Fields):</div>
//                 <div className="overflow-x-auto max-h-40">
//                   <table className="min-w-full text-xs">
//                     <thead>
//                       <tr>
//                         <th className="border px-1">#</th>
//                         <th className="border px-1">Reason</th>
//                         <th className="border px-1">Row</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {details.invalidBeforeInsert.map((row: any, idx: number) => (
//                         <tr key={idx}>
//                           <td className="border px-1">{row.index}</td>
//                           <td className="border px-1">{row.reason}</td>
//                           <td className="border px-1">{JSON.stringify(row.row)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </Card>
//     </div>
//   )
// }







// "use client"

// import { useEffect, useState } from "react"
// import { useDropzone } from "react-dropzone"
// import Papa from "papaparse"
// import { Button } from "@/components/common/Button"
// import { Card } from "@/components/common/Card"
// import { useAppState } from "@/hooks/useAppState"

// type CsvRow = Record<string, string>

// interface State {
//   code: string
//   text: string
// }

// const counsellingTypes = [
//   { id: 1, text: "All India Counselling" },
//   { id: 2, text: "State Counselling" },
// ]

// // Simple Table component for displaying tabular data
// const ResultTable = ({ 
//   data, 
//   columns, 
//   title,
//   itemsPerPage = 5 
// }: {
//   data: any[]
//   columns: { key: string; label: string }[]
//   title: string
//   itemsPerPage?: number
// }) => {
//   const [currentPage, setCurrentPage] = useState(1)
//   const totalPages = Math.ceil(data.length / itemsPerPage)
//   const paginatedData = data.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   )

//   return (
//     <div className="border rounded-lg overflow-hidden mb-6">
//       <div className="bg-gray-100 px-4 py-2 border-b font-medium">
//         {title} ({data.length})
//       </div>
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               {columns.map((col) => (
//                 <th
//                   key={col.key}
//                   className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   {col.label}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {paginatedData.map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 {columns.map((col) => (
//                   <td key={col.key} className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
//                     {renderCellValue(row, col.key)}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {totalPages > 1 && (
//         <div className="bg-gray-50 px-4 py-2 border-t flex justify-between items-center">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// // Helper function to render nested values in table cells
// const renderCellValue = (row: any, key: string) => {
//   // Handle nested keys like 'row.instituteName'
//   const keys = key.split('.')
//   let value = row
//   for (const k of keys) {
//     value = value?.[k]
//     if (value === undefined) break
//   }

//   if (value === undefined || value === null) return '-'
//   if (typeof value === 'object') return JSON.stringify(value)
//   return value.toString()
// }

// // Collapsible section component
// const CollapsibleSection = ({ 
//   title, 
//   children 
// }: { 
//   title: string 
//   children: React.ReactNode 
// }) => {
//   const [isOpen, setIsOpen] = useState(true)

//   return (
//     <div className="border rounded-lg overflow-hidden mb-4">
//       <button
//         className="w-full flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className="font-medium">{title}</span>
//         <span>{isOpen ? '−' : '+'}</span>
//       </button>
//       {isOpen && <div className="p-3">{children}</div>}
//     </div>
//   )
// }

// export default function BulkUploadForm() {
//   const { showToast } = useAppState()
//   const [file, setFile] = useState<File | null>(null)
//   const [parsedData, setParsedData] = useState<CsvRow[]>([])
//   const [logs, setLogs] = useState<string[]>([])
//   const [isUploading, setIsUploading] = useState(false)
//   const [uploadResult, setUploadResult] = useState<any>(null)

//   const [counsellingType, setCounsellingType] = useState<string>("")
//   const [stateCode, setStateCode] = useState<string>("")
//   const [stateList, setStateList] = useState<State[]>([])

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: { "text/csv": [".csv"] },
//     maxFiles: 1,
//     onDrop: (acceptedFiles) => {
//       const selectedFile = acceptedFiles[0]
//       setFile(selectedFile)
//       if (selectedFile) {
//         Papa.parse<CsvRow>(selectedFile, {
//           header: true,
//           skipEmptyLines: true,
//           complete: (results) => {
//             setParsedData(results.data)
//             setLogs([`📄 Parsed ${results.data.length} rows`])
//             setUploadResult(null)
//           },
//           error: () => {
//             showToast("error", "Failed to parse CSV")
//           },
//         })
//       }
//     },
//   })

//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const res = await fetch("/api/states")
//         const json = await res.json()
//         setStateList(json.data || [])
//       } catch {
//         showToast("error", "Failed to fetch states")
//       }
//     }
//     fetchStates()
//   }, [])

//   function chunkArray(array: any, size: any) {
//     const result = []
//     for (let i = 0; i < array.length; i += size) {
//       result.push(array.slice(i, i + size))
//     }
//     return result
//   }

//   const handleUpload = async () => {
//     if (!parsedData.length) return showToast("error", "No data to upload")
//     if (!counsellingType || (counsellingType === "State Counselling" && !stateCode)) {
//       return showToast("error", "Select counselling type and state")
//     }

//     setIsUploading(true)
//     setLogs(["🚀 Starting upload..."])
//     setUploadResult(null)

//     const BATCH_SIZE = 500
//     const batches = chunkArray(parsedData, BATCH_SIZE)
//     let allLogs: any = []
//     let aggregatedResult = {
//       success: true,
//       inserted: 0,
//       updated: 0,
//       failed: 0,
//       total: 0,
//       skippedDueToDuplicate: [],
//       updatedRows: [],
//       insertedRows: [],
//       invalidBeforeInsert: [],
//       batchStats: [],
//     }

//     for (let i = 0; i < batches.length; i++) {
//       setLogs((prev) => [...prev, `📦 Processing batch ${i + 1}/${batches.length}...`])
//       try {
//         const res = await fetch("/api/admin/add_bulk_data", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             data: batches[i],
//             counsellingType,
//             stateCode: counsellingType === "State Counselling" ? stateCode : "all",
//           }),
//         })

//         const json = await res.json()

//         if (res.ok) {
//           allLogs = [
//             ...allLogs,
//             `✅ Batch ${i + 1} completed: ${json.inserted} inserted, ${json.updated} updated, ${json.failed} failed`,
//           ]
          
//           // Aggregate results
//           aggregatedResult.inserted += json.inserted || 0
//           aggregatedResult.updated += json.updated || 0
//           aggregatedResult.failed += json.failed || 0
//           aggregatedResult.total += json.total || 0
//           aggregatedResult.success = aggregatedResult.success && json.success
//           aggregatedResult.skippedDueToDuplicate.push(...(json.skippedDueToDuplicate || []))
//           aggregatedResult.updatedRows.push(...(json.updatedRows || []))
//           aggregatedResult.insertedRows.push(...(json.insertedRows || []))
//           aggregatedResult.invalidBeforeInsert.push(...(json.invalidBeforeInsert || []))
//           aggregatedResult.batchStats.push(...(json.batchStats || []))
//         } else {
//           allLogs = [...allLogs, `❌ Batch ${i + 1} failed: ${json.error || 'Unknown error'}`]
//           aggregatedResult.success = false
//         }
//       } catch (err) {
//         allLogs = [...allLogs, `❌ Batch ${i + 1} network error`]
//         aggregatedResult.success = false
//       }
//     }

//     setLogs([
//       `🎉 Upload ${aggregatedResult.success ? 'completed successfully' : 'completed with errors'}`,
//       `📊 Summary: ${aggregatedResult.inserted} inserted, ${aggregatedResult.updated} updated, ${aggregatedResult.failed} failed`,
//       ...allLogs,
//     ])
//     setUploadResult(aggregatedResult)
//     showToast(aggregatedResult.success ? "success" : "error", 
//       `Upload ${aggregatedResult.success ? 'completed' : 'failed'}`)
//     setIsUploading(false)
//   }

//   const renderSummaryCard = () => {
//     if (!uploadResult) return null

//     return (
//       <Card className="mt-4 p-4">
//         <h3 className="text-lg font-semibold mb-4">Upload Summary</h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-green-50 p-3 rounded border border-green-200">
//             <div className="text-green-800 font-medium">Inserted</div>
//             <div className="text-2xl font-bold">{uploadResult.inserted}</div>
//           </div>
//           <div className="bg-blue-50 p-3 rounded border border-blue-200">
//             <div className="text-blue-800 font-medium">Updated</div>
//             <div className="text-2xl font-bold">{uploadResult.updated}</div>
//           </div>
//           <div className="bg-red-50 p-3 rounded border border-red-200">
//             <div className="text-red-800 font-medium">Failed</div>
//             <div className="text-2xl font-bold">{uploadResult.failed}</div>
//           </div>
//         </div>

//         <div className="space-y-4">
//           {uploadResult.skippedDueToDuplicate.length > 0 && (
//             <CollapsibleSection title={`Skipped Duplicates (${uploadResult.skippedDueToDuplicate.length})`}>
//               <ResultTable
//                 data={uploadResult.skippedDueToDuplicate}
//                 columns={[
//                   { key: 'index', label: 'Row #' },
//                   { key: 'duplicateOf.index', label: 'Duplicate Of' },
//                   { key: 'row.instituteName', label: 'Institute' },
//                   { key: 'row.quota', label: 'Quota' },
//                   { key: 'row.category', label: 'Category' },
//                 ]}
//                 title="Skipped Duplicates"
//               />
//             </CollapsibleSection>
//           )}

//           {uploadResult.updatedRows.length > 0 && (
//             <CollapsibleSection title={`Updated Rows (${uploadResult.updatedRows.length})`}>
//               <ResultTable
//                 data={uploadResult.updatedRows}
//                 columns={[
//                   { key: 'index', label: 'Row #' },
//                   { key: 'row.instituteName', label: 'Institute' },
//                   { key: 'row.quota', label: 'Quota' },
//                   { key: 'row.category', label: 'Category' },
//                 ]}
//                 title="Updated Rows"
//               />
//             </CollapsibleSection>
//           )}

//           {uploadResult.insertedRows.length > 0 && (
//             <CollapsibleSection title={`Inserted Rows (${uploadResult.insertedRows.length})`}>
//               <ResultTable
//                 data={uploadResult.insertedRows}
//                 columns={[
//                   { key: 'index', label: 'Row #' },
//                   { key: 'row.instituteName', label: 'Institute' },
//                   { key: 'row.quota', label: 'Quota' },
//                   { key: 'row.category', label: 'Category' },
//                 ]}
//                 title="Inserted Rows"
//               />
//             </CollapsibleSection>
//           )}

//           {uploadResult.invalidBeforeInsert.length > 0 && (
//             <CollapsibleSection title={`Invalid Rows (${uploadResult.invalidBeforeInsert.length})`}>
//               <ResultTable
//                 data={uploadResult.invalidBeforeInsert}
//                 columns={[
//                   { key: 'index', label: 'Row #' },
//                   { key: 'reason', label: 'Error' },
//                   { key: 'row.instituteName', label: 'Institute' },
//                 ]}
//                 title="Invalid Rows"
//               />
//             </CollapsibleSection>
//           )}

//           {uploadResult.batchStats.length > 0 && (
//             <CollapsibleSection title={`Batch Statistics (${uploadResult.batchStats.length} batches)`}>
//               <ResultTable
//                 data={uploadResult.batchStats}
//                 columns={[
//                   { key: 'batchNum', label: 'Batch #' },
//                   { key: 'inserted', label: 'Inserted' },
//                   { key: 'updated', label: 'Updated' },
//                   { key: 'failed', label: 'Failed' },
//                   { key: 'total', label: 'Total' },
//                 ]}
//                 title="Batch Statistics"
//               />
//             </CollapsibleSection>
//           )}
//         </div>
//       </Card>
//     )
//   }

//   return (
//     <div className="p-4">
//       <Card className="p-6 space-y-4">
//         <h2 className="text-xl font-semibold">Bulk Data Upload</h2>

//         {/* Counselling Type */}
//         <div>
//           <label className="block mb-1">Counselling Type</label>
//           <select
//             value={counsellingType}
//             onChange={(e) => {
//               setCounsellingType(e.target.value)
//               setStateCode("")
//             }}
//             className="w-full border p-2 rounded"
//           >
//             <option value="">Select</option>
//             {counsellingTypes.map(c => (
//               <option key={c.id} value={c.text}>{c.text}</option>
//             ))}
//           </select>
//         </div>

//         {/* State Dropdown */}
//         {counsellingType === "State Counselling" && (
//           <div>
//             <label className="block mb-1">Select State</label>
//             <select
//               value={stateCode}
//               onChange={(e) => setStateCode(e.target.value)}
//               className="w-full border p-2 rounded"
//             >
//               <option value="">Select State</option>
//               {stateList.map(s => (
//                 <option key={s.code} value={s.code}>{s.text}</option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Dropzone with conditional green border */}
//         <div
//           {...getRootProps()}
//           className={`p-6 text-center rounded cursor-pointer transition-all duration-300 border-2 border-dashed ${
//             file ? "border-green-500 bg-green-50 text-green-800" : "border-gray-300"
//           }`}
//         >
//           <input {...getInputProps()} />
//           {file ? <p>{file.name}</p> : <p>Click or drop a CSV file</p>}
//         </div>

//         {/* Upload button */}
//         <div className="flex justify-end gap-4">
//           <Button 
//             variant="outline" 
//             onClick={() => { 
//               setFile(null)
//               setParsedData([])
//               setUploadResult(null)
//               setLogs([])
//             }}
//           >
//             Clear
//           </Button>
//           <Button 
//             onClick={handleUpload} 
//             disabled={isUploading || !file}
//             loading={isUploading}
//           >
//             Upload
//           </Button>
//         </div>

//         {/* Logs */}
//         {logs.length > 0 && (
//           <div className="bg-gray-50 border rounded p-3 mt-4 max-h-64 overflow-y-auto text-sm space-y-1">
//             {logs.map((log, idx) => (
//               <div
//                 key={idx}
//                 className={
//                   log.startsWith("❌") ? "text-red-600" :
//                   log.startsWith("✅") ? "text-green-600" :
//                   log.startsWith("📦") ? "text-blue-600" :
//                   ""
//                 }
//               >
//                 {log}
//               </div>
//             ))}
//           </div>
//         )}
//       </Card>

//       {/* Detailed Results */}
//       {renderSummaryCard()}
//     </div>
//   )
// }








// "use client"

// import { useEffect, useState } from "react"
// import { useDropzone } from "react-dropzone"
// import Papa from "papaparse"
// import { Button } from "@/components/common/Button"
// import { Card } from "@/components/common/Card"
// import { useAppState } from "@/hooks/useAppState"

// type CsvRow = Record<string, string>

// interface State {
//   code: string
//   text: string
// }

// const counsellingTypes = [
//   { id: 1, text: "All India Counselling" },
//   { id: 2, text: "State Counselling" },
// ]

// type SkippedDuplicate = {
//   index: number
//   row: CsvRow
//   duplicateOf: { index: number; row: CsvRow }
// }
// type UpdatedRow = {
//   index: number
//   row: CsvRow
//   conflictKey?: any
// }
// type InsertedRow = {
//   index: number
//   row: CsvRow
//   conflictKey?: any
// }
// type InvalidRow = {
//   index: number
//   reason: string
//   row: CsvRow
// }
// type BatchStat = {
//   batchNum: number
//   inserted: number
//   updated: number
//   failed: number
//   total: number
//   logs: string[]
//   errors: any[]
// }
// type UploadResult = {
//   success: boolean
//   inserted: number
//   updated: number
//   failed: number
//   total: number
//   skippedDueToDuplicate: SkippedDuplicate[]
//   updatedRows: UpdatedRow[]
//   insertedRows: InsertedRow[]
//   invalidBeforeInsert: InvalidRow[]
//   batchStats: BatchStat[]
//   logs?: string[]
// }

// const ResultTable = ({
//   data,
//   columns,
//   title,
//   itemsPerPage = 5,
// }: {
//   data: any[]
//   columns: { key: string; label: string }[]
//   title: string
//   itemsPerPage?: number
// }) => {
//   const [currentPage, setCurrentPage] = useState(1)
//   const totalPages = Math.ceil(data.length / itemsPerPage)
//   const paginatedData = data.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   )

//   return (
//     <div className="border rounded-lg overflow-hidden mb-6">
//       <div className="bg-gray-100 px-4 py-2 border-b font-medium">
//         {title} ({data.length})
//       </div>
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               {columns.map((col) => (
//                 <th
//                   key={col.key}
//                   className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   {col.label}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {paginatedData.map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 {columns.map((col) => (
//                   <td key={col.key} className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
//                     {renderCellValue(row, col.key)}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {totalPages > 1 && (
//         <div className="bg-gray-50 px-4 py-2 border-t flex justify-between items-center">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

// const renderCellValue = (row: any, key: string) => {
//   const keys = key.split('.')
//   let value = row
//   for (const k of keys) {
//     value = value?.[k]
//     if (value === undefined) break
//   }
//   if (value === undefined || value === null) return '-'
//   if (typeof value === 'object') return JSON.stringify(value)
//   return value.toString()
// }

// const CollapsibleSection = ({
//   title,
//   children,
// }: {
//   title: string
//   children: React.ReactNode
// }) => {
//   const [isOpen, setIsOpen] = useState(true)
//   return (
//     <div className="border rounded-lg overflow-hidden mb-4">
//       <button
//         className="w-full flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className="font-medium">{title}</span>
//         <span>{isOpen ? '−' : '+'}</span>
//       </button>
//       {isOpen && <div className="p-3">{children}</div>}
//     </div>
//   )
// }

// export default function BulkUploadForm() {
//   const { showToast } = useAppState()
//   const [file, setFile] = useState<File | null>(null)
//   const [parsedData, setParsedData] = useState<CsvRow[]>([])
//   const [logs, setLogs] = useState<string[]>([])
//   const [isUploading, setIsUploading] = useState(false)
//   const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)

//   const [counsellingType, setCounsellingType] = useState<string>("")
//   const [stateCode, setStateCode] = useState<string>("")
//   const [stateList, setStateList] = useState<State[]>([])

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: { "text/csv": [".csv"] },
//     maxFiles: 1,
//     onDrop: (acceptedFiles) => {
//       const selectedFile = acceptedFiles[0]
//       setFile(selectedFile)
//       if (selectedFile) {
//         Papa.parse<CsvRow>(selectedFile, {
//           header: true,
//           skipEmptyLines: true,
//           complete: (results) => {
//             setParsedData(results.data)
//             setLogs([`📄 Parsed ${results.data.length} rows`])
//             setUploadResult(null)
//           },
//           error: () => {
//             showToast("error", "Failed to parse CSV")
//           },
//         })
//       }
//     },
//   })

//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const res = await fetch("/api/states")
//         const json = await res.json()
//         setStateList(json.data || [])
//       } catch {
//         showToast("error", "Failed to fetch states")
//       }
//     }
//     fetchStates()
//   }, [])

//   function chunkArray<T>(array: T[], size: number): T[][] {
//     const result: T[][] = []
//     for (let i = 0; i < array.length; i += size) {
//       result.push(array.slice(i, i + size))
//     }
//     return result
//   }

// //   const handleUpload = async () => {
// //     if (!parsedData.length) return showToast("error", "No data to upload")
// //     if (!counsellingType || (counsellingType === "State Counselling" && !stateCode)) {
// //       return showToast("error", "Select counselling type and state")
// //     }

// //     setIsUploading(true)
// //     setLogs(["🚀 Starting upload..."])
// //     setUploadResult(null)

// //     const BATCH_SIZE = 500
// //     const batches = chunkArray(parsedData, BATCH_SIZE)
// //     let allLogs: string[] = []
// //     const aggregatedResult: UploadResult = {
// //       success: true,
// //       inserted: 0,
// //       updated: 0,
// //       failed: 0,
// //       total: 0,
// //       skippedDueToDuplicate: [],
// //       updatedRows: [],
// //       insertedRows: [],
// //       invalidBeforeInsert: [],
// //       batchStats: [],
// //     }

// //     // for (let i = 0; i < batches.length; i++) {
// //     //   setLogs((prev) => [...prev, `📦 Processing batch ${i + 1}/${batches.length}...`])
// //     //   try {
// //     //     const res = await fetch("/api/admin/add_bulk_data", {
// //     //       method: "POST",
// //     //       headers: { "Content-Type": "application/json" },
// //     //       body: JSON.stringify({
// //     //         data: batches[i],
// //     //         counsellingType,
// //     //         stateCode: counsellingType === "State Counselling" ? stateCode : "all",
// //     //       }),
// //     //     })

// //     //     const json = await res.json()

// //     //     if (res.ok) {
// //     //       allLogs = [
// //     //         ...allLogs,
// //     //         `✅ Batch ${i + 1} completed: ${json.inserted} inserted, ${json.updated} updated, ${json.failed} failed`,
// //     //       ]
// //     //       // Aggregate results
// //     //       aggregatedResult.inserted += json.inserted || 0
// //     //       aggregatedResult.updated += json.updated || 0
// //     //       aggregatedResult.failed += json.failed || 0
// //     //       aggregatedResult.total += json.total || 0
// //     //       aggregatedResult.success = aggregatedResult.success && json.success
// //     //       aggregatedResult.skippedDueToDuplicate.push(...(json.skippedDueToDuplicate || []))
// //     //       aggregatedResult.updatedRows.push(...(json.updatedRows || []))
// //     //       aggregatedResult.insertedRows.push(...(json.insertedRows || []))
// //     //       aggregatedResult.invalidBeforeInsert.push(...(json.invalidBeforeInsert || []))
// //     //       aggregatedResult.batchStats.push(...(json.batchStats || []))
// //     //     } else {
// //     //       allLogs = [...allLogs, `❌ Batch ${i + 1} failed: ${json.error || 'Unknown error'}`]
// //     //       aggregatedResult.success = false
// //     //     }
// //     //   } catch (err) {
// //     //     allLogs = [...allLogs, `❌ Batch ${i + 1} network error`]
// //     //     aggregatedResult.success = false
// //     //   }
// //     //       // Add a small delay between batches to avoid overwhelming the server
// //     // if (i < batches.length - 1) {
// //     //   await new Promise(resolve => setTimeout(resolve, 500));
// //     // }

// //     // }

// //     for (let i = 0; i < batches.length; i++) {
// //   setLogs((prev) => [...prev, `📦 Processing batch ${i + 1}/${batches.length}...`])
// //   try {
// //     const res = await fetch("/api/admin/add_bulk_data", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         data: batches[i],
// //         counsellingType,
// //         stateCode: counsellingType === "State Counselling" ? stateCode : "all",
// //       }),
// //     })

// //     const json = await res.json()

// //     if (res.ok) {
// //       setLogs((prev) => [
// //         ...prev,
// //         `✅ Batch ${i + 1} completed: ${json.inserted} inserted, ${json.updated} updated, ${json.failed} failed`,
// //       ])

// //       // Aggregate results
// //       aggregatedResult.inserted += json.inserted || 0
// //       aggregatedResult.updated += json.updated || 0
// //       aggregatedResult.failed += json.failed || 0
// //       aggregatedResult.total += json.total || 0
// //       aggregatedResult.success = aggregatedResult.success && json.success
// //       aggregatedResult.skippedDueToDuplicate.push(...(json.skippedDueToDuplicate || []))
// //       aggregatedResult.updatedRows.push(...(json.updatedRows || []))
// //       aggregatedResult.insertedRows.push(...(json.insertedRows || []))
// //       aggregatedResult.invalidBeforeInsert.push(...(json.invalidBeforeInsert || []))
// //       aggregatedResult.batchStats.push(...(json.batchStats || []))
// //     } else {
// //       setLogs((prev) => [
// //         ...prev,
// //         `❌ Batch ${i + 1} failed: ${json.error || 'Unknown error'}`,
// //       ])
// //       aggregatedResult.success = false
// //     }
// //   } catch (err) {
// //     setLogs((prev) => [...prev, `❌ Batch ${i + 1} network error`])
// //     aggregatedResult.success = false
// //   }

// //   // Small delay between batches
// //   if (i < batches.length - 1) {
// //     await new Promise((resolve) => setTimeout(resolve, 500))
// //   }
// // }

// //     // setLogs([
// //     //   `🎉 Upload ${aggregatedResult.success ? 'completed successfully' : 'completed with errors'}`,
// //     //   `📊 Summary: ${aggregatedResult.inserted} inserted, ${aggregatedResult.updated} updated, ${aggregatedResult.failed} failed`,
// //     //   ...allLogs,
// //     // ])
// //     setLogs((prev) => [
// //   ...prev,
// //   `🎉 Upload ${aggregatedResult.success ? 'completed successfully' : 'completed with errors'}`,
// //   `📊 Summary: ${aggregatedResult.inserted} inserted, ${aggregatedResult.updated} updated, ${aggregatedResult.failed} failed`,
// // ])

// //     setUploadResult(aggregatedResult)
// //     showToast(aggregatedResult.success ? "success" : "error", 
// //       `Upload ${aggregatedResult.success ? 'completed' : 'failed'}`)
// //     setIsUploading(false)
// //   }


// const handleUpload = async () => {
//   if (!parsedData.length) return showToast("error", "No data to upload")
//   if (!counsellingType || (counsellingType === "State Counselling" && !stateCode)) {
//     return showToast("error", "Select counselling type and state")
//   }

//   setIsUploading(true)
//   setLogs(["🚀 Starting upload..."])
//   setUploadResult(null)
//   setBatchResults([]) // Clear previous batch results

//   const BATCH_SIZE = 500
//   const batches = chunkArray(parsedData, BATCH_SIZE)
  
//   // Initialize aggregated result
//   const aggregatedResult: UploadResult = {
//     success: true,
//     inserted: 0,
//     updated: 0,
//     failed: 0,
//     total: 0,
//     skippedDueToDuplicate: [],
//     updatedRows: [],
//     insertedRows: [],
//     invalidBeforeInsert: [],
//     batchStats: [],
//   }

//   for (let i = 0; i < batches.length; i++) {
//     setLogs((prev) => [...prev, `📦 Processing batch ${i + 1}/${batches.length}...`])
    
//     try {
//       const res = await fetch("/api/admin/add_bulk_data", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           data: batches[i],
//           counsellingType,
//           stateCode: counsellingType === "State Counselling" ? stateCode : "all",
//         }),
//       })

//       // Check if response is OK first
//       if (!res.ok) {
//         // Try to get error message from response
//         let errorMsg = `HTTP error ${res.status}`
//         try {
//           const errorJson = await res.json()
//           errorMsg = errorJson.error || errorJson.details || errorMsg
//         } catch (e) {
//           // If we can't parse JSON, try to get text
//           try {
//             errorMsg = await res.text()
//           } catch (textError) {
//             // Fallback to status text
//             errorMsg = res.statusText || errorMsg
//           }
//         }
//         throw new Error(errorMsg)
//       }

//       // Parse successful response
//       const json = await res.json()

//       // Create batch stat with detailed information
//       const batchStat: BatchStat = {
//         batchNum: i + 1,
//         inserted: json.inserted || 0,
//         updated: json.updated || 0,
//         failed: json.failed || 0,
//         total: json.total || batches[i].length,
//         logs: json.batchStats?.[0]?.logs || [
//           `Batch ${i + 1}: ${json.inserted} inserted, ${json.updated} updated, ${json.failed} failed`,
//         ],
//         errors: json.batchStats?.[0]?.errors || [],
//       }

//       // Update batch results immediately
//       setBatchResults(prev => [...prev, batchStat])
      
//       // Add to logs immediately
//       setLogs(prev => [
//         ...prev,
//         `✅ Batch ${i + 1} completed: ${json.inserted} inserted, ${json.updated} updated, ${json.failed} failed`,
//       ])

//       // Aggregate results for final summary
//       aggregatedResult.inserted += json.inserted || 0
//       aggregatedResult.updated += json.updated || 0
//       aggregatedResult.failed += json.failed || 0
//       aggregatedResult.total += json.total || batches[i].length
//       aggregatedResult.success = aggregatedResult.success && json.success
//       aggregatedResult.skippedDueToDuplicate.push(...(json.skippedDueToDuplicate || []))
//       aggregatedResult.updatedRows.push(...(json.updatedRows || []))
//       aggregatedResult.insertedRows.push(...(json.insertedRows || []))
//       aggregatedResult.invalidBeforeInsert.push(...(json.invalidBeforeInsert || []))
//       aggregatedResult.batchStats.push(batchStat)

//     } catch (err: any) {
//       const errorMsg = `❌ Batch ${i + 1} failed: ${err.message || 'Unknown error'}`
//       setLogs(prev => [...prev, errorMsg])
      
//       // Add failed batch to results
//       const failedBatchStat: BatchStat = {
//         batchNum: i + 1,
//         inserted: 0,
//         updated: 0,
//         failed: batches[i].length,
//         total: batches[i].length,
//         logs: [errorMsg],
//         errors: [err.message || 'Unknown error'],
//       }
      
//       setBatchResults(prev => [...prev, failedBatchStat])
//       aggregatedResult.batchStats.push(failedBatchStat)
//       aggregatedResult.success = false
//       aggregatedResult.failed += batches[i].length
//       aggregatedResult.total += batches[i].length
//     }

//     // Small delay between batches to avoid overwhelming the server
//     if (i < batches.length - 1) {
//       await new Promise((resolve) => setTimeout(resolve, 500))
//     }
//   }

//   // Final summary
//   setLogs((prev) => [
//     ...prev,
//     `🎉 Upload ${aggregatedResult.success ? 'completed successfully' : 'completed with errors'}`,
//     `📊 Summary: ${aggregatedResult.inserted} inserted, ${aggregatedResult.updated} updated, ${aggregatedResult.failed} failed`,
//   ])

//   setUploadResult(aggregatedResult)
//   showToast(aggregatedResult.success ? "success" : "error", 
//     `Upload ${aggregatedResult.success ? 'completed' : 'failed'}`)
//   setIsUploading(false)
// }
//   const renderSummaryCard = () => {
//     if (!uploadResult) return null

//     return (
//       <Card className="mt-4 p-4">
//         <h3 className="text-lg font-semibold mb-4">Upload Summary</h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-green-50 p-3 rounded border border-green-200">
//             <div className="text-green-800 font-medium">Inserted</div>
//             <div className="text-2xl font-bold">{uploadResult.inserted}</div>
//           </div>
//           <div className="bg-blue-50 p-3 rounded border border-blue-200">
//             <div className="text-blue-800 font-medium">Updated</div>
//             <div className="text-2xl font-bold">{uploadResult.updated}</div>
//           </div>
//           <div className="bg-red-50 p-3 rounded border border-red-200">
//             <div className="text-red-800 font-medium">Failed</div>
//             <div className="text-2xl font-bold">{uploadResult.failed}</div>
//           </div>
//         </div>

//         <div className="space-y-4">
//           {uploadResult.skippedDueToDuplicate.length > 0 && (
//             <CollapsibleSection title={`Skipped Duplicates (${uploadResult.skippedDueToDuplicate.length})`}>
//               <ResultTable
//                 data={uploadResult.skippedDueToDuplicate}
//                 columns={[
//                   { key: 'index', label: 'Row #' },
//                   { key: 'duplicateOf.index', label: 'Duplicate Of' },
//                   { key: 'row.instituteName', label: 'Institute' },
//                   { key: 'row.quota', label: 'Quota' },
//                   { key: 'row.category', label: 'Category' },
//                 ]}
//                 title="Skipped Duplicates"
//               />
//             </CollapsibleSection>
//           )}

//           {uploadResult.updatedRows.length > 0 && (
//             <CollapsibleSection title={`Updated Rows (${uploadResult.updatedRows.length})`}>
//               <ResultTable
//                 data={uploadResult.updatedRows}
//                 columns={[
//                   { key: 'index', label: 'Row #' },
//                   { key: 'row.instituteName', label: 'Institute' },
//                   { key: 'row.instituteType', label: 'InstituteType' },
//                   { key: 'row.quota', label: 'Quota' },
//                   { key: 'row.subQuota', label: 'SubQuota' },
//                   { key: 'row.category', label: 'Category' },
//                   { key: 'row.subCategory', label: 'SubCategory' },
//                   { key: 'row.courseType', label: 'courseType' },
//                 ]}
//                 title="Updated Rows"
//               />
//             </CollapsibleSection>
//           )}

//           {uploadResult.insertedRows.length > 0 && (
//             <CollapsibleSection title={`Inserted Rows (${uploadResult.insertedRows.length})`}>
//               <ResultTable
//                 data={uploadResult.insertedRows}
//                 columns={[
//                   { key: 'index', label: 'Row #' },
//                   { key: 'row.instituteName', label: 'Institute' },
//                   { key: 'row.instituteType', label: 'InstituteType' },
//                   { key: 'row.quota', label: 'Quota' },
//                   { key: 'row.subQuota', label: 'SubQuota' },
//                   { key: 'row.category', label: 'Category' },
//                   { key: 'row.subCategory', label: 'SubCategory' },
//                   { key: 'row.courseType', label: 'courseType' },
//                 ]}
//                 title="Inserted Rows"
//               />
//             </CollapsibleSection>
//           )}

//           {uploadResult.invalidBeforeInsert.length > 0 && (
//             <CollapsibleSection title={`Invalid Rows (${uploadResult.invalidBeforeInsert.length})`}>
//               <ResultTable
//                 data={uploadResult.invalidBeforeInsert}
//                 columns={[
//                   { key: 'index', label: 'Row #' },
//                   { key: 'reason', label: 'Error' },
//                   { key: 'row.instituteName', label: 'Institute' },
//                 ]}
//                 title="Invalid Rows"
//               />
//             </CollapsibleSection>
//           )}

//           {uploadResult.batchStats.length > 0 && (
//             <CollapsibleSection title={`Batch Statistics (${uploadResult.batchStats.length} batches)`}>
//               <ResultTable
//                 data={uploadResult.batchStats}
//                 columns={[
//                   { key: 'batchNum', label: 'Batch #' },
//                   { key: 'inserted', label: 'Inserted' },
//                   { key: 'updated', label: 'Updated' },
//                   { key: 'failed', label: 'Failed' },
//                   { key: 'total', label: 'Total' },
//                 ]}
//                 title="Batch Statistics"
//               />
//             </CollapsibleSection>
//           )}
//         </div>
//       </Card>
//     )
//   }

//   return (
//     <div className="p-4">
//       <Card className="p-6 space-y-4">
//         <h2 className="text-xl font-semibold">Bulk Data Upload</h2>

//         {/* Counselling Type */}
//         <div>
//           <label className="block mb-1">Counselling Type</label>
//           <select
//             value={counsellingType}
//             onChange={(e) => {
//               setCounsellingType(e.target.value)
//               setStateCode("")
//             }}
//             className="w-full border p-2 rounded"
//           >
//             <option value="">Select</option>
//             {counsellingTypes.map(c => (
//               <option key={c.id} value={c.text}>{c.text}</option>
//             ))}
//           </select>
//         </div>

//         {/* State Dropdown */}
//         {counsellingType === "State Counselling" && (
//           <div>
//             <label className="block mb-1">Select State</label>
//             <select
//               value={stateCode}
//               onChange={(e) => setStateCode(e.target.value)}
//               className="w-full border p-2 rounded"
//             >
//               <option value="">Select State</option>
//               {stateList.map(s => (
//                 <option key={s.code} value={s.code}>{s.text}</option>
//               ))}
//             </select>
//           </div>
//         )}

//         {/* Dropzone with conditional green border */}
//         <div
//           {...getRootProps()}
//           className={`p-6 text-center rounded cursor-pointer transition-all duration-300 border-2 border-dashed ${
//             file ? "border-green-500 bg-green-50 text-green-800" : "border-gray-300"
//           }`}
//         >
//           <input {...getInputProps()} />
//           {file ? <p>{file.name}</p> : <p>Click or drop a CSV file</p>}
//         </div>

//         {/* Upload button */}
//         <div className="flex justify-end gap-4">
//           <Button 
//             variant="outline" 
//             onClick={() => { 
//               setFile(null)
//               setParsedData([])
//               setUploadResult(null)
//               setLogs([])
//             }}
//           >
//             Clear
//           </Button>
//           <Button 
//             onClick={handleUpload} 
//             disabled={isUploading || !file}
//             // loading={isUploading}
//           >
//             Upload
//           </Button>
//         </div>

//         {/* Logs */}
//         {logs.length > 0 && (
//           <div className="bg-gray-50 border rounded p-3 mt-4 max-h-64 overflow-y-auto text-sm space-y-1">
//             {logs.map((log, idx) => (
//               <div
//                 key={idx}
//                 className={
//                   log.startsWith("❌") ? "text-red-600" :
//                   log.startsWith("✅") ? "text-green-600" :
//                   log.startsWith("📦") ? "text-blue-600" :
//                   ""
//                 }
//               >
//                 {log}
//               </div>
//             ))}
//           </div>
//         )}
//       </Card>

//       {/* Detailed Results */}
//       {renderSummaryCard()}
//     </div>
//   )
// }




"use client"

import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import Papa from "papaparse"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { useAppState } from "@/hooks/useAppState"

type CsvRow = Record<string, string>

interface State {
  code: string
  text: string
}

const counsellingTypes = [
  { id: 1, text: "All India Counselling" },
  { id: 2, text: "State Counselling" },
]

type SkippedDuplicate = {
  index: number
  row: CsvRow
  duplicateOf: { index: number; row: CsvRow }
}
type UpdatedRow = {
  index: number
  row: CsvRow
  conflictKey?: any
}
type InsertedRow = {
  index: number
  row: CsvRow
  conflictKey?: any
}
type InvalidRow = {
  index: number
  reason: string
  row: CsvRow
}
type BatchStat = {
  batchNum: number
  inserted: number
  updated: number
  failed: number
  total: number
  logs: string[]
  errors: any[]
}
type UploadResult = {
  success: boolean
  inserted: number
  updated: number
  failed: number
  total: number
  skippedDueToDuplicate: SkippedDuplicate[]
  updatedRows: UpdatedRow[]
  insertedRows: InsertedRow[]
  invalidBeforeInsert: InvalidRow[]
  batchStats: BatchStat[]
  logs?: string[]
}

const ResultTable = ({
  data,
  columns,
  title,
  itemsPerPage = 5,
}: {
  data: any[]
  columns: { key: string; label: string }[]
  title: string
  itemsPerPage?: number
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="border rounded-lg overflow-hidden mb-6">
      <div className="bg-gray-100 px-4 py-2 border-b font-medium">
        {title} ({data.length})
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {renderCellValue(row, col.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="bg-gray-50 px-4 py-2 border-t flex justify-between items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

const renderCellValue = (row: any, key: string) => {
  const keys = key.split('.')
  let value = row
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) break
  }
  if (value === undefined || value === null) return '-'
  if (typeof value === 'object') return JSON.stringify(value)
  return value.toString()
}

const CollapsibleSection = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className="border rounded-lg overflow-hidden mb-4">
      <button
        className="w-full flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{title}</span>
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="p-3">{children}</div>}
    </div>
  )
}

// Add a component to show real-time batch results
const RealTimeBatchResults = ({ batchResults }: { batchResults: BatchStat[] }) => {
  if (batchResults.length === 0) return null

  return (
    <Card className="mt-4 p-4">
      <h3 className="text-lg font-semibold mb-4">Real-time Batch Results</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batch #
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inserted
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Failed
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {batchResults.map((batch, index) => (
              <tr key={index} className={batch.failed > 0 ? "bg-red-50" : ""}>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {batch.batchNum}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {batch.failed > 0 ? "❌ Failed" : "✅ Success"}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {batch.inserted}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {batch.updated}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {batch.failed}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {batch.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default function BulkUploadForm() {
  const { showToast } = useAppState()
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<CsvRow[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)

  const [counsellingType, setCounsellingType] = useState<string>("")
  const [stateCode, setStateCode] = useState<string>("")
  const [stateList, setStateList] = useState<State[]>([])

  // Add state to track individual batch results
  const [batchResults, setBatchResults] = useState<BatchStat[]>([])

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0]
      setFile(selectedFile)
      if (selectedFile) {
        Papa.parse<CsvRow>(selectedFile, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setParsedData(results.data)
            setLogs([`📄 Parsed ${results.data.length} rows`])
            setUploadResult(null)
            setBatchResults([]) // Clear previous batch results
          },
          error: () => {
            showToast("error", "Failed to parse CSV")
          },
        })
      }
    },
  })

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch("/api/states")
        const json = await res.json()
        setStateList(json.data || [])
      } catch {
        showToast("error", "Failed to fetch states")
      }
    }
    fetchStates()
  }, [])

  function chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size))
    }
    return result
  }

  const handleUpload = async () => {
    if (!parsedData.length) return showToast("error", "No data to upload")
    if (!counsellingType || (counsellingType === "State Counselling" && !stateCode)) {
      return showToast("error", "Select counselling type and state")
    }

    setIsUploading(true)
    setLogs(["🚀 Starting upload..."])
    setUploadResult(null)
    setBatchResults([]) // Clear previous batch results

    const BATCH_SIZE = 500
    const batches = chunkArray(parsedData, BATCH_SIZE)
    
    // Initialize aggregated result
    const aggregatedResult: UploadResult = {
      success: true,
      inserted: 0,
      updated: 0,
      failed: 0,
      total: 0,
      skippedDueToDuplicate: [],
      updatedRows: [],
      insertedRows: [],
      invalidBeforeInsert: [],
      batchStats: [],
    }

    for (let i = 0; i < batches.length; i++) {
      setLogs((prev) => [...prev, `📦 Processing batch ${i + 1}/${batches.length}...`])
      
      try {
        const res = await fetch("/api/admin/add_bulk_data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: batches[i],
            counsellingType,
            stateCode: counsellingType === "State Counselling" ? stateCode : "all",
          }),
        })

        // Check if response is OK first
        if (!res.ok) {
          // Try to get error message from response
          let errorMsg = `HTTP error ${res.status}`
          try {
            const errorJson = await res.json()
            errorMsg = errorJson.error || errorJson.details || errorMsg
          } catch (e) {
            // If we can't parse JSON, try to get text
            try {
              errorMsg = await res.text()
            } catch (textError) {
              // Fallback to status text
              errorMsg = res.statusText || errorMsg
            }
          }
          throw new Error(errorMsg)
        }

        // Parse successful response
        const json = await res.json()

        // Create batch stat with detailed information
        const batchStat: BatchStat = {
          batchNum: i + 1,
          inserted: json.inserted || 0,
          updated: json.updated || 0,
          failed: json.failed || 0,
          total: json.total || batches[i].length,
          logs: json.batchStats?.[0]?.logs || [
            `Batch ${i + 1}: ${json.inserted} inserted, ${json.updated} updated, ${json.failed} failed`,
          ],
          errors: json.batchStats?.[0]?.errors || [],
        }

        // Update batch results immediately
        setBatchResults(prev => [...prev, batchStat])
        
        // Add to logs immediately
        setLogs(prev => [
          ...prev,
          `✅ Batch ${i + 1} completed: ${json.inserted} inserted, ${json.updated} updated, ${json.failed} failed`,
        ])

        // Aggregate results for final summary
        aggregatedResult.inserted += json.inserted || 0
        aggregatedResult.updated += json.updated || 0
        aggregatedResult.failed += json.failed || 0
        aggregatedResult.total += json.total || batches[i].length
        aggregatedResult.success = aggregatedResult.success && json.success
        aggregatedResult.skippedDueToDuplicate.push(...(json.skippedDueToDuplicate || []))
        aggregatedResult.updatedRows.push(...(json.updatedRows || []))
        aggregatedResult.insertedRows.push(...(json.insertedRows || []))
        aggregatedResult.invalidBeforeInsert.push(...(json.invalidBeforeInsert || []))
        aggregatedResult.batchStats.push(batchStat)

      } catch (err: any) {
        const errorMsg = `❌ Batch ${i + 1} failed: ${err.message || 'Unknown error'}`
        setLogs(prev => [...prev, errorMsg])
        
        // Add failed batch to results
        const failedBatchStat: BatchStat = {
          batchNum: i + 1,
          inserted: 0,
          updated: 0,
          failed: batches[i].length,
          total: batches[i].length,
          logs: [errorMsg],
          errors: [err.message || 'Unknown error'],
        }
        
        setBatchResults(prev => [...prev, failedBatchStat])
        aggregatedResult.batchStats.push(failedBatchStat)
        aggregatedResult.success = false
        aggregatedResult.failed += batches[i].length
        aggregatedResult.total += batches[i].length
      }

      // Small delay between batches to avoid overwhelming the server
      if (i < batches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    // Final summary
    setLogs((prev) => [
      ...prev,
      `🎉 Upload ${aggregatedResult.success ? 'completed successfully' : 'completed with errors'}`,
      `📊 Summary: ${aggregatedResult.inserted} inserted, ${aggregatedResult.updated} updated, ${aggregatedResult.failed} failed`,
    ])

    setUploadResult(aggregatedResult)
    showToast(aggregatedResult.success ? "success" : "error", 
      `Upload ${aggregatedResult.success ? 'completed' : 'failed'}`)
    setIsUploading(false)
  }

  const renderSummaryCard = () => {
    if (!uploadResult) return null

    return (
      <Card className="mt-4 p-4">
        <h3 className="text-lg font-semibold mb-4">Upload Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <div className="text-green-800 font-medium">Inserted</div>
            <div className="text-2xl font-bold">{uploadResult.inserted}</div>
          </div>
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <div className="text-blue-800 font-medium">Updated</div>
            <div className="text-2xl font-bold">{uploadResult.updated}</div>
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-200">
            <div className="text-red-800 font-medium">Failed</div>
            <div className="text-2xl font-bold">{uploadResult.failed}</div>
          </div>
        </div>

        <div className="space-y-4">
          {uploadResult.skippedDueToDuplicate.length > 0 && (
            <CollapsibleSection title={`Skipped Duplicates (${uploadResult.skippedDueToDuplicate.length})`}>
              <ResultTable
                data={uploadResult.skippedDueToDuplicate}
                columns={[
                  { key: 'index', label: 'Row #' },
                  { key: 'duplicateOf.index', label: 'Duplicate Of' },
                  { key: 'row.instituteName', label: 'Institute' },
                  { key: 'row.quota', label: 'Quota' },
                  { key: 'row.category', label: 'Category' },
                ]}
                title="Skipped Duplicates"
              />
            </CollapsibleSection>
          )}

          {uploadResult.updatedRows.length > 0 && (
            <CollapsibleSection title={`Updated Rows (${uploadResult.updatedRows.length})`}>
              <ResultTable
                data={uploadResult.updatedRows}
                columns={[
                  { key: 'index', label: 'Row #' },
                  { key: 'row.instituteName', label: 'Institute' },
                  { key: 'row.instituteType', label: 'InstituteType' },
                  { key: 'row.quota', label: 'Quota' },
                  { key: 'row.subQuota', label: 'SubQuota' },
                  { key: 'row.category', label: 'Category' },
                  { key: 'row.subCategory', label: 'SubCategory' },
                  { key: 'row.courseType', label: 'courseType' },
                ]}
                title="Updated Rows"
              />
            </CollapsibleSection>
          )}

          {uploadResult.insertedRows.length > 0 && (
            <CollapsibleSection title={`Inserted Rows (${uploadResult.insertedRows.length})`}>
              <ResultTable
                data={uploadResult.insertedRows}
                columns={[
                  { key: 'index', label: 'Row #' },
                  { key: 'row.instituteName', label: 'Institute' },
                  { key: 'row.instituteType', label: 'InstituteType' },
                  { key: 'row.quota', label: 'Quota' },
                  { key: 'row.subQuota', label: 'SubQuota' },
                  { key: 'row.category', label: 'Category' },
                  { key: 'row.subCategory', label: 'SubCategory' },
                  { key: 'row.courseType', label: 'courseType' },
                ]}
                title="Inserted Rows"
              />
            </CollapsibleSection>
          )}

          {uploadResult.invalidBeforeInsert.length > 0 && (
            <CollapsibleSection title={`Invalid Rows (${uploadResult.invalidBeforeInsert.length})`}>
              <ResultTable
                data={uploadResult.invalidBeforeInsert}
                columns={[
                  { key: 'index', label: 'Row #' },
                  { key: 'reason', label: 'Error' },
                  { key: 'row.instituteName', label: 'Institute' },
                ]}
                title="Invalid Rows"
              />
            </CollapsibleSection>
          )}

          {uploadResult.batchStats.length > 0 && (
            <CollapsibleSection title={`Batch Statistics (${uploadResult.batchStats.length} batches)`}>
              <ResultTable
                data={uploadResult.batchStats}
                columns={[
                  { key: 'batchNum', label: 'Batch #' },
                  { key: 'inserted', label: 'Inserted' },
                  { key: 'updated', label: 'Updated' },
                  { key: 'failed', label: 'Failed' },
                  { key: 'total', label: 'Total' },
                ]}
                title="Batch Statistics"
              />
            </CollapsibleSection>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className="p-4">
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Bulk Data Upload</h2>

        {/* Counselling Type */}
        <div>
          <label className="block mb-1">Counselling Type</label>
          <select
            value={counsellingType}
            onChange={(e) => {
              setCounsellingType(e.target.value)
              setStateCode("")
            }}
            className="w-full border p-2 rounded"
          >
            <option value="">Select</option>
            {counsellingTypes.map(c => (
              <option key={c.id} value={c.text}>{c.text}</option>
            ))}
          </select>
        </div>

        {/* State Dropdown */}
        {counsellingType === "State Counselling" && (
          <div>
            <label className="block mb-1">Select State</label>
            <select
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select State</option>
              {stateList.map(s => (
                <option key={s.code} value={s.code}>{s.text}</option>
              ))}
            </select>
          </div>
        )}

        {/* Dropzone with conditional green border */}
        <div
          {...getRootProps()}
          className={`p-6 text-center rounded cursor-pointer transition-all duration-300 border-2 border-dashed ${
            file ? "border-green-500 bg-green-50 text-green-800" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {file ? <p>{file.name}</p> : <p>Click or drop a CSV file</p>}
        </div>

        {/* Upload button */}
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => { 
              setFile(null)
              setParsedData([])
              setUploadResult(null)
              setLogs([])
              setBatchResults([])
            }}
          >
            Clear
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={isUploading || !file}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>

        {/* Logs */}
        {logs.length > 0 && (
          <div className="bg-gray-50 border rounded p-3 mt-4 max-h-64 overflow-y-auto text-sm space-y-1">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.startsWith("❌") ? "text-red-600" :
                  log.startsWith("✅") ? "text-green-600" :
                  log.startsWith("📦") ? "text-blue-600" :
                  ""
                }
              >
                {log}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Show real-time batch results during upload */}
      {isUploading && <RealTimeBatchResults batchResults={batchResults} />}

      {/* Detailed Results after upload completes */}
      {!isUploading && renderSummaryCard()}
    </div>
  )
}