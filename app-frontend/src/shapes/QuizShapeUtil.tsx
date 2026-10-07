import {
  Geometry2d,
  HTMLContainer,
  Rectangle2d,
  ShapeUtil,
  T,
} from 'tldraw';
import type { RecordProps, TLBaseShape } from 'tldraw';

// 1. Define the shape's type and properties
export const QUIZ_SHAPE_TYPE = 'quiz';

export type QuizShapeProps = {
  w: number;
  h: number;
  question: string;
  options: string[];
  answer: string;
  selectedOption: string | null;
};

// 2. Add it to the global shape map to fix TS errors with `this.editor.updateShape`
declare module 'tldraw' {
  export interface TLGlobalShapePropsMap {
    [QUIZ_SHAPE_TYPE]: QuizShapeProps;
  }
}

export type QuizShape = TLBaseShape<typeof QUIZ_SHAPE_TYPE, QuizShapeProps>;

// 2. Register the shape's props for validation
export const quizShapeProps: RecordProps<QuizShape> = {
  w: T.number,
  h: T.number,
  question: T.string,
  options: T.arrayOf(T.string),
  answer: T.string,
  selectedOption: T.string.nullable(),
};

// 3. Create the Shape Utility class
export class QuizShapeUtil extends ShapeUtil<QuizShape> {
  static override type = QUIZ_SHAPE_TYPE;
  static override props = quizShapeProps;

  // Initial properties when the shape is spawned
  getDefaultProps(): QuizShape['props'] {
    return {
      w: 450,
      h: 360,
      question: "Default Question?",
      options: ["Option A", "Option B"],
      answer: "Option A",
      selectedOption: null,
    };
  }

  // Hitbox / bounding box
  getGeometry(shape: QuizShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    });
  }

  // The outline drawn when the shape is selected
  getIndicatorPath(shape: QuizShape) {
    const path = new Path2D()
    path.rect(0, 0, shape.props.w, shape.props.h)
    return path
  }

  // Define how it renders in React
  component(shape: QuizShape) {
    const isCorrect = shape.props.selectedOption === shape.props.answer;
    const isAnswered = shape.props.selectedOption !== null;

    return (
      <HTMLContainer
        id={shape.id}
        style={{
          backgroundColor: '#fff',
          border: '2px solid #ccc',
          borderRadius: '12px',
          padding: '20px',
          fontFamily: 'sans-serif',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          pointerEvents: 'all', // Allows clicking inside the shape
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxSizing: 'border-box'
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#333', textAlign: 'center', lineHeight: '1.4' }}>
          {shape.props.question}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          {shape.props.options.map((option: string, idx: number) => (
            <button
              key={idx}
              onPointerDown={(e) => e.stopPropagation()} // Stop tldraw from dragging the shape when clicking the button
              onClick={() => {
                this.editor.updateShape<QuizShape>({
                  id: shape.id,
                  type: QUIZ_SHAPE_TYPE,
                  props: { selectedOption: option },
                });
              }}
              style={{
                padding: '10px 15px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: shape.props.selectedOption === option ? '#e0f7fa' : '#f9f9f9',
                color: '#333',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                transition: 'background-color 0.2s',
              }}
            >
              {option}
            </button>
          ))}
        </div>

        {isAnswered && (
          <div
            style={{
              marginTop: '16px',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: isCorrect ? '#d4edda' : '#f8d7da',
              color: isCorrect ? '#155724' : '#721c24',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {isCorrect ? '🎉 Correct!' : '❌ Incorrect. Try again.'}
          </div>
        )}
      </HTMLContainer>
    );
  }

  // The outline drawn when the shape is selected
  indicator(shape: QuizShape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={12} ry={12} />;
  }
}
