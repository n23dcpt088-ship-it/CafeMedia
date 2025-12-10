// src/components/Dashboard.jsx
import { useState, useEffect, useRef } from "react";
import "../styles.css";
import {
  getDashboardData,
  getTodayEvents,
  getRecentActivities,
} from "../api/mock";

export default function Dashboard() {
  const [showNoti, setShowNoti] = useState(false);
  const notiRef = useRef(null);

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const [events, setEvents] = useState([]);
  const [activities, setActivities] = useState([]);

  const path =
    typeof window !== "undefined" ? window.location.pathname : "/index.html";
  const isDashboardActive = path === "/" || path === "/index.html";

  const handleCreate = () => {
    window.location.href = "/editor.html?from=dashboard";
  };

  const handleUser = () => {
    window.location.href = "/profile.html";
  };

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [d, e, a] = await Promise.all([
          getDashboardData(),
          getTodayEvents(),
          getRecentActivities(),
        ]);
        if (cancelled) return;
        setStats(d);
        setEvents(e);
        setActivities(a);
      } finally {
        if (!cancelled) setLoadingStats(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  // đóng popup khi click ra ngoài
  useEffect(() => {
    if (!showNoti) return;

    const handleClickOutside = (e) => {
      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setShowNoti(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showNoti]);

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">☕</div>
          <span><strong>Café Media Portal</strong></span>
        </div>

        <nav className="nav">
          <a href="/index.html" className={`nav-link ${isDashboardActive ? "active" : ""}`}>📊 <span>Dashboard</span></a>
          <a href="/editor.html" className="nav-link">📝 <span>Nội dung</span></a>
          <a href="/schedule.html" className="nav-link">📅 <span>Lịch xuất bản</span></a>
          <a href="/livestream.html" className="nav-link">🎥 <span>Livestream</span></a>
          <a href="/campaign.html" className="nav-link">📢 <span>Chiến dịch</span></a>
          <a href="/seo.html" className="nav-link">⚙️ <span>SEO & Hiệu năng</span></a>
          <a href="/profile.html" className="nav-link">👤 <span>Người dùng</span></a>
        </nav>

        <div className="spacer" />
        <div className="user">
          <div className="meta"></div>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-inner" style={{ position: "relative" }}>
            <div className="search" role="search">
              <span>🔍</span>
              <input
                aria-label="Tìm kiếm"
                placeholder="Tìm bài viết, chiến dịch…"
                style={{
                  border: "none",
                  outline: "none",
                  flex: 1,
                  fontSize: 15,
                }}
              />
            </div>

            <button
              className="btn-primary"
              id="btn-create"
              onClick={handleCreate}
            >
              + Tạo mới
            </button>

            {/* Nút chuông + popup thông báo */}
            <div ref={notiRef} style={{ position: "relative" }}>
              <button
                className="icon-btn noti-btn"
                aria-label="Thông báo"
                id="btn-noti"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNoti((v) => !v);
                }}
              >
                🔔
                <span className="noti-badge">3</span>
              </button>

              <div className={`noti-panel ${showNoti ? "show" : ""}`} id="noti-panel">
                <div className="noti-item">
                  <div className="noti-item-icon">📰</div>
                  <div>
                    <strong>Bài viết mới</strong> đã được duyệt – 5 phút trước
                  </div>
                </div>
                <div className="noti-item">
                  <div className="noti-item-icon">🎥</div>
                  <div>
                    Livestream “Giới thiệu sản phẩm mới” chuẩn bị diễn ra
                  </div>
                </div>
                <div className="noti-item">
                  <div className="noti-item-icon">📢</div>
                  <div>
                    Chiến dịch “Tháng 12 – Ấm áp” đạt 80% KPI
                  </div>
                </div>
              </div>
            </div>

            <button
              className="icon-btn"
              aria-label="Tài khoản"
              id="btn-user"
              type="button"
              onClick={handleUser}
            >
              👤
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="content" aria-labelledby="h-dashboard">
          <h1
            id="h-dashboard"
            style={{ margin: ".25rem 0 0 0", fontSize: 24 }}
          >
            Tổng quan
          </h1>

          {/* KPI Cards */}
          <section className="kpi-grid" aria-label="Chỉ số chính">
            {loadingStats || !stats ? (
              <>
                <article className="card kpi kpi-skeleton" />
                <article className="card kpi kpi-skeleton" />
                <article className="card kpi kpi-skeleton" />
                <article className="card kpi kpi-skeleton" />
              </>
            ) : (
              <>
                <article className="card kpi">
                  <div
                    className="kpi-icon"
                    style={{ background: "var(--teal-600)" }}
                  >
                    📰
                  </div>
                  <div>
                    <div className="title">Bài viết xuất bản</div>
                    <div className="value">{stats.posts}</div>
                    <div className="delta">{stats.postsChange}</div>
                  </div>
                </article>
                <article className="card kpi">
                  <div
                    className="kpi-icon"
                    style={{ background: "var(--amber-500)" }}
                  >
                    🎥
                  </div>
                  <div>
                    <div className="title">Livestream đã thực hiện</div>
                    <div className="value">{stats.livestreams}</div>
                    <div
                      className="delta"
                      style={{ color: "var(--blue-500)" }}
                    >
                      {stats.campaignsActive} chiến dịch đang hoạt động
                    </div>
                  </div>
                </article>
                <article className="card kpi">
                  <div
                    className="kpi-icon"
                    style={{ background: "var(--blue-500)" }}
                  >
                    👁️
                  </div>
                  <div>
                    <div className="title">Lượt xem tổng</div>
                    <div className="value">
                      {(stats.views / 1000).toFixed(1)}K
                    </div>
                    <div className="delta">{stats.viewsChange}</div>
                  </div>
                </article>
                <article className="card kpi">
                  <div
                    className="kpi-icon"
                    style={{ background: "var(--green-500)" }}
                  >
                    📈
                  </div>
                  <div>
                    <div className="title">Hiệu suất SEO</div>
                    <div className="value">{stats.seoScore}/100</div>
                    <div className="delta">{stats.seoNote}</div>
                  </div>
                </article>
              </>
            )}
          </section>

          {/* Middle: Charts (giữ nguyên SVG) */}
          <section className="middle" aria-label="Phân tích">
            {/* ... giữ nguyên 2 <article> chart như bạn đang có ... */}
            {/* (không cần đụng tới nếu chỉ test dữ liệu KPI & event) */}
          </section>

          {/* Bottom: Schedule & Events */}
          <section className="bottom" aria-label="Lịch xuất bản & sự kiện">
            {/* Calendar giữ nguyên static như cũ */}
            <article className="card calendar">
              {/* ... phần lịch như hiện tại ... */}
            </article>

            <aside className="events">
              <div className="card" style={{ padding: "1rem" }}>
                <h3 style={{ margin: "0 0 .5rem 0" }}>Sự kiện hôm nay</h3>

                {events.length === 0 ? (
                  <div className="event">Đang tải sự kiện…</div>
                ) : (
                  events.map((ev, idx) => (
                    <div className="event" key={idx}>
                      <div>{ev.emoji}</div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{ev.title}</div>
                        <div className="time">{ev.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="card" style={{ padding: "1rem" }}>
                <h3 style={{ margin: "0 0 .5rem 0" }}>Hoạt động gần đây</h3>
                <div className="activity">
                  {activities.length === 0 ? (
                    <div className="activity-item">Đang tải hoạt động…</div>
                  ) : (
                    activities.map((ac, idx) => (
                      <div className="activity-item" key={idx}>
                        {ac.icon} <span>{ac.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}