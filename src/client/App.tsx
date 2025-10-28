import { Routes, Route } from 'react-router-dom';
import MapPage from './routes/MapPage';
import Post from "./routes/Post";
import './App.css';

function App() {

  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="/create-post" element={<Post />} />
    </Routes>
  )
}

export default App
