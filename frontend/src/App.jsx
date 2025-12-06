import { useState, useEffect, useRef } from 'react'
import { Network } from 'vis-network'
import { DataSet } from 'vis-data'
import { ethers } from 'ethers'
import './App.css'

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE"
const CONTRACT_ABI = [
  "function issueCredential(string memory _conceptId, string memory _conceptName, uint8 _score) public",
  "function getCredentials(address _student) public view returns (tuple(string conceptId, string conceptName, uint256 timestamp, uint8 score)[])",
  "function verifyCompletion(address _student, string memory _conceptId) public view returns (bool)",
  "event CredentialIssued(address indexed student, string conceptId, string conceptName, uint8 score, uint256 timestamp)"
]

const API_URL = "http://localhost:8000"

function App() {
  const [graph, setGraph] = useState(null)
  const [selectedConcept, setSelectedConcept] = useState(null)
  const [conceptDetails, setConceptDetails] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [language, setLanguage] = useState("en")
  const [loading, setLoading] = useState(false)
  const [wallet, setWallet] = useState(null)
  const [credentials, setCredentials] = useState([])
  const [completedConcepts, setCompletedConcepts] = useState(new Set())
  const [quiz, setQuiz] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState({})
  const networkContainer = useRef(null)
  const networkRef = useRef(null)

  // Fetch graph data
  useEffect(() => {
    fetch(`${API_URL}/api/graph`)
      .then(res => res.json())
      .then(data => setGraph(data))
      .catch(err => console.error("Failed to fetch graph:", err))
  }, [])

  // Render network graph
  useEffect(() => {
    if (!graph || !networkContainer.current) return

    const nodes = new DataSet(
      graph.nodes.map(n => ({
        id: n.id,
        label: n.label,
        color: completedConcepts.has(n.id) ? '#4ade80' : 
               n.difficulty === 'beginner' ? '#60a5fa' :
               n.difficulty === 'intermediate' ? '#fbbf24' : '#f87171',
        font: { color: '#ffffff', size: 14 },
        shape: 'box',
        margin: 10
      }))
    )

    const edges = new DataSet(
      graph.edges.map((e, i) => ({
        id: i,
        from: e.from,
        to: e.to,
        arrows: 'to',
        color: e.relationship === 'required_for' ? '#94a3b8' : '#475569',
        dashes: e.relationship !== 'required_for'
      }))
    )

    const options = {
      physics: { stabilization: { iterations: 100 } },
      layout: { hierarchical: { direction: 'LR', sortMethod: 'directed', levelSeparation: 200 } },
      interaction: { hover: true }
    }

    networkRef.current = new Network(networkContainer.current, { nodes, edges }, options)
    networkRef.current.on('click', params => {
      if (params.nodes.length > 0) {
        handleNodeClick(params.nodes[0])
      }
    })
  }, [graph, completedConcepts])

  const handleNodeClick = async (nodeId) => {
    setSelectedConcept(nodeId)
    setQuiz(null)
    setQuizAnswers({})
    try {
      const res = await fetch(`${API_URL}/api/concept/${nodeId}`)
      const data = await res.json()
      setConceptDetails(data)
    } catch (err) {
      console.error("Failed to fetch concept:", err)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return
    
    const userMsg = { role: 'user', content: inputMessage }
    setChatMessages(prev => [...prev, userMsg])
    setInputMessage("")
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          concept_id: selectedConcept,
          language: language
        })
      })
      const data = await res.json()
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to AI. Please try again.' }])
    }
    setLoading(false)
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask!')
      return
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      setWallet(accounts[0])
      loadCredentials(accounts[0], provider)
    } catch (err) {
      console.error("Wallet connection failed:", err)
    }
  }

  const loadCredentials = async (address, provider) => {
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "YOUR_CONTRACT_ADDRESS_HERE") return
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      const creds = await contract.getCredentials(address)
      setCredentials(creds)
      setCompletedConcepts(new Set(creds.map(c => c.conceptId)))
    } catch (err) {
      console.error("Failed to load credentials:", err)
    }
  }

  const loadQuiz = async () => {
    if (!selectedConcept) return
    try {
      const res = await fetch(`${API_URL}/api/quiz/${selectedConcept}`)
      const data = await res.json()
      setQuiz(data)
    } catch (err) {
      console.error("Failed to load quiz:", err)
    }
  }

  const submitQuiz = async () => {
    if (!quiz || !wallet) return
    
    let correct = 0
    quiz.questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) correct++
    })
    const score = Math.round((correct / quiz.questions.length) * 100)
    
    if (score >= 60) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
        
        const tx = await contract.issueCredential(
          selectedConcept,
          conceptDetails.concept.label,
          score
        )
        await tx.wait()
        
        alert(`Congratulations! You scored ${score}%. Credential issued on blockchain!`)
        setCompletedConcepts(prev => new Set([...prev, selectedConcept]))
        loadCredentials(wallet, provider)
      } catch (err) {
        console.error("Failed to issue credential:", err)
        alert("Failed to issue credential. Check console for details.")
      }
    } else {
      alert(`You scored ${score}%. You need at least 60% to earn a credential. Try again!`)
    }
  }

  const getExplanation = async () => {
    if (!selectedConcept) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/explain/${selectedConcept}?language=${language}`, {
        method: 'POST'
      })
      const data = await res.json()
      setChatMessages(prev => [...prev, 
        { role: 'user', content: `Explain ${data.concept_name}` },
        { role: 'assistant', content: data.explanation }
      ])
    } catch (err) {
      console.error("Failed to get explanation:", err)
    }
    setLoading(false)
  }

  return (
    <div className="app">
      <header>
        <h1>🎓 VidyaChain</h1>
        <p>NCERT Physics Learning with AI & Blockchain Credentials</p>
        <div className="header-controls">
          <select value={language} onChange={e => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
          {wallet ? (
            <span className="wallet">🔗 {wallet.slice(0,6)}...{wallet.slice(-4)}</span>
          ) : (
            <button onClick={connectWallet}>Connect Wallet</button>
          )}
        </div>
      </header>

      <div className="main-content">
        <div className="graph-section">
          <h2>Knowledge Graph</h2>
          <div className="legend">
            <span><span className="dot beginner"></span> Beginner</span>
            <span><span className="dot intermediate"></span> Intermediate</span>
            <span><span className="dot advanced"></span> Advanced</span>
            <span><span className="dot completed"></span> Completed</span>
          </div>
          <div ref={networkContainer} className="network-container"></div>
        </div>

        <div className="detail-section">
          {conceptDetails ? (
            <div className="concept-card">
              <h2>{conceptDetails.concept.label}</h2>
              <p className="class-tag">Class {conceptDetails.concept.class} | Chapter {conceptDetails.concept.chapter}</p>
              <p>{conceptDetails.concept.description}</p>
              
              {conceptDetails.prerequisites.length > 0 && (
                <div className="prereqs">
                  <strong>Prerequisites:</strong> {conceptDetails.prerequisites.join(', ')}
                </div>
              )}
              
              <div className="concept-actions">
                <button onClick={getExplanation} disabled={loading}>
                  {loading ? '...' : language === 'hi' ? 'समझाइए' : 'Explain'}
                </button>
                <button onClick={loadQuiz}>Take Quiz</button>
              </div>

              {quiz && quiz.questions.length > 0 && (
                <div className="quiz-section">
                  <h3>Quiz</h3>
                  {quiz.questions.map((q, i) => (
                    <div key={i} className="quiz-question">
                      <p><strong>Q{i+1}:</strong> {q.question}</p>
                      {q.options.map((opt, j) => (
                        <label key={j} className="quiz-option">
                          <input
                            type="radio"
                            name={`q${i}`}
                            checked={quizAnswers[i] === j}
                            onChange={() => setQuizAnswers(prev => ({...prev, [i]: j}))}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  ))}
                  <button onClick={submitQuiz} disabled={!wallet}>
                    {wallet ? 'Submit & Earn Credential' : 'Connect Wallet First'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="placeholder">
              <p>👆 Click on a concept in the graph to explore</p>
            </div>
          )}
        </div>

        <div className="chat-section">
          <h2>🤖 {language === 'hi' ? 'विद्या गुरु' : 'VidyaGuru AI'}</h2>
          <div className="chat-messages">
            {chatMessages.length === 0 && (
              <p className="chat-hint">{language === 'hi' ? 'कोई भी प्रश्न पूछें...' : 'Ask any physics question...'}</p>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {loading && <div className="message assistant loading">Thinking...</div>}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              placeholder={language === 'hi' ? 'अपना प्रश्न लिखें...' : 'Type your question...'}
            />
            <button onClick={sendMessage} disabled={loading}>
              {language === 'hi' ? 'भेजें' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      {credentials.length > 0 && (
        <div className="credentials-section">
          <h2>🏆 Your Credentials ({credentials.length})</h2>
          <div className="credentials-list">
            {credentials.map((c, i) => (
              <div key={i} className="credential-card">
                <strong>{c.conceptName}</strong>
                <span>Score: {c.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App