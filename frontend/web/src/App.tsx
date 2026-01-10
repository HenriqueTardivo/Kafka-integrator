import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OrderList } from "./pages/OrderList";
import { OrderDetail } from "./pages/OrderDetail";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OrderList />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
