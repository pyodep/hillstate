import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { loadClientContent, type ClientContentData } from "../data/loadClientContent";
import { MainPage } from "../pages/MainPage";
import { TypeDetailPage } from "../pages/TypeDetailPage";
import { TypeListPage } from "../pages/TypeListPage";

export default function App() {
  const [siteData, setSiteData] = useState<ClientContentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClientContent()
      .then(setSiteData)
      .catch((reason) => {
        console.error(reason);
        setError(reason instanceof Error ? reason.message : "데이터 설정 오류가 발생했습니다.");
      });
  }, []);

  if (error) {
    return (
      <main className="state-screen">
        <h1>데이터 설정 오류</h1>
        <p>{error}</p>
      </main>
    );
  }

  if (!siteData) {
    return (
      <main className="state-screen">
        <p>데이터를 불러오는 중입니다.</p>
      </main>
    );
  }

  const { siteConfig, unitTypes, layouts } = siteData;

  return (
    <Routes>
      <Route path="/" element={<MainPage siteConfig={siteConfig} layout={layouts.main} />} />
      <Route path="/types" element={<TypeListPage siteConfig={siteConfig} unitTypes={unitTypes} layout={layouts.typeList} />} />
      <Route
        path="/types/:typeId"
        element={<TypeDetailPage siteConfig={siteConfig} unitTypes={unitTypes} layout={layouts.typeDetail} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
