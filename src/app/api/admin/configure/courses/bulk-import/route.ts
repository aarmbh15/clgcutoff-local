// // pages/api/admin/configure/courses/bulk-import.ts
// import { NextApiRequest, NextApiResponse } from 'next'
// import { createAdminSupabaseClient } from '@/lib/supabase'

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ success: false, msg: 'Method not allowed' })
//   }

//   try {
//     const { courseType, courses } = req.body

//     if (!courseType || !courses || !Array.isArray(courses)) {
//       return res.status(400).json({ success: false, msg: 'Invalid data' })
//     }

//     const supabase = createAdminSupabaseClient()

//     // Insert courses in bulk
//     const courseData = courses.map(course => ({
//       text: course,
//       type: courseType
//     }))

//     const { data, error } = await supabase
//       .from('course_type_and_courses')
//       .insert(courseData)
//       .select()

//     if (error) {
//       console.error('Bulk import error:', error)
//       return res.status(500).json({ success: false, msg: 'Failed to import courses' })
//     }

//     return res.status(200).json({
//       success: true,
//       msg: `Successfully imported ${data.length} courses`,
//       data: { type: courseType }
//     })

//   } catch (error) {
//     console.error('Bulk import error:', error)
//     return res.status(500).json({ success: false, msg: 'Internal server error' })
//   }
// }

// pages/api/admin/configure/courses/bulk-import.ts
import { createAdminSupabaseClient } from "@/lib/supabase"
import { isEmpty } from "@/utils/utils"
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, msg: 'Method not allowed' })
  }

  try {
    const { courseType, courses } = req.body

    if (!courseType || !courses || !Array.isArray(courses)) {
      return res.status(400).json({ success: false, msg: 'Invalid data' })
    }

    const supabase = createAdminSupabaseClient()

    // Filter out empty courses and duplicates
    const validCourses = courses
      .map(course => course.trim())
      .filter(course => course !== "")
      .filter((course, index, self) => self.indexOf(course) === index) // Remove duplicates

    if (validCourses.length === 0) {
      return res.status(400).json({ success: false, msg: 'No valid courses provided' })
    }

    // Check for existing courses first
    const { data: existingCourses, error: selectError } = await supabase
      .from("course_type_and_courses")
      .select("text, type")
      .eq("type", courseType)
      .in("text", validCourses)

    if (selectError) {
      return res.status(500).json({ 
        success: false, 
        msg: "Failed to check existing courses", 
        error: selectError 
      })
    }

    // Filter out courses that already exist
    const existingCourseNames = existingCourses?.map(course => course.text) || []
    const newCourses = validCourses.filter(course => !existingCourseNames.includes(course))

    if (newCourses.length === 0) {
      return res.status(200).json({
        success: true,
        msg: "All courses already exist",
        data: { 
          type: courseType,
          existing: existingCourseNames,
          skipped: validCourses.length
        }
      })
    }

    // Prepare data for bulk insert
    const courseData = newCourses.map(course => ({
      text: course,
      type: courseType
    }))

    // Insert new courses in bulk
    const { data: insertedData, error: insertError } = await supabase
      .from("course_type_and_courses")
      .insert(courseData)
      .select()

    if (insertError || isEmpty(insertedData)) {
      return res.status(500).json({
        success: false,
        msg: "Failed to insert courses",
        error: insertError
      })
    }

    return res.status(200).json({
      success: true,
      msg: `Successfully imported ${insertedData.length} courses, ${existingCourseNames.length} already existed`,
      data: { 
        type: courseType,
        inserted: insertedData,
        existing: existingCourseNames
      }
    })

  } catch (error) {
    console.error('Bulk import error:', error)
    return res.status(500).json({ 
      success: false, 
      msg: 'Internal server error',
    //   error: error.message 
    })
  }
}