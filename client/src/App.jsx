import { Navbar, Welcome, Footer,  } from "./components";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Transaction from "./Pages/Transaction";
import Service from "./Pages/Service";

const App = () => (
  <div className="min-h-screen">
    {/* <div className="gradient-bg-welcome">
      <Navbar />
      <Welcome />
    </div>
    <Services />
    <Transactions />
    <Footer /> */}

    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/services" element={<Service />} />
      <Route path="/transactions" element={<Transaction />} />
    </Routes>
  </div>
);

export default App;


{/* <Routes>
<Route path="/" element={<Homepage />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Signup />} />
<Route path="/feed" element={<Feed />} />
<Route path="/newreview" element={<Reviews />} />
<Route path="/review/:id" element={<SingleReview />} />
</Routes> */}