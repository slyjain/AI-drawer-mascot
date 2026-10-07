import { useState } from 'react'
import { Tldraw, Editor, createShapeId } from 'tldraw'
import 'tldraw/tldraw.css'
import './App.css'
import { QuizShapeUtil, QUIZ_SHAPE_TYPE } from './shapes/QuizShapeUtil'
// import lessonData from './data/Lesson.json'

// Register our custom shapes so tldraw knows how to render them
const customShapeUtils = [QuizShapeUtil]

function App() {
  const [editor, setEditor] = useState<Editor | null>(null)

  // Helper function to get random coordinates within the screen bounds
  const getRandomCoords = () => {
    const x = Math.floor(Math.random() * (window.innerWidth - 450)) + 50; 
    const y = Math.floor(Math.random() * (window.innerHeight - 300)) + 50;
    return { x, y };
  }

  const drawQuiz = () => {
    if (!editor) return
    const { x, y } = getRandomCoords();

    // Spawn a Multiple Choice Question Custom Shape!
    editor.createShapes([{
      id: createShapeId(),
      type: QUIZ_SHAPE_TYPE as any,
      x: x,
      y: y,
      props: { 
        w: 500, 
        h: 400, 
        question: "What does the Left Shift operator (1 << i) do?",
        options: [
          "Creates a mask with only the i-th bit set to 1",
          "Divides the number by 2",
          "Reverses the binary string",
          "Adds 1 to the integer"
        ],
        answer: "Creates a mask with only the i-th bit set to 1"
      },
    }])
  }

  const clearBoard = () => {
    if (!editor) return
    editor.deleteShapes(Array.from(editor.getCurrentPageShapeIds()))
  }

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      {/* Floating Control Panel for Testing */}
      <div style={{ position: 'absolute', top: 60, left: 20, zIndex: 999, display: 'flex', gap: '10px' }}>
        <button onClick={drawQuiz} style={{ padding: '8px', cursor: 'pointer', backgroundColor: '#00535e', border: '1px solid #00acc1', borderRadius: '4px' }}>
          Spawn MCQ Quiz
        </button>
        <button onClick={clearBoard} style={{ padding: '8px', color: 'red', cursor: 'pointer' }}>Clear</button>
      </div>

      <Tldraw shapeUtils={customShapeUtils} onMount={setEditor} />
    </div>
  )
}

export default App
