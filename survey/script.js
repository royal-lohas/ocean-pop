/* ============================================================
   🌊 Ocean Pop! 家長回饋問卷 —— 程式邏輯 (script.js)

   這支檔案只負責「畫面與流程」，題目內容全部來自 questions.js。
   新增/修改題目請改 questions.js，這裡通常不用動。

   流程：首頁 → 一題一頁作答 → 檢查頁 → 送出 → 完成頁
   ============================================================ */

(function () {
  "use strict";

  var Q = window.SURVEY.questions;
  var state = {
    index: 0,       // 目前題目索引
    answers: {}     // { questionId: 答案 }  單選=字串 / 複選=陣列 / 評分=數字 / 文字=字串
  };

  // ---- 元素 ----
  var app = document.getElementById("app");
  var screens = {
    intro: document.getElementById("screen-intro"),
    question: document.getElementById("screen-question"),
    review: document.getElementById("screen-review"),
    done: document.getElementById("screen-done")
  };

  // ---- 首頁文案帶入（來自 questions.js，方便日後改字） ----
  function fillIntro() {
    setText("intro-brand", window.SURVEY.org);
    setText("intro-title", window.SURVEY.eventName);
    setText("intro-sub", window.SURVEY.eventSubtitle);
    setText("intro-formtitle", window.SURVEY.formTitle);
    setText("intro-lead", window.SURVEY.introText);
    setText("intro-estimate-strong", window.SURVEY.estimateText);
    setText("done-org", window.SURVEY.org);
  }
  function setText(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; }

  // ---- 畫面切換 ----
  function show(name) {
    Object.keys(screens).forEach(function (k) { screens[k].classList.remove("active"); });
    screens[name].classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ============================================================
  // 題目渲染：依 type 產生對應的作答 UI
  // ============================================================
  function renderQuestion() {
    var q = Q[state.index];
    var total = Q.length;
    var num = state.index + 1;

    var pad = function (n) { return (n < 10 ? "0" : "") + n; };

    var html = "";

    // 進度條
    html += '<div class="progress-top">';
    html += '  <div class="progress-head">';
    html += '    <div class="progress-count"><span class="cur">' + pad(num) + "</span> / " + pad(total) + "</div>";
    html += '    <div class="progress-hint">' + (q.required ? "＊必填" : "選填") + "</div>";
    html += "  </div>";
    html += '  <div class="progress-track"><div class="progress-fill" style="width:' + (num / total * 100) + '%"></div></div>';
    html += "</div>";

    // 題目標題
    html += '<div class="q-title">' + escapeHtml(q.title) + (q.required ? ' <span class="q-required">＊</span>' : "") + "</div>";
    if (q.subtitle) html += '<div class="q-subtitle only">' + escapeHtml(q.subtitle) + "</div>";

    // 作答區
    html += '<div class="q-body" id="q-body"></div>';

    // 必填提醒
    html += '<div class="warn" id="warn"><span>⚠️</span><span>' +
            (q.type === "multiple_choice" || q.type === "single_choice" ? "這是必填題，請選擇一個選項" :
             q.type === "rating" ? "這是必填題，請給個星星評分" : "這是必填題，請填寫後再繼續") +
            "</span></div>";

    // 導覽按鈕
    var lastQ = (state.index === total - 1);
    html += '<div class="nav-row">';
    html += '  <button class="btn btn-ghost back" id="btn-prev">‹ 上一題</button>';
    html += '  <button class="btn btn-ocean" id="btn-next">' + (lastQ ? "檢查答案 ›" : "下一題 ›") + "</button>";
    html += "</div>";

    screens.question.querySelector(".card-body").innerHTML = html;

    // 依題型產生作答 UI
    var body = document.getElementById("q-body");
    var renderer = RENDERERS[q.type];
    if (renderer) renderer(body, q);

    // 綁定導覽
    document.getElementById("btn-prev").addEventListener("click", goPrev);
    document.getElementById("btn-next").addEventListener("click", goNext);
  }

  // ============================================================
  // 各題型的渲染器（未來要加新題型，在這裡加一個即可）
  // ============================================================
  var RENDERERS = {

    single_choice: function (body, q) {
      var current = state.answers[q.questionId];
      q.options.forEach(function (opt) {
        var btn = optionCard(opt, false, current === opt);
        btn.addEventListener("click", function () {
          state.answers[q.questionId] = opt;
          markSelection(body, opt, false);
          hideWarn();
        });
        body.appendChild(btn);
      });
    },

    multiple_choice: function (body, q) {
      var current = state.answers[q.questionId] || [];
      q.options.forEach(function (opt) {
        var btn = optionCard(opt, true, current.indexOf(opt) !== -1);
        btn.addEventListener("click", function () {
          var arr = state.answers[q.questionId] || [];
          var i = arr.indexOf(opt);
          if (i === -1) arr.push(opt); else arr.splice(i, 1);
          state.answers[q.questionId] = arr;
          btn.classList.toggle("selected");
          if (arr.length) hideWarn();
        });
        body.appendChild(btn);
      });
    },

    rating: function (body, q) {
      var max = q.max || 5;
      var current = state.answers[q.questionId] || 0;
      var wrap = document.createElement("div");
      wrap.className = "stars";
      var label = document.createElement("div");
      label.className = "stars-label";
      var LABELS = { 1: "需要加油 😢", 2: "還可以", 3: "普通 🙂", 4: "很不錯 😊", 5: "超級滿意 🤩" };

      function paint(v) {
        Array.prototype.forEach.call(wrap.children, function (s, i) {
          s.classList.toggle("on", i < v);
        });
        label.textContent = v ? LABELS[v] || (v + " 顆星") : "";
      }

      for (var i = 1; i <= max; i++) {
        (function (val) {
          var s = document.createElement("span");
          s.className = "star";
          s.textContent = "⭐";
          s.addEventListener("click", function () {
            state.answers[q.questionId] = val;
            paint(val);
            hideWarn();
          });
          wrap.appendChild(s);
        })(i);
      }
      body.appendChild(wrap);
      body.appendChild(label);
      paint(current);
    },

    short_text: function (body, q) {
      textField(body, q, false);
    },

    long_text: function (body, q) {
      textField(body, q, true);
    }
  };

  // 產生一個選項卡片
  function optionCard(opt, isMulti, selected) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "opt" + (isMulti ? " multi" : "") + (selected ? " selected" : "");
    btn.dataset.opt = opt;
    btn.innerHTML = '<span class="mark">✔</span><span class="txt">' + escapeHtml(opt) + "</span>";
    return btn;
  }

  // 單選：清掉其他，選中這個
  function markSelection(body, opt, isMulti) {
    Array.prototype.forEach.call(body.querySelectorAll(".opt"), function (el) {
      el.classList.toggle("selected", el.dataset.opt === opt);
    });
  }

  // 文字題
  function textField(body, q, isLong) {
    var wrap = document.createElement("div");
    wrap.className = "field";
    var el = isLong ? document.createElement("textarea") : document.createElement("input");
    if (!isLong) el.type = "text";
    el.placeholder = q.placeholder || "請輸入…";
    el.value = state.answers[q.questionId] || "";
    el.addEventListener("input", function () {
      state.answers[q.questionId] = el.value;
      if (el.value.trim()) hideWarn();
    });
    wrap.appendChild(el);
    body.appendChild(wrap);
    setTimeout(function () { /* 不自動 focus，避免手機一進來就跳鍵盤 */ }, 0);
  }

  // ============================================================
  // 驗證與導覽
  // ============================================================
  function isAnswered(q) {
    var a = state.answers[q.questionId];
    if (q.type === "multiple_choice") return Array.isArray(a) && a.length > 0;
    if (q.type === "rating") return typeof a === "number" && a > 0;
    if (q.type === "single_choice") return typeof a === "string" && a !== "";
    return typeof a === "string" && a.trim() !== ""; // 文字題
  }

  function showWarn() { var w = document.getElementById("warn"); if (w) w.classList.add("show"); }
  function hideWarn() { var w = document.getElementById("warn"); if (w) w.classList.remove("show"); }

  function goNext() {
    var q = Q[state.index];
    if (q.required && !isAnswered(q)) { showWarn(); return; }
    if (state.index === Q.length - 1) { renderReview(); show("review"); return; }
    state.index++;
    renderQuestion();
  }

  function goPrev() {
    if (state.index === 0) { show("intro"); return; }
    state.index--;
    renderQuestion();
  }

  // ============================================================
  // 檢查頁（就差最後一步）
  // ============================================================
  function renderReview() {
    var missing = [];
    Q.forEach(function (q, i) {
      if (q.required && !isAnswered(q)) missing.push({ i: i, title: q.title });
    });

    var html = '<div class="review">';
    html += '  <div class="big-emoji">🌊</div>';
    html += "  <h2>就差最後一步！</h2>";

    if (missing.length === 0) {
      html += '  <div class="msg">所有題目都完成囉，確認沒問題就送出吧 😊</div>';
      html += '  <div class="ready">✅ 必填題全部完成</div>';
      html += '  <button class="btn btn-primary" id="btn-submit">送出問卷 🎉</button>';
      html += '  <div class="nav-row"><button class="btn btn-ghost back" id="btn-review-back">‹ 回上一題</button></div>';
    } else {
      html += '  <div class="msg">還有 <b style="color:var(--coral-deep)">' + missing.length + "</b> 題必填還沒完成，點一下就能回去補填：</div>";
      html += '  <div class="miss-list">';
      missing.forEach(function (m) {
        html += '<button class="miss-item" data-i="' + m.i + '"><span>⚠️</span><span>第 ' + (m.i + 1) + " 題　" + escapeHtml(m.title) + "</span></button>";
      });
      html += "  </div>";
      html += '  <button class="btn" id="btn-submit" disabled>請先完成必填題</button>';
      html += '  <div class="nav-row"><button class="btn btn-ghost back" id="btn-review-back">‹ 回上一題</button></div>';
    }
    html += "</div>";

    screens.review.querySelector(".card-body").innerHTML = html;

    var submit = document.getElementById("btn-submit");
    if (submit && !submit.disabled) submit.addEventListener("click", submitSurvey);
    document.getElementById("btn-review-back").addEventListener("click", function () {
      state.index = Q.length - 1; renderQuestion(); show("question");
    });
    Array.prototype.forEach.call(document.querySelectorAll(".miss-item"), function (el) {
      el.addEventListener("click", function () {
        state.index = parseInt(el.dataset.i, 10);
        renderQuestion(); show("question");
      });
    });
  }

  // ============================================================
  // 送出（目前只在前端完成；未來接 Google Sheet / Apps Script）
  // ============================================================
  // Apps Script Web App /exec 網址（與報名系統同一支 script，action=survey）
  var GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzsOKExGAz9znfUDYqXX7GVhIASXNjQwt-VJIdM6ek-fVQ7bZ78ZBadV2xbB-XD1SsxsQ/exec";

  function submitSurvey() {
    var btn = document.getElementById("btn-submit");
    if (btn) { btn.disabled = true; btn.textContent = "送出中… 🌊"; }

    var payload = buildPayload();

    var finished = false;
    function finish() { if (finished) return; finished = true; show("done"); }

    if (!GOOGLE_SCRIPT_URL) { console.log("問卷結果（本機測試，未送出）：", payload); finish(); return; }

    jsonp(GOOGLE_SCRIPT_URL, { action: "survey", data: JSON.stringify(payload) },
      function (res) { console.log("送出結果：", res); finish(); },
      function () { console.warn("送出可能失敗，仍顯示完成頁"); finish(); }
    );

    // 保險：回饋問卷不需卡住家長，逾時也顯示完成頁
    setTimeout(finish, 9000);
  }

  // 整理成乾淨、好存進 Google Sheet 的資料
  // items 保留「題目順序 + 標題」，後端用標題當欄位（題目變動時自動擴充欄位）
  function buildPayload() {
    var items = Q.map(function (q) {
      var a = state.answers[q.questionId];
      if (Array.isArray(a)) a = a.join("、");         // 複選 → 用頓號串起來存一格
      if (a === undefined || a === null) a = "";
      return { id: q.questionId, title: q.title, value: a };
    });
    return {
      form: window.SURVEY.formTitle,
      event: window.SURVEY.eventName,
      submittedAt: new Date().toISOString(),
      items: items
    };
  }

  // JSONP：跨網域把資料 GET 送到 Apps Script
  function jsonp(url, params, onOk, onErr) {
    var cb = "surveyCb_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    var script, timer;
    function cleanup() {
      clearTimeout(timer);
      try { delete window[cb]; } catch (e) { window[cb] = undefined; }
      if (script && script.parentNode) script.parentNode.removeChild(script);
    }
    window[cb] = function (res) { cleanup(); if (onOk) onOk(res); };
    var qs = Object.keys(params).map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
    }).join("&");
    script = document.createElement("script");
    script.src = url + "?callback=" + cb + "&" + qs;
    script.onerror = function () { cleanup(); if (onErr) onErr(); };
    timer = setTimeout(function () { cleanup(); if (onErr) onErr(); }, 9000);
    document.body.appendChild(script);
  }

  // ---- 小工具 ----
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ---- 啟動 ----
  function init() {
    fillIntro();
    document.getElementById("btn-start").addEventListener("click", function () {
      state.index = 0;
      renderQuestion();
      show("question");
    });
    show("intro");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
