import { useState, useEffect } from 'react'
import 'prismjs/themes/prism-tomorrow.css'
import Editor from 'react-simple-code-editor'
import prism from 'prismjs'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'

function App() {
  const [code, setCode] = useState(`function sum() {
    return 1 + 1;
    }`)
  const [review, setReview] = useState('')

  useEffect(() => {
    prism.highlightAll()
  }, []) // Added dependency array to ensure it runs only once

  async function reviewCode() {
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000'
      const response = await axios.post(`${API_URL}/ai/get-review`, { code })
      setReview(response.data)
    } catch (error) {
      console.error("Error fetching review:", error)
      setReview("Failed to fetch review. Please try again.")
    }
  }
  
  return (
    <>
      <main>
        <div className='left'>
          <div className='code'>
            <Editor
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
                padding={10}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 16,
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  height: "100%",
                  width: "100%"
                }}
              />
          </div>
          <div 
          className='review'
          onClick={reviewCode}
          >Review</div>
        </div>
        <div className='right'>
          <Markdown rehypePlugins={[ rehypeHighlight ]}>{review}</Markdown>
        </div>
      </main>      
    </>
  )
}

export default App