import { createApp } from 'vue'


import App from './App.vue'
console.log('this is renderer main.ts')
const app = createApp(App)
// app
// .use(router)
// .use(store)
// .use(i18nPlugin)
// initPlugins(app)
// mountComponents(app)
app.mount('#root')
