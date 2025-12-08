interface Student {
  _id: string
  name: string
  email: string
  password: string
  firstName: string
  lastName: string
  block: string
  department: string
  program: string
  year: string
  createdAt: string
  updatedAt: string
}

interface StudentApiResponse {
  students: Student[]
}

export class StudentManagementService {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = process.env.STUDENT_API_BASE_URL || ''
    this.apiKey = process.env.STUDENT_API_KEY || ''
  }

  async getAllStudents(): Promise<Student[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/students`, {
        headers: {
          'x-api-key': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.statusText}`)
      }

      const data: StudentApiResponse = await response.json()
      return data.students
    } catch (error) {
      console.error('Error fetching students:', error)
      throw error
    }
  }

  async getStudentByEmail(email: string): Promise<Student | null> {
    try {
      const students = await this.getAllStudents()
      const student = students.find(
        (s) => s.email.toLowerCase() === email.toLowerCase()
      )
      return student || null
    } catch (error) {
      console.error('Error finding student by email:', error)
      return null
    }
  }

  async validateStudentCredentials(
    email: string,
    password: string
  ): Promise<Student | null> {
    try {
      const student = await this.getStudentByEmail(email)
      
      if (!student) {
        return null
      }

      // Direct password comparison (since your API stores plain text passwords)
      if (student.password === password) {
        return student
      }

      return null
    } catch (error) {
      console.error('Error validating student credentials:', error)
      return null
    }
  }
}

export const studentManagementService = new StudentManagementService()
