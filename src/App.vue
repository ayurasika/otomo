<template>
  <div class="app">
    <div class="chat-container">
      <div class="chat-header">
        <h1>otomo</h1>
        <p class="subtitle">世界一ハードルの低い、全肯定応援団</p>
      </div>
      
      <div class="chat-messages" ref="messagesContainer">
        <div 
          v-for="(msg, index) in messages" 
          :key="index"
          :class="['message', msg.role]"
        >
          <div class="message-content">
            {{ msg.content }}
          </div>
        </div>
        <div v-if="loading" class="message assistant">
          <div class="message-content loading">
            考え中...
          </div>
        </div>
      </div>

      <div class="chat-input-container">
        <form @submit.prevent="sendMessage" class="chat-form">
          <input
            v-model="inputMessage"
            type="text"
            placeholder="メッセージを入力..."
            :disabled="loading"
            class="chat-input"
          />
          <button 
            type="submit" 
            :disabled="loading || !inputMessage.trim()"
            class="send-button"
          >
            送信
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const messages = ref([])
const inputMessage = ref('')
const loading = ref(false)
const messagesContainer = ref(null)
const conversationHistory = ref([])

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || loading.value) return

  const userMessage = inputMessage.value.trim()
  inputMessage.value = ''
  
  // ユーザーメッセージを追加
  messages.value.push({
    role: 'user',
    content: userMessage
  })
  
  conversationHistory.value.push({
    role: 'user',
    content: userMessage
  })
  
  scrollToBottom()
  loading.value = true

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage,
        conversationHistory: conversationHistory.value.slice(0, -1) // 現在のメッセージを除く
      })
    })

    if (!response.ok) {
      throw new Error('API呼び出しに失敗しました')
    }

    const data = await response.json()
    
    // アシスタントメッセージを追加
    messages.value.push({
      role: 'assistant',
      content: data.message
    })
    
    conversationHistory.value.push({
      role: 'assistant',
      content: data.message
    })
    
    scrollToBottom()
  } catch (error) {
    console.error('Error:', error)
    messages.value.push({
      role: 'assistant',
      content: '申し訳ありません。エラーが発生しました。もう一度お試しください。'
    })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

onMounted(() => {
  // 初回の挨拶メッセージを送信
  setTimeout(() => {
    sendInitialGreeting()
  }, 500)
})

const sendInitialGreeting = async () => {
  loading.value = true
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'こんにちは',
        conversationHistory: []
      })
    })

    if (!response.ok) {
      throw new Error('API呼び出しに失敗しました')
    }

    const data = await response.json()
    
    messages.value.push({
      role: 'assistant',
      content: data.message
    })
    
    conversationHistory.value.push({
      role: 'assistant',
      content: data.message
    })
    
    scrollToBottom()
  } catch (error) {
    console.error('Error:', error)
    messages.value.push({
      role: 'assistant',
      content: '今日も生きててえらい！何かあった？'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.chat-container {
  width: 100%;
  max-width: 800px;
  height: 90vh;
  max-height: 800px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 30px;
  text-align: center;
}

.chat-header h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 5px;
}

.chat-header .subtitle {
  font-size: 14px;
  opacity: 0.9;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  max-width: 75%;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  align-self: flex-end;
  justify-content: flex-end;
}

.message.assistant {
  align-self: flex-start;
  justify-content: flex-start;
}

.message-content {
  padding: 12px 18px;
  border-radius: 18px;
  line-height: 1.6;
  word-wrap: break-word;
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-content {
  background: #f0f0f0;
  color: #333;
  border-bottom-left-radius: 4px;
}

.message-content.loading {
  color: #999;
  font-style: italic;
}

.chat-input-container {
  border-top: 1px solid #e0e0e0;
  padding: 20px;
  background: #fafafa;
}

.chat-form {
  display: flex;
  gap: 10px;
}

.chat-input {
  flex: 1;
  padding: 12px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.chat-input:focus {
  border-color: #667eea;
}

.chat-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.send-button {
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.send-button:active:not(:disabled) {
  transform: translateY(0);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* スクロールバーのスタイリング */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>


