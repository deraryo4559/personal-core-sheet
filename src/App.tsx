import React, { useMemo, useState, useEffect } from "react";
import { Printer } from "lucide-react";

type Episode = { from: string; text: string };

interface SheetData {
  visions: string[];
  engineSlogan: string;
  engines: string[];
  episodes: Episode[];
}

const A4 = {
  w: "210mm",
  h: "297mm",
  padX: "12mm",
  padY: "10mm",
};

const STORAGE_KEY = "pcs-sheet-data";

const App: React.FC = () => {
  const emptyEpisodes = useMemo(
    () => Array.from({ length: 6 }, () => ({ from: "", text: "" })),
    []
  );

  // ローカルストレージからデータを読み込む
  const loadDataFromStorage = (): SheetData | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // データ構造を検証
        if (
          parsed &&
          Array.isArray(parsed.visions) &&
          typeof parsed.engineSlogan === "string" &&
          Array.isArray(parsed.engines) &&
          Array.isArray(parsed.episodes)
        ) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
    }
    return null;
  };

  const [data, setData] = useState<SheetData>(() => {
    const loaded = loadDataFromStorage();
    return (
      loaded || {
        visions: ["", "", ""],
        engineSlogan: "",
        engines: ["", "", ""],
        episodes: emptyEpisodes,
      }
    );
  });

  // データが変更されたときにローカルストレージに保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save data to localStorage:", error);
    }
  }, [data]);

  const handleVisionChange = (index: number, value: string) => {
    setData((prev) => {
      const visions = [...prev.visions];
      visions[index] = value;
      return { ...prev, visions };
    });
  };

  const handleEngineChange = (index: number, value: string) => {
    setData((prev) => {
      const engines = [...prev.engines];
      engines[index] = value;
      return { ...prev, engines };
    });
  };

  const handleEpisodeChange = (
    index: number,
    field: keyof Episode,
    value: string
  ) => {
    setData((prev) => {
      const episodes = prev.episodes.map((ep, i) =>
        i === index ? { ...ep, [field]: value } : ep
      );
      return { ...prev, episodes };
    });
  };

  // 文字数チェック関数
  const validateTextLength = (text: string, maxLength: number): boolean => {
    return text.length <= maxLength;
  };

  // エピソードのフォントサイズを文字数に応じて調整
  const getEpisodeFontSize = (textLength: number): string => {
    if (textLength <= 40) {
      return "9.6px";
    } else if (textLength <= 80) {
      return "7.5px";
    } else {
      return "7.5px";
    }
  };

  // PDF出力前のバリデーション
  const handlePrint = () => {
    // My Vision (30字以内)
    const visionErrors = data.visions.filter((v) => !validateTextLength(v, 30));
    if (visionErrors.length > 0) {
      alert(
        "文字数オーバーです\n【My Vision】は各30字以内で入力してください。"
      );
      return;
    }

    // My Engine スローガン (30字以内)
    if (!validateTextLength(data.engineSlogan, 30)) {
      alert(
        "文字数オーバーです\n【My Engine】のスローガンは30字以内で入力してください。"
      );
      return;
    }

    // My Engine 原動力 (30字以内)
    const engineErrors = data.engines.filter((e) => !validateTextLength(e, 30));
    if (engineErrors.length > 0) {
      alert(
        "文字数オーバーです\n【My Engine】の原動力は各30字以内で入力してください。"
      );
      return;
    }

    // My Episode エピソード (80字以内)
    const episodeTextErrors = data.episodes.filter(
      (ep) => !validateTextLength(ep.text, 80)
    );
    if (episodeTextErrors.length > 0) {
      alert(
        "文字数オーバーです\n【My Episode】のエピソードは各80字以内で入力してください。"
      );
      return;
    }

    // My Episode from (8字以内)
    const episodeFromErrors = data.episodes.filter(
      (ep) => !validateTextLength(ep.from, 8)
    );
    if (episodeFromErrors.length > 0) {
      alert(
        "文字数オーバーです\n【My Episode】の【from】は8字以内で入力してください。"
      );
      return;
    }

    // すべてのバリデーションを通過したらPDF出力
    window.print();
  };

  return (
    <div
      className="min-h-screen bg-[#d9d9d9] py-6 print:py-0 print:bg-white overflow-auto text-black"
      style={{ colorScheme: "light", minWidth: "794px" }}
    >
      {/* 操作パネル（印刷時は非表示） */}
      <div className="max-w-[210mm] mx-auto mb-4 flex justify-end print:hidden px-4">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-md shadow-md transition-all active:scale-95 print-button"
          style={{ color: "#ffffff" }}
        >
          <Printer size={16} style={{ color: "#ffffff" }} />
          <span className="font-bold text-sm" style={{ color: "#ffffff" }}>
            PDF出力 / 印刷
          </span>
        </button>
      </div>

      {/* A4 Sheet */}
      <div
        className="mx-auto bg-white print:shadow-none box-border relative overflow-hidden"
        style={{ width: A4.w, height: A4.h, padding: `${A4.padY} ${A4.padX}` }}
      >
        {/* pale circle - 「私は...だ。」の上端に中心を配置 */}
        <div
          className="absolute left-1/2 top-[160.5mm] -translate-x-1/2 -translate-y-1/2 w-[58mm] h-[58mm] rounded-full bg-[#e6e6e6] opacity-70 pointer-events-none"
          style={{ zIndex: 0 }}
        />

        {/* Title */}
        <div className="mb-[3mm] -mt-[3mm]">
          <div className="text-[22pt] leading-none font-bold tracking-tight">
            II. Personal Core Sheet
          </div>
        </div>

        {/* Top Instructions Box */}
        <div className="mx-auto border-[2px] border-black bg-[#f2f2f2] px-[6mm] py-[3.5mm] text-center">
          <div className="text-[10.5px] leading-[1.55] font-bold">
            このシートはあなたの“粒ちがいの個性”を知るためのものです。
          </div>
          <div className="text-[10.5px] leading-[1.55] font-medium">
            過去を振り返って自分らしさを知るもよし、将来やりたいことから自分らしさを知るのもよし。
          </div>
          <div className="text-[10.5px] leading-[1.55] font-medium">
            学生時代の経験という一側面だけでなく、あなたらしさを360度全方位から捉えた、“等身大の個性”を教えてください。
          </div>
          <div className="text-[10.5px] leading-[1.55] font-medium">
            ※【My Vision】【My Episode】どちらから書き始めても構いません。
          </div>
        </div>

        {/* ===== My Vision (grey with down-point) ===== */}
        <div
          className="mt-[6mm] bg-[#d9d9d9] px-[6mm] pt-[4mm] pb-[8.5mm]"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 90%, 50% 100%, 0% 90%)",
          }}
        >
          <div className="text-[14px] font-bold mb-[1.5mm]">【My Vision】</div>
          <div className="text-[10.5px] leading-[1.55] mb-[3mm]">
            これからの人生で達成したいことや社会の中で生み出したい成果、将来にわたって大切にしたいライフスタイルなど、あなたの中長期的な
            <br />
            ビジョンを最大3つ、各30字で表現してください。
          </div>

          <div className="flex flex-col gap-[2.2mm]">
            {data.visions.map((v, i) => (
              <div
                key={i}
                className={`bg-white border-[1.6px] h-[11.5mm] flex items-center ${
                  v.length > 30 ? "border-red-500" : "border-black"
                }`}
              >
                <input
                  type="text"
                  value={v}
                  onChange={(e) => handleVisionChange(i, e.target.value)}
                  className="w-full text-center font-bold text-[12.5px] leading-none focus:outline-none bg-transparent px-2"
                  spellCheck={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ===== My Engine ===== */}
        <div
          className="mt-[6.5mm] relative bg-transparent"
          style={{ zIndex: 1 }}
        >
          <div
            className="text-[14px] font-bold mb-[1.5mm]"
            style={{ position: "relative", zIndex: 1 }}
          >
            【My Engine】
          </div>

          <div
            className="text-[10.5px] leading-[1.55]"
            style={{ position: "relative", zIndex: 1 }}
          >
            あなたのこだわりや、判断軸となっている価値観など、人生において原動力となっているものを最大3つ、各30字以内で表現してください。
            <br />
            そしてそれらをまとめて、あなたの"等身大の個性"を表す言葉を30字以内でつけてください。
          </div>
          <div
            className="text-[10.5px] leading-[1.55] mt-[1mm]"
            style={{ position: "relative", zIndex: 1 }}
          >
            ※原動力は一見矛盾する内容でも構いません。
          </div>

          {/* Engine input container */}
          <div className="relative mt-[5mm]" style={{ zIndex: 1 }}>
            {/* slogan row */}
            <div className="relative flex items-center gap-[3mm]">
              <div className="text-[12px] font-medium">私は</div>
              <div
                className={`flex-1 border-[2px] bg-white h-[12mm] flex items-center px-2 ${
                  data.engineSlogan.length > 30
                    ? "border-red-500"
                    : "border-black"
                }`}
              >
                <input
                  type="text"
                  value={data.engineSlogan}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      engineSlogan: e.target.value,
                    }))
                  }
                  className="w-full text-center font-bold text-[13px] focus:outline-none bg-transparent"
                  spellCheck={false}
                />
              </div>
              <div className="text-[12px] font-medium">だ。</div>
            </div>

            {/* three engine boxes */}
            <div className="relative mt-[2.5mm] grid grid-cols-3 gap-[3mm]">
              {data.engines.map((e, i) => (
                <div
                  key={i}
                  className={`border-[1.6px] bg-white h-[16mm] flex items-center justify-center px-2 ${
                    e.length > 30 ? "border-red-500" : "border-black"
                  }`}
                >
                  <textarea
                    value={e}
                    onChange={(ev) => handleEngineChange(i, ev.target.value)}
                    className="w-full h-full resize-none border-none text-[11.5px] font-bold text-center leading-[1.25] focus:outline-none bg-transparent pt-[2.5mm]"
                    spellCheck={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== My Episode (grey with up-point) ===== */}
        <div
          className="mt-[18mm] bg-[#d9d9d9] px-[6mm] pt-[3mm] pb-[0.3mm]"
          style={{
            clipPath: "polygon(0% 7%, 50% 0%, 100% 7%, 100% 100%, 0% 100%)",
          }}
        >
          <div className="text-[14px] font-bold mb-0 mt-[4mm]">
            【My Episode】
          </div>

          <div className="text-[10.5px] leading-[1.55]">
            あなたの人生や日々の生活を振り返り、「あなたらしさ」が表れていると思う具体的なエピソードを最大6つ、各80字以内で教えてください。
          </div>
          <div className="text-[10.5px] leading-[1.55] mt-[0.5mm]">
            ※「あなたらしさ」が表れているものであればどんな些細なことでも構いません。良い面だけを書くのではなく、
            <br />
            嫌いなことや苦手なことも含めて、あなたらしいエピソードを書いてください。
          </div>
          <div className="text-[10.5px] leading-[1.55] mt-[0.5mm]">
            ※思い悩んだら是非、家族や友人等、他の人にも聞いてみてください。自分では気づかなかった一面が見つかるかもしれません。
          </div>
          <div className="text-[10.5px] leading-[1.55] mt-[0.5mm]">
            ※パーソナリティ理解を目的としたシートになりますので、自身が書きたくないと思うことを記入する必要もありません。
          </div>

          {/* episode cards */}
          <div className="mt-[2mm] mb-[2mm] grid grid-cols-3 grid-rows-2 gap-[3mm]">
            {data.episodes.map((ep, i) => (
              <div
                key={i}
                className={`bg-white border-[1.8px] px-[3mm] py-[2.5mm] h-[23mm] flex flex-col ${
                  ep.text.length > 80 || ep.from.length > 8
                    ? "border-red-500"
                    : "border-black"
                }`}
              >
                {/* header */}
                <div className="flex items-center gap-2 text-[10.5px] font-bold leading-none justify-start">
                  <span>【from</span>
                  <input
                    type="text"
                    value={ep.from}
                    onChange={(e) =>
                      handleEpisodeChange(i, "from", e.target.value)
                    }
                    className={`flex-1 text-left focus:outline-none bg-transparent border-b pb-[0.6mm] ${
                      ep.from.length > 8 ? "border-red-500" : "border-black/40"
                    }`}
                    spellCheck={false}
                  />
                  <span>】</span>
                </div>

                <div className="mt-[2mm] flex-1">
                  <textarea
                    value={ep.text}
                    onChange={(e) =>
                      handleEpisodeChange(i, "text", e.target.value)
                    }
                    className="w-full h-full resize-none border-none leading-[1.35] focus:outline-none bg-transparent"
                    style={{
                      fontSize: getEpisodeFontSize(ep.text.length),
                    }}
                    spellCheck={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-[0.2mm] right-[12mm] text-[10px] font-medium">
          HAKUHODO Inc.
        </div>

        {/* print / fine-tuning */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* base fonts (imageに近づける) */
              :root{
                --jp: "Noto Sans JP","Hiragino Kaku Gothic ProN","Yu Gothic","Meiryo",sans-serif;
                --serif: "Times New Roman","Times",serif;
                color-scheme: light;
              }
              *{ 
                font-family: var(--jp);
                color-scheme: light;
              }
              .font-serif{ font-family: var(--serif) !important; }

              /* ナイトモードを無効化し、すべてのテキストを黒色に */
              html, body, div, span, p, h1, h2, h3, h4, h5, h6, input, textarea, button {
                color: #000000 !important;
                color-scheme: light !important;
              }
              /* PDF出力ボタンのテキストを強制的に白に */
              .print-button, .print-button *, .print-button span {
                color: #ffffff !important;
              }

              /* hide scrollbars in textareas */
              textarea::-webkit-scrollbar{ display:none; }
              textarea{ scrollbar-width:none; }

              @media print{
                body{ margin:0; padding:0; background:#fff !important; }
                .print\\:hidden{ display:none !important; }
                input::placeholder, textarea::placeholder{ color: transparent !important; }
                *{ -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                @page{ margin:0; size:A4 portrait; }
              }
            `,
          }}
        />
      </div>
    </div>
  );
};

export default App;
