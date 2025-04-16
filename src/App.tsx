
import './App.css'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/Store'
import MultiStepForm from './components/MultiStepForm'
import { PersistGate } from 'redux-persist/integration/react'

function App() {


  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <MultiStepForm/>
      </PersistGate>
    </Provider>
  )
}

export default App
