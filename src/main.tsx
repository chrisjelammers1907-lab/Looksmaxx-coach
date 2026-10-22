import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "./styles.css";
import "./v2.css";
import "./editorial.css";
import { DemoProvider } from "./lib/store";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Guide from "./pages/Guide";
import About from "./pages/About";
import Topic from "./pages/Topic";
import Clothing from "./pages/Clothing";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Coach from "./pages/Coach";
import Plan from "./pages/Plan";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DemoProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="categories" element={<Categories />} />
            <Route path="about" element={<About />} />
            <Route path="topics/:topic/guide" element={<Guide />} />
            <Route path="topics/clothing" element={<Clothing />} />
            <Route path="topics/:topic" element={<Topic />} />
            <Route path="explore" element={<Community />} />
            <Route path="post/:id" element={<Community />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="messages" element={<Messages />} />
            <Route path="coach" element={<Coach />} />
            <Route path="plan" element={<Plan />} />
            <Route
              path="*"
              element={
                <div className="empty">
                  <h1>This page has moved.</h1>
                  <Link to="/" className="button">
                    Back to your space
                  </Link>
                </div>
              }
            />
          </Route>
        </Routes>
      </DemoProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
