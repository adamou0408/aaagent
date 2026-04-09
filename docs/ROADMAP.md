# 專案階段式發展路線圖 — Phased Project Roadmap

## Context

本專案 (aaagent) 已完成初始 scaffold，包含 Clean Architecture、Docker、CI/CD、TypeORM 等基礎。
使用者提出 7 個核心痛點：軟體架構、低維運成本、自動化部署、統一設計準則、資料持久化、解決需求者痛點、流程化開發。

**核心問題**：隨著時間推移，專案如何分階段演進？每個痛點的解決方案在其生命週期（導入 → 成熟 → 維護）中如何規劃？

> **Status**: All 5 phases implemented. See CHANGELOG.md for details.

---

## 痛點生命週期矩陣

每個痛點在不同階段的狀態：🟡 導入 → 🟢 成熟 → 🔵 維護

| 痛點 | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 |
|------|---------|---------|---------|---------|---------|
| ① 軟體架構 | 🟡 | 🟢 | 🟢 | 🔵 | 🔵 |
| ② 低維運成本 | 🟡 | 🟡 | 🟢 | 🟢 | 🔵 |
| ③ 自動化部署 | 🟡 | 🟢 | 🟢 | 🔵 | 🔵 |
| ④ 統一設計準則 | 🟡 | 🟢 | 🔵 | 🔵 | 🔵 |
| ⑤ 資料持久化 | 🟡 | 🟡 | 🟢 | 🔵 | 🔵 |
| ⑥ 解決需求者痛點 | — | 🟡 | 🟡 | 🟢 | 🔵 |
| ⑦ 流程化開發 | 🟡 | 🟢 | 🔵 | 🔵 | 🔵 |

---

## Phase 1: Foundation — 奠基期 (2 週)

**目標**：讓專案能跑起來，建立開發者信心，確保基本品質

### 已完成 ✅ (當前狀態)
- Clean Architecture 分層結構
- Docker multi-stage build + docker-compose
- GitHub Actions CI/CD 骨架
- ESLint/Prettier/EditorConfig
- TypeORM + 第一個 migration
- Makefile + PR/Issue templates
- Task CRUD API (示範功能)

### 待完成
1. **安裝依賴並驗證 build**
   - `npm install && npm run build` 確認 TypeScript 編譯通過
   - `make docker-up` 確認容器啟動正常
   - 修復 `package-lock.json` 

2. **補齊真實測試**
   - `tests/unit/task.service.test.ts` — 用 mock repository 測試 service 邏輯
   - `tests/integration/task.api.test.ts` — 用 supertest 測試 API endpoints
   - 修改 `jest.config.ts` 加入 integration test 配置

3. **Graceful Shutdown**
   - 修改 `src/index.ts` — 加入 SIGTERM/SIGINT handler
   - 關閉 DB connection pool → 停止接受新請求 → 等待進行中請求完成

4. **npm lock file + .nvmrc**
   - 產生 `package-lock.json`
   - 新增 `.nvmrc` 固定 Node 版本

### 關鍵檔案
- `src/index.ts` — graceful shutdown
- `tests/unit/task.service.test.ts` — 真實單元測試
- `tests/integration/task.api.test.ts` — 新增
- `package-lock.json` — 新增

### 痛點推進
| 痛點 | 此階段推進 |
|------|-----------|
| ① 架構 | 驗證分層能正確運作，補齊測試驗證 |
| ④ 設計準則 | CI 中跑 lint + format check + test |
| ⑦ 流程化 | 確認 Makefile 指令全部可用 |

---

## Phase 2: Hardening — 強化期 (3 週)

**目標**：讓專案可以安心上線，處理安全性、可觀測性、部署自動化

### 安全性
1. **認證與授權 Middleware**
   - `src/middlewares/auth.ts` — JWT token 驗證
   - `src/config/env.ts` — 加入 `JWT_SECRET` 環境變數
   - `src/controllers/auth.controller.ts` — login / register endpoints
   - `src/entities/user.entity.ts` + migration
   - `src/services/auth.service.ts`
   - `src/repositories/user.repository.ts`

2. **Rate Limiting**
   - `src/middlewares/rate-limiter.ts` — 用 express-rate-limit
   - 依 endpoint 粒度設定 (e.g., login 更嚴格)

3. **Request Validation Middleware 抽取**
   - `src/middlewares/validate.ts` — 通用 Zod validation middleware
   - 減少 controller 中的重複驗證邏輯

### 可觀測性
4. **Health Check 強化**
   - `/health` 加入 DB connection check、memory usage
   - `/ready` readiness probe (for Kubernetes)
   - `src/controllers/health.controller.ts`

5. **Request Tracing**
   - `src/middlewares/request-id.ts` — 為每個請求生成 correlationId
   - 注入到 logger context，方便追蹤

### 部署
6. **Deploy Workflow 啟用**
   - `.github/workflows/deploy.yml` — 取消 SSH deploy 註解，或改用 watchtower / webhook
   - 加入 staging 環境配置
   - `docker-compose.staging.yml` — staging 環境
   - `.env.staging.example`

7. **Database Backup Script**
   - `scripts/db-backup.sh` — pg_dump 自動化
   - `scripts/db-restore.sh`
   - 在 Makefile 加入 `make db-backup` / `make db-restore`

### 痛點推進
| 痛點 | 此階段推進 |
|------|-----------|
| ① 架構 | 認證/授權完整分層 (User entity → repo → service → controller) |
| ② 維運 | Health check 強化 + request tracing |
| ③ 部署 | Deploy workflow 啟用 + staging 環境 |
| ④ 準則 | 通用 validate middleware 建立 pattern |
| ⑤ 持久化 | User entity + migration，DB backup/restore |
| ⑦ 流程化 | validation middleware pattern 成為標準做法 |

---

## Phase 3: Growth — 成長期 (4 週)

**目標**：開始開發業務功能，建立第二、第三個 domain，驗證架構的擴展性

### 業務功能擴展
1. **第二個 Domain — 例如 Project**
   - `src/entities/project.entity.ts` + migration
   - `src/repositories/project.repository.ts`
   - `src/services/project.service.ts`
   - `src/controllers/project.controller.ts`
   - Task ↔ Project 關聯 (ManyToOne)
   - Migration: `AddProjectIdToTask`

2. **分頁與篩選**
   - `src/utils/pagination.ts` — 通用分頁工具
   - 所有 list endpoints 支援 `?page=1&limit=20&sort=createdAt`
   - Swagger 文件更新

3. **Soft Delete**
   - `src/entities/base.entity.ts` 加入 `deletedAt` 欄位
   - 所有 repository 改用 `softDelete` / `softRemove`
   - Migration: `AddSoftDeleteToAllTables`

### 資料持久化進階
4. **Transaction Support**
   - `src/utils/transaction.ts` — 通用 transaction wrapper
   - Service 層跨 repository 操作時使用

5. **Seed Data**
   - `src/seeds/` — 開發/測試用種子資料
   - `make db-seed` 指令

6. **Connection Pool 配置**
   - `src/config/data-source.ts` — 加入 poolSize、idleTimeout 等設定
   - 對應 env 變數

### 可觀測性進階
7. **Structured Error Codes**
   - `src/utils/errors.ts` — AppError class with error codes
   - 統一錯誤格式: `{ error: { code: "TASK_NOT_FOUND", message: "..." } }`
   - 所有 controller 使用統一錯誤格式

### 痛點推進
| 痛點 | 此階段推進 |
|------|-----------|
| ① 架構 | 驗證多 domain 擴展性，架構進入成熟 |
| ② 維運 | Connection pool、structured errors |
| ⑤ 持久化 | Soft delete、transactions、seed data |
| ⑥ 需求者 | 分頁/篩選、更好的錯誤訊息 |

---

## Phase 4: Maturity — 成熟期 (3 週)

**目標**：Performance、監控、文件化，讓系統可以長期穩定運行

### 效能
1. **Caching Layer**
   - `src/config/cache.ts` — Redis 配置
   - `docker-compose.yml` — 加入 Redis service
   - `src/middlewares/cache.ts` — HTTP response caching middleware
   - 熱點資料 cache（如 task list）

2. **Database Indexing**
   - 根據查詢模式加入 index migration
   - `src/entities/task.entity.ts` — `@Index` decorators

### 監控
3. **Metrics Endpoint**
   - `src/config/metrics.ts` — Prometheus metrics
   - `/metrics` endpoint
   - Request duration、DB query count、error rate、memory usage

4. **Log Aggregation 配置**
   - `docker-compose.yml` — 加入 logging driver 配置
   - 或加入 ELK/Loki stack 配置

### API 文件化
5. **API Versioning 策略**
   - `src/controllers/v1/` → 按版本分 directory
   - `/api/v2` 路由支援

6. **Changelog**
   - `CHANGELOG.md` — 自動或手動維護
   - 考慮 standard-version 或 semantic-release

### 痛點推進
| 痛點 | 此階段推進 |
|------|-----------|
| ② 維運 | Redis cache + metrics + logging，進入成熟 |
| ③ 部署 | 進入維護模式，只需微調 |
| ⑤ 持久化 | Index 優化，進入維護模式 |
| ⑥ 需求者 | API versioning + changelog，需求者痛點進入成熟 |

---

## Phase 5: Optimization — 優化期 (持續)

**目標**：自動化一切可自動化的事，降低人為失誤，持續改善

### 自動化
1. **Dependency Update Automation**
   - `.github/workflows/deps.yml` — Dependabot 或 Renovate 配置
   - 自動 PR + 自動 merge patch updates

2. **Database Migration CI Check**
   - CI 中加入 migration 一致性檢查
   - 確保 entity 和 migration 同步

3. **Release Automation**
   - `.github/workflows/release.yml` — semantic-release
   - 自動打 tag、產生 changelog、publish Docker image

### 品質門檻
4. **Test Coverage 門檻**
   - CI 中設定最低覆蓋率 (e.g., 80%)
   - `jest.config.ts` — coverageThreshold

5. **Performance Regression Test**
   - `tests/performance/` — k6 或 autocannon 負載測試
   - CI 中偵測效能退化

### 痛點推進
| 痛點 | 此階段推進 |
|------|-----------|
| ② 維運 | 全面進入維護模式，自動化 dependency update |
| ⑥ 需求者 | 進入維護模式，透過 release automation 持續交付 |
| ⑦ 流程化 | 開發流程全自動化，人為操作最小化 |

---

## 整體流程化方案 — 從痛點到解方的生命週期管理

### 原則

```
痛點識別 → 最小可行解 → 驗證回饋 → 迭代強化 → 穩定維護
```

每個痛點不需要在第一天就完美解決。關鍵是：
1. **Phase 1 (Foundation)** — 每個痛點都有「最小可行解」（能跑就好）
2. **Phase 2-3 (Hardening + Growth)** — 依使用頻率和影響力排序，逐步強化
3. **Phase 4 (Maturity)** — 效能優化和文件化，讓系統可預測
4. **Phase 5 (Optimization)** — 自動化一切，讓維運成本趨近於零

### 每個痛點的投資曲線

```
投入
 ↑
 │    ①架構  ④準則  ⑦流程
 │    ╱╲      ╱╲     ╱╲
 │   ╱  ╲────╱  ╲───╱  ╲───── (早期高投入，後期低維護)
 │  ╱    
 │ ╱  ②維運  ③部署  ⑤持久化
 │╱    ╱╲      ╱╲     ╱╲
 │    ╱  ╲────╱  ╲───╱  ╲──── (中期高投入，後期回收)
 │   ╱
 │  ╱   ⑥需求者痛點
 │ ╱      ╱╲
 │╱      ╱  ╲────────────────── (後期高投入，持續迭代)
 └──────────────────────────→ 時間
   P1    P2    P3    P4    P5
```

### 關鍵洞察

- **架構、準則、流程** (①④⑦) 是「前期投資型」— 越早做好，後續每個 phase 的成本越低
- **維運、部署、持久化** (②③⑤) 是「中期回收型」— Phase 2-3 投入最大，Phase 4 開始回收紅利
- **需求者痛點** (⑥) 是「持續迭代型」— 必須在架構穩定後才能高效推進，否則每次改動成本高

### 決策框架：什麼時候做什麼？

問自己三個問題：
1. **這件事不做，會阻塞其他工作嗎？** → 是的話，立刻做（Phase 1）
2. **這件事做了，能降低未來多少重複勞動？** → 高的話，Phase 2 做
3. **這件事做了，直接產出使用者價值嗎？** → 是的話，Phase 3+ 做

---

## 驗證方式

每個 Phase 完成後，用以下方式驗證：

1. **Phase 1**: `make build && make test && make docker-up` 全部通過
2. **Phase 2**: `make docker-up` 後打 `/health`、登入取 token、用 token 呼叫 API
3. **Phase 3**: 新增第二個 domain，驗證不需修改基礎設施程式碼
4. **Phase 4**: `/metrics` endpoint 有資料，`make test` 覆蓋率 > 80%
5. **Phase 5**: push 到 main 後，自動 build → test → deploy → release note
