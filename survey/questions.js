/* ============================================================
   🌊 Ocean Pop！澎湖海洋小勇士 STEAM 運動探索營
   家長活動回饋問卷 —— 題目設定檔 (questions.js)

   👉 未來你只要改這個檔案，就能：
      新增題目 / 刪除題目 / 修改文字 / 更換選項 / 改題型
      網頁畫面會「自動」依照這份資料產生，不用動 HTML。

   題型 type 可用：
      "single_choice"    單選（卡片）
      "multiple_choice"  複選（卡片，可多選）
      "rating"           1~5 星評分（可用 max 調整星數）
      "short_text"       簡短文字回答
      "long_text"        長文字回答

   每一題可用的欄位：
      questionId   資料代號（英文，Google Sheet 對照用，務必唯一）
      type         題型（見上）
      title        題目文字（也會成為試算表的欄位標題）
      subtitle     題目下方的小提示（可省略）
      required     是否必填 true / false
      options      選項陣列（單選 / 複選才需要）
      placeholder  輸入框提示字（文字題才需要）
      max          星數（評分題，可省略，預設 5）
   ============================================================ */

const SURVEY = {
  eventName: "Ocean Pop！澎湖海洋小勇士",
  eventSubtitle: "STEAM 運動探索營",
  formTitle: "家長活動回饋問卷",
  org: "澎湖縣皇家樂活健康運動協會",
  introText:
    "謝謝您讓孩子一起參加這次的澎湖海洋小勇士！\n我們想透過簡單的問卷，了解孩子回家後的分享與感受，作為未來活動規劃的重要參考 ❤️",
  estimateText: "約 2～3 分鐘完成",

  questions: [
    {
      questionId: "overall_feeling",
      type: "single_choice",
      title: "孩子參加完活動後，整體感受如何？",
      required: true,
      options: ["非常喜歡", "喜歡", "普通", "不太喜歡", "不喜歡"]
    },
    {
      questionId: "shared_after",
      type: "single_choice",
      title: "活動結束後，孩子有主動和您分享活動內容嗎？",
      required: true,
      options: ["分享很多", "有分享一些", "問了才說", "幾乎沒有提到"]
    },
    {
      questionId: "mentioned_activities",
      type: "multiple_choice",
      title: "孩子最常跟您提到哪些活動內容？",
      subtitle: "可以複選喔",
      required: true,
      options: [
        "STEAM 科學實驗",
        "海洋與天氣主題",
        "運動體能活動",
        "團隊闖關",
        "DIY 手作",
        "英文互動",
        "老師或小組長",
        "認識新朋友",
        "其他"
      ]
    },
    {
      questionId: "most_fun",
      type: "short_text",
      title: "孩子覺得這次活動最好玩的是什麼？",
      required: false,
      placeholder: "請簡單描述～"
    },
    {
      questionId: "want_again_activity",
      type: "short_text",
      title: "孩子有沒有提到哪個活動「下次還想再玩」？",
      required: false,
      placeholder: "例如：科學實驗、闖關遊戲…"
    },
    {
      questionId: "gains",
      type: "multiple_choice",
      title: "您覺得孩子參加活動後，有哪些明顯的收穫？",
      subtitle: "可以複選",
      required: true,
      options: [
        "更願意與人互動",
        "增加自信",
        "增加運動量",
        "對科學更有興趣",
        "學到海洋知識",
        "對英文接受度提高",
        "團隊合作能力提升",
        "獨立性提升",
        "其他"
      ]
    },
    {
      questionId: "shared_new_knowledge",
      type: "single_choice",
      title: "孩子回家後，有沒有主動分享活動中學到的新知識？",
      required: true,
      options: ["有，而且分享很多", "有分享一點", "沒有特別提到", "不確定"]
    },
    {
      questionId: "overall_satisfaction",
      type: "rating",
      title: "以家長角度來看，您對這次活動的整體滿意度如何？",
      subtitle: "點擊星星為我們評分",
      required: true,
      max: 5
    },
    {
      questionId: "willing_rejoin",
      type: "single_choice",
      title: "如果未來再次舉辦類似活動，您願意讓孩子再次參加嗎？",
      required: true,
      options: ["非常願意", "會考慮", "看時間與內容", "暫時不考慮"]
    },
    {
      questionId: "memorable_words",
      type: "long_text",
      title: "有沒有哪一句孩子回家後說的話，讓您印象特別深刻？或想給我們的建議 ❤️",
      required: false,
      placeholder: "任何想對我們說的話都可以寫在這裡～"
    }
  ]
};

// 讓 script.js 取用（單檔測試時直接是全域變數；未來拆檔或用模組也相容）
if (typeof window !== "undefined") window.SURVEY = SURVEY;
