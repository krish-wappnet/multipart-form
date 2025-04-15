
import './App.css'
import { Provider } from 'react-redux'
import { store } from './redux/Store'
import MultiStepForm from './components/MultiStepForm'

function App() {


  return (
    <Provider store={store}>
      <MultiStepForm/>
    </Provider>
  )
}

export default App
