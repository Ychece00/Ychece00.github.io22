import './assets/main.scss'
import App from './App.vue'
import { setupMock } from '@/mocks'
import { createApp, onMounted } from 'vue'
import { createPinia } from 'pinia'

setupMock()

const app = createApp(App).use(createPinia())

// 挂载应用并获取根实例
const mountApp = () => {
  app.mount('#app')
}

// 定义CharacterMarker组件
const CharacterMarker = defineComponent({
  name: 'CharacterMarker',
  data() {
    return {
      position: { x: 0, y: 0 }
    }
  },
  methods: {
    moveCharacterToPosition(targetX: number, targetY: number) {
      const speed = 0.05
      const updatePosition = () => {
        this.position.x += (targetX - this.position.x) * speed
        this.position.y += (targetY - this.position.y) * speed
        if (Math.abs(this.position.x - targetX) > speed || Math.abs(this.position.y - targetY) > speed) {
          requestAnimationFrame(updatePosition)
        }
      }
      updatePosition()
    }
  },
  template: `
    <div 
      :style="{
        position: 'absolute',
        left: position.x + 'px',
        top: position.y + 'px',
        width: '50px',
        height: '50px',
        backgroundColor: 'red',
        color: 'white',
        textAlign: 'center',
        lineHeight: '50px',
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
        pointerEvents: 'none'
      }"
    >
      q
    </div>
  `
})

// 在全局组件中注册CharacterMarker
app.component('CharacterMarker', CharacterMarker)

mountApp()

// 在应用挂载后添加事件监听器
onMounted(() => {
  const appElement = document.getElementById('app') as HTMLElement
  appElement.addEventListener('mousedown', (event: MouseEvent) => {
    if (event.ctrlKey && event.button === 0) {
      event.preventDefault()
      const rect = appElement.getBoundingClientRect()
      const clickPosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
      const characterElement = new CharacterMarker() as InstanceType<typeof CharacterMarker>
      characterElement.moveCharacterToPosition(clickPosition.x, clickPosition.y)
      // 将字符元素添加到app中
      appElement.appendChild(characterElement.$el)
    }
  })
})