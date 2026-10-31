import { Route, Routes } from "react-router";
import { I18nProvider } from "./i18n/I18n.jsx";
import { PrefsProvider } from "./state/prefs.jsx";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Classes from "./pages/Classes.jsx";
import Membership from "./pages/Membership.jsx";
import Coaches from "./pages/Coaches.jsx";
import BodyLab from "./pages/BodyLab.jsx";
import Visit from "./pages/Visit.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <I18nProvider>
      <PrefsProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/coaches" element={<Coaches />} />
            <Route path="/body-lab" element={<BodyLab />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </PrefsProvider>
    </I18nProvider>
  );
}
