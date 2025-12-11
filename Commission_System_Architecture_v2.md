# 書弦保險代理人 - 智慧帳務管理系統 (Commission Intelligence System)
## 技術規格與實作指南 (Technical Specification & Implementation Guide)

**版本**: v3.0 (Agent Rewards & UI Polish)
**目標**: 建立一個手機優先 (Mobile-first) 的 PWA/Web App，用於自動化計算保險佣金、管理客戶資料、並追蹤業務員自身的佣金收入。

---

## 1. 技術堆疊 (Tech Stack)

| 層級 | 技術選型 | 選擇理由 |
| :--- | :--- | :--- |
| **Frontend** | **React** (Vite) | 業界標準，組件化開發，適合複雜互動。 (Implemented) |
| **Styling** | **Tailwind CSS** | 快速開發，適合打造 RWD 手機版面。 (Implemented) |
| **Backend** | **Supabase** | 提供 PostgreSQL 資料庫、身份驗證 (Auth)、以及自動化 API。 (Implemented) |
| **Icons** | **Lucide React** | 輕量、風格統一的圖標庫，適合現代化介面。 (Implemented) |
| **Deploy** | **Vercel** / **Netlify** | CI/CD 自動化部署。 |

---

## 2. 資料庫設計 (Database Schema)

**核心原則**：所有商業邏輯（計算、排程、聯動刪除）必須在資料庫層級 (Database Layer) 完成，前端只負責顯示與觸發。

### 2.1 Table Definitions (資料表定義)

#### `clients` (客戶資料表)
- `id` (uuid, PK)
- `user_id` (uuid, FK): 資料擁有者
- `name` (text): 客戶姓名
- `phone` (text): 聯絡電話
- `created_at` (timestamptz)

#### `contracts` (合約主檔)
- `id` (uuid, PK)
- `client_id` (uuid, FK): 關聯客戶
- `policy_no` (text): 保單號碼 (Optional)
- `total_amount` (numeric): 合約總金額
- `paid_amount` (numeric): 已支付金額 (由系統自動統計)
- `periods` (int): 分期數
- `start_date` / `sign_date` (date): 生效日/簽約日
- `status` (text): 'active' (進行中) | 'completed' (已完成) | 'terminated' (已終止)

#### `installments` (佣金分期明細 - 給客戶的錢)
- `id` (uuid, PK)
- `contract_id` (uuid, FK): **ON DELETE CASCADE** (合約刪除時自動刪除)
- `period_number` (int): 第幾期
- `due_date` (date): 應付日期
- `amount` (numeric): 金額
- `status` (text): 'pending' (未發放) | 'paid' (已發放) | 'cancelled' (已取消)

#### `agent_rewards` (業務佣金 - 自己的收入) **(New in v3.0)**
- `id` (uuid, PK)
- `contract_id` (uuid, FK): **ON DELETE CASCADE**
- `amount` (numeric): 佣金金額 (預設為合約金額 2%)
- `date` (date): 入帳日期 (預設為簽約日)
- `description` (text): 描述
- `type` (text): 'automatic' (自動生成) | 'manual' (手動補錄)

### 2.2 自動化邏輯 (Triggers & Functions)

1.  **分期表生成 (Penny Perfect Algorithm)**:
    - 新增合約時，自動計算並生成 N 期 `installments`。
    - 確保總和完全等於合約金額 (尾差處理在最後一期)。

2.  **業務佣金自動計算**:
    - **Trigger**: `on_contract_created`
    - **Logic**: 新增合約時，自動產生一筆 2% 金額的 `agent_rewards` 紀錄。

3.  **合約終止 (Early Termination)**:
    - 當合約狀態變更為 `terminated`，自動將所有未發放 (`pending`) 的分期單狀態改為取消 (`cancelled`)。

---

## 3. 前端功能模組 (Feature Logic)

### A. 帳務明細 (Installments)
這是系統最核心的操作介面。
- **介面設計**:
  - **Tabs 切換**: 預設顯示 **「未發放」** (專注當下任務)，可切換至 **「全部紀錄」** (查帳)。
  - **用詞規範**: 使用 **「未發放 / 已發放」** 來明確表示資金流向 (支出)。
- **顯示資訊**:
  - 狀態標籤 (橘色/綠色) 位於最前，便於掃視。
  - 顯示：`[狀態] [客戶名] [保單號碼] [日期] [第 N 期] [金額]`
  - **保單號碼 Fallback**: 若無保單號，則顯示合約 ID 前 6 碼 (`#A123...`) 以供識別。

### B. 總覽儀表板 (Dashboard)
- **頂部導覽列 (Header)**:
  - **品牌識別**: 左側顯示手寫風 SVG Logo + "Revenue" 標題。
  - **Slogan**: 標題下方顯示副標題 **「你最專業的投資好朋友」**。
  - **用戶區塊**: 右側顯示 "WELCOME" (移除了 Hardcoded 名字) 與功能性 **登出按鈕** (LogOut)。
- **KPI 卡片**:
  - **本月預計發出**: 加上紅色 **「待」** 印章 SVG，強化提醒。
  - **本月已發出**: 綠色鈔票圖示，表示已完成進度。
- **近期待付清單**:
  - 僅列出即將到期的 `pending` 項目。
  - 使用簡潔的「人形圖示」取代文字標籤，保持介面清爽。
  - 無資料時顯示：「目前沒有待發放款項」。

### C. 業務佣金 (Agent Rewards)
- **獨立追蹤**: 業務員每一筆成交合約的 2% 獎金。
- **編輯功能**: 支援手動修改金額、日期或備註 (應對特殊狀況)。
- **顯示優化**: 優先顯示 **保單號碼**，讓業務員知道是哪張保單的獎金。

### D. 合約與客戶管理
- **客戶詳情**: 整合顯示該客戶的所有合約歷史。
- **刪除保護**: 刪除客戶或合約時，必須經過雙重確認 (Confirmation Modal)，並自動連動刪除相關帳務 (Cascade Delete)。

---

## 4. UI/UX 設計規範 (Design System)

### 視覺識別 (Visual Identity)
| 狀態 | 顏色 | 使用情境 |
| :--- | :--- | :--- |
| **未發放 / 待辦** | **Orange (橘色)** | 50 (Bg), 500/600 (Text/Border) |
| **已發放 / 完成** | **Emerald (翠綠)** | 50 (Bg), 600 (Text) |
| **自動 / 系統** | **Purple (紫色)** | 用於標示自動生成的獎金或統計 |

### 用語規範 (Terminology)
- **正確**: 「發放」(Payout), 「已發放」(Paid Out), 「未發放」(Not Paid Out), 「待付」(Pending Payment)
- **避免**: 「入帳」(Income) - *除非是指業務員自己的佣金*。

---

## 5. 目錄結構 (Directory Structure)

```
src/
├── components/          # 全域共用元件
│   ├── common/          # 基礎元件 (如 ConfirmationModal)
│   └── icons/           # 自定義圖示 (如 PendingStampIcon)
├── features/            # 功能模組 (Feature-First)
│   ├── contracts/       # 合約邏輯
│   ├── installments/    # 帳務邏輯 (包含 MonthGroup, InstallmentRow)
│   ├── agent-rewards/   # 佣金邏輯
│   └── dashboard/       # 儀表板
├── pages/               # 頁面組裝 (Dashboard, Installments...)
└── lib/                 # 工具庫 (Supabase, Utils)
```
