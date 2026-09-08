import { useParams, Navigate } from 'react-router-dom'
import LessonLayout from '../layouts/LessonLayout'
import TestLayout from '../layouts/TestLayout'
import ListeningLayout from '../layouts/ListeningLayout'
import ReadingLayout from '../layouts/ReadingLayout'

function PostPage() {
  const { section } = useParams()

  switch (section) {
    case 'lessons':
    case 'lesson':
      return <LessonLayout />
    case 'tests':
    case 'test':
      return <TestLayout />
    case 'listening':
      return <ListeningLayout />
    case 'reading':
      return <ReadingLayout />
    default:
      return <Navigate to="/" replace />
  }
}

export default PostPage
