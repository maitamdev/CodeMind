# Nền tảng học lập trình tích hợp AI

> **Nền tảng đào tạo Lập trình Thế hệ mới**

**Đội ngũ phát triển:** MaiTamDev Team  
**Liên hệ:** [https://maitamdev.com](https://maitamdev.com)

**Repository:** [https://github.com/maitamdev/maitam-ai-learning](https://github.com/maitamdev/maitam-ai-learning)  
**Website:** [https://maitamdev.com](https://maitamdev.com)

---

## 📋 Tóm tắt đồ án

Nền tảng này tập trung vào việc phát triển một **hệ thống học lập trình thông minh tích hợp AI** (AI Learning Platform), nhằm cung cấp giải pháp giáo dục công nghệ hoàn chỉnh và chuyên nghiệp. Hệ thống không chỉ cung cấp các tính năng học tập trực tuyến cơ bản mà còn tích hợp các công nghệ tiên tiến như Trí tuệ nhân tạo (AI) cho việc gợi ý khóa học, trợ lý ảo viết mã, và nhận diện khuôn mặt chống gian lận.

Hệ thống được thiết kế với kiến trúc phân tán, sử dụng Supabase làm database chính và VPS với MySQL cho các dịch vụ AI, đảm bảo khả năng mở rộng và hiệu suất cao.

---

## 📖 1. Giới thiệu

### 1.1. Bối cảnh và vấn đề

Trong bối cảnh công nghệ thông tin ngày càng phát triển, việc ứng dụng công nghệ AI vào giáo dục đang trở thành một xu hướng tất yếu. Các nền tảng học lập trình truyền thống thường thiếu tính tương tác trực tiếp với mã nguồn và trợ lý ảo, không có khả năng gợi ý thông minh.

### 1.2. Mục tiêu nghiên cứu

#### Mục tiêu tổng quát
Xây dựng một nền tảng học lập trình thông minh tích hợp AI, cung cấp trải nghiệm học tập cá nhân hóa, tự động hóa quy trình quản lý, và hỗ trợ học viên viết mã tối ưu.

#### Mục tiêu cụ thể
1. **Phát triển hệ thống E-Learning hoàn chỉnh** với đầy đủ tính năng quản lý khóa học, bài học, người dùng và nội dung học tập.
2. **Tích hợp hệ thống gợi ý thông minh** sử dụng Machine Learning (Content-based Filtering và Collaborative Filtering).
3. **Triển khai AI Code Assistant** hỗ trợ quá trình thực hành lập trình.
4. **Xây dựng môi trường IDE tích hợp** chấm điểm và đánh giá code theo thời gian thực.
5. **Tích hợp giám sát môi trường học tập** thông qua các cảm biến IoT.
6. **Triển khai các tính năng Gamification** để tăng động lực học tập.
7. **Xây dựng môi trường code trực tuyến** tích hợp Monaco Editor và Sandpack.

---

## 🏗️ 2. Kiến trúc hệ thống

### 2.1. Kiến trúc tổng quan

Hệ thống được thiết kế theo kiến trúc phân tán với các thành phần chính:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Web App    │  │  Admin Panel │  │  Landing Page │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
│   Supabase     │  │  VPS + MySQL   │  │  Cloudinary    │
│  (PostgreSQL)  │  │  (AI & IoT)    │  │   (Storage)    │
│                │  │                │  │                │
│ • Auth         │  │ • AI Services  │  │ • Video        │
│ • Main DB      │  │ • IoT Gateway  │  │ • Images       │
│ • Storage      │  │ • ML Models    │  │                │
└────────────────┘  └────────────────┘  └────────────────┘
                            │
                    ┌───────▼────────┐
                    │  IoT Devices   │
                    │                │
                    │ • Fingerprint  │
                    │ • Sensors      │
                    │ • ESP32/Arduino│
                    └────────────────┘
```

### 2.2. Kiến trúc database

- **Supabase (PostgreSQL)**: Database chính cho dữ liệu người dùng, khóa học, bài học, tiến độ học tập.
- **MySQL trên VPS**: Database phụ trợ cho các dịch vụ AI và IoT, lưu trữ dữ liệu điểm danh, môi trường, và các model ML.

---

## 🚀 3. Công nghệ và công cụ sử dụng

### 3.1. Frontend Development
- **Framework**: Next.js 15 (App Router) - Server-side rendering và routing hiện đại
- **Language**: TypeScript - Type safety và developer experience tốt hơn
- **Styling**: 
  - Tailwind CSS - Utility-first CSS framework
  - CSS Modules - Component-scoped styling
- **State Management**: React Context API, React Hooks
- **UI Components**: 
  - Lucide React - Icon library
  - Custom Components - Component library tự xây dựng
- **Charts & Visualization**: Recharts - Data visualization
- **Code Editor**: Monaco Editor (VS Code core) - Interactive code editing
- **Code Sandbox**: Sandpack (CodeSandbox) - Online code execution environment

### 3.2. Backend & Database
- **Platform**: Supabase (PostgreSQL)
  - Authentication & Authorization
  - Real-time subscriptions
  - Row Level Security (RLS)
- **Storage**: 
  - Supabase Storage - File storage
  - Cloudinary - Video và image optimization
- **API**: Next.js API Routes - Serverless API endpoints
- **VPS Services**: 
  - MySQL Database - AI và IoT data storage
  - Node.js/Python Services - AI và IoT API endpoints

### 3.3. Artificial Intelligence & Machine Learning
- **Recommendation System**:
  - **Content-based Filtering**: TF-IDF, Cosine Similarity
  - **Collaborative Filtering**: K-Nearest Neighbors (KNN)
- **Face Recognition**: 
  - Face detection và recognition models
  - Vector embedding và similarity matching
- **AI Proctoring**: 
  - Browser-based: TensorFlow.js
  - Server-based: Python với OpenCV, MediaPipe
- **Video Analysis**: AI phân tích và đề xuất video học tập

### 3.4. Internet of Things (IoT)
- **Hardware**:
  - **Fingerprint Scanner**: Module quét vân tay
  - **Sensors**: DHT22 (nhiệt độ, độ ẩm), BH1750 (ánh sáng)
  - **Microcontroller**: ESP32 / Arduino
- **Communication Protocols**:
  - MQTT - Lightweight messaging protocol
  - HTTP/REST API - Web integration
  - WebSocket - Real-time communication

### 3.5. Deployment & Infrastructure
- **Domain**: maitamdev.com
- **Hosting**: 
  - Vercel - Frontend deployment
  - VPS - Backend services (AI & IoT)
- **CI/CD**: GitHub Actions (dự kiến)

---

## ✨ 4. Tính năng hệ thống

### 4.1. Tính năng cốt lõi (Đã triển khai)

#### 4.1.1. Quản lý khóa học và nội dung học tập
- **Hệ thống khóa học đa cấp**: Quản lý khóa học → Chương → Bài học
- **Nội dung đa phương tiện**: 
  - Video bài giảng (tự upload hoặc YouTube)
  - Tài liệu Markdown với editor chuyên nghiệp
  - Tài liệu đính kèm (PDF, images)
- **Trạng thái xuất bản**: Draft/Published workflow
- **Landing Page khóa học**: 
  - Video giới thiệu khóa học
  - Thông tin chi tiết về giảng viên
  - Mô tả và lợi ích khóa học
  - Đánh giá và phản hồi từ học viên

#### 4.1.2. Lộ trình học tập (Roadmap)
- **Visual Roadmap**: 
  - Giao diện theo phong cách [roadmap.sh](https://roadmap.sh)
  - Hiển thị flows và depth (chiều sâu) của lộ trình
  - Tương tác và điều hướng trực quan
- **Chi tiết Node**: 
  - Hiển thị đầy đủ thông tin kiến thức cần học
  - Liên kết trực tiếp đến bài học tương ứng
  - Phân loại bài học theo tiêu chí cụ thể

#### 4.1.3. Quản lý người dùng và phân quyền
- **Authentication**: Supabase Auth với email/password
- **Authorization**: Role-based access control (Admin, Teacher, Student)
- **User Profile**: Quản lý thông tin cá nhân, avatar, preferences

#### 4.1.4. Theo dõi tiến độ học tập
- **Progress Tracking**: Lưu trạng thái hoàn thành bài học
- **Visualization**: Biểu đồ tiến độ cá nhân và theo khóa học
- **Statistics**: Thống kê thời gian học, số bài đã hoàn thành

### 4.2. Tính năng nâng cao (Đề xuất phát triển)

#### 4.2.1. Hệ thống gợi ý thông minh (AI Recommendation System)

**Content-based Filtering**:
- Sử dụng **TF-IDF (Term Frequency-Inverse Document Frequency)** để vector hóa nội dung khóa học
- Tính toán **Cosine Similarity** giữa các khóa học
- Phân tích lịch sử học tập để xác định sở thích và mục tiêu của người dùng
- Gợi ý khóa học dựa trên nội dung tương tự với những gì người dùng đã học

**Collaborative Filtering**:
- Triển khai thuật toán **K-Nearest Neighbors (KNN)** để tìm nhóm người dùng có hành vi tương tự
- Phân tích implicit feedback (thời gian học, tỷ lệ hoàn thành) và explicit feedback (đánh giá, rating)
- Gợi ý khóa học dựa trên hành vi của người dùng tương tự

**Multi-step Forms & Personalization**:
- Thu thập thông tin ban đầu từ người dùng về:
  - Mục tiêu học tập (Frontend, Backend, Mobile, DevOps, etc.)
  - Trình độ hiện tại (Beginner, Intermediate, Advanced)
  - Sở thích và lĩnh vực quan tâm
- Tạo kế hoạch học tập cá nhân hóa dựa trên các lựa chọn
- Điều chỉnh gợi ý theo thời gian dựa trên tiến độ và phản hồi

#### 4.2.2. Hệ thống điểm danh thông minh

**IoT Fingerprint Attendance**:
- Thiết bị điểm danh vân tay kết nối với hệ thống qua MQTT/HTTP
- Đăng ký vân tay cho từng học viên
- Điểm danh tự động khi học viên chạm vào thiết bị
- Đồng bộ dữ liệu real-time lên hệ thống
- Báo cáo và thống kê điểm danh tự động

**AI Face Recognition Attendance**:
- Xử lý và chuẩn hóa hình ảnh khuôn mặt học viên
- Tạo vector embedding từ ảnh mẫu của từng học viên
- So sánh độ khớp vector với ảnh mẫu khi điểm danh
- Xác thực danh tính và ghi nhận điểm danh tự động
- Hỗ trợ điểm danh qua webcam hoặc mobile app

#### 4.2.3. Giám sát môi trường học tập (Environment Monitor)

**Thu thập dữ liệu**:
- Cảm biến nhiệt độ và độ ẩm (DHT22)
- Cảm biến ánh sáng (BH1750)
- Gửi dữ liệu định kỳ lên hệ thống qua MQTT

**Phân tích và cảnh báo**:
- Phân tích điều kiện môi trường theo thời gian thực
- Cảnh báo khi nhiệt độ, độ ẩm, ánh sáng không phù hợp
- Đề xuất điều chỉnh để tối ưu môi trường học tập
- Dashboard hiển thị dữ liệu môi trường

#### 4.2.4. Hệ thống giám sát thi cử (AI Proctoring)

**Giám sát qua Browser (TensorFlow.js)**:
- Phát hiện hành vi đáng ngờ (rời khỏi màn hình, mở tab khác)
- Giám sát webcam để phát hiện người khác trong phòng
- Phân tích âm thanh để phát hiện trao đổi với người khác
- Ghi lại video và log các sự kiện đáng ngờ

**Giám sát qua Server (Python)**:
- Xử lý video stream từ webcam với OpenCV và MediaPipe
- Phát hiện gaze tracking (theo dõi ánh mắt)
- Phân tích tư thế và hành vi (head pose, body movement)
- Tạo báo cáo chi tiết về quá trình thi

#### 4.2.5. Hệ thống Quiz & Testing với AI

**Tạo và quản lý Quiz**:
- Tạo câu hỏi trắc nghiệm tự động sau mỗi chương
- Hỗ trợ nhiều loại câu hỏi (multiple choice, true/false, coding challenge)
- Randomize câu hỏi và đáp án để tránh gian lận

**Chấm điểm tự động**:
- Chấm điểm trắc nghiệm tự động
- Chấm điểm code challenge với test cases
- Sử dụng AI để đánh giá câu trả lời tự luận (dự kiến)

**Phân tích kết quả**:
- Phân tích điểm mạnh/yếu của học viên
- Đề xuất bài học bổ sung dựa trên kết quả
- Thống kê và báo cáo chi tiết

#### 4.2.6. Gamification (Trò chơi hóa)

**Hệ thống điểm và XP**:
- Tích điểm khi hoàn thành bài học
- Bonus điểm cho streak (học liên tiếp)
- XP cho việc hoàn thành quiz và assignment

**Leaderboard (Bảng xếp hạng)**:
- Xếp hạng theo XP tổng
- Xếp hạng theo khóa học cụ thể
- Xếp hạng theo tuần/tháng

**Danh hiệu và Badge**:
- Unlock danh hiệu khi đạt milestones
- Badge cho các thành tích đặc biệt
- Hiển thị trên profile cá nhân

#### 4.2.7. Môi trường Code trực tuyến (Interactive Code Sandbox)

**Monaco Editor Integration**:
- Tích hợp Monaco Editor (lõi của VS Code)
- Syntax highlighting cho nhiều ngôn ngữ
- Auto-completion và IntelliSense
- Code formatting và linting

**Sandpack Integration**:
- Tích hợp Sandpack (CodeSandbox) để chạy code
- Hỗ trợ nhiều framework (React, Vue, Angular, etc.)
- Live preview và hot reload
- Chạy code trên browser, không cần server

**Tính năng**:
- Viết và chạy code trực tiếp trên trình duyệt
- Làm bài tập coding với test cases tự động
- Chia sẻ code với cộng đồng

#### 4.2.8. Hệ thống chứng chỉ số (Digital Certificates)

**Tạo chứng chỉ tự động**:
- Tự động tạo chứng chỉ khi hoàn thành khóa học
- Sử dụng thư viện hỗ trợ để tạo chứng chỉ chuyên nghiệp
- Tích hợp chữ ký số và logo trường
- Mã QR code để verify chứng chỉ

**Bộ sưu tập chứng chỉ**:
- Trang profile hiển thị bộ sưu tập chứng chỉ
- Download chứng chỉ dưới dạng PDF
- Chia sẻ chứng chỉ lên LinkedIn và mạng xã hội

#### 4.2.9. Hệ thống thanh toán & Thương mại

**Tích hợp Payment Gateway**:
- Hỗ trợ thanh toán qua thẻ tín dụng/ghi nợ
- Tích hợp ví điện tử (MoMo, ZaloPay, etc.)
- Quản lý subscription và membership

**Quản lý khóa học trả phí**:
- Đặt giá cho khóa học
- Quản lý discount và promotion
- Theo dõi doanh thu và báo cáo

#### 4.2.10. AI Video Recommendation

**Phân tích và đề xuất video**:
- Sử dụng AI để phân tích nội dung video từ YouTube hoặc nền tảng thứ 3
- Đề xuất video phù hợp cho từng bài học dựa trên:
  - Độ liên quan về nội dung
  - Chất lượng và độ phổ biến
  - Trình độ phù hợp (beginner/intermediate/advanced)
- Tự động cập nhật danh sách video đề xuất

---

## 📦 5. Cấu trúc dự án

```
maitam-ai-learning/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (main)/              # Layout chính cho người dùng
│   │   │   ├── courses/         # Trang khóa học
│   │   │   ├── roadmap/         # Lộ trình học tập
│   │   │   ├── profile/         # Hồ sơ cá nhân
│   │   │   └── ...
│   │   ├── admin/               # Giao diện quản trị
│   │   ├── api/                 # API Routes
│   │   │   ├── ai/              # AI services endpoints
│   │   │   ├── iot/             # IoT services endpoints
│   │   │   └── ...
│   │   ├── auth/                # Trang đăng nhập/đăng ký
│   │   └── ...
│   ├── components/               # Các component tái sử dụng
│   │   ├── ui/                  # UI components
│   │   ├── course/              # Course-related components
│   │   ├── roadmap/             # Roadmap components
│   │   ├── code-editor/         # Code editor components
│   │   └── ...
│   ├── lib/                     # Các hàm tiện ích
│   │   ├── supabase/            # Supabase client
│   │   ├── ai/                  # AI utilities
│   │   ├── iot/                 # IoT utilities
│   │   └── ...
│   ├── contexts/                # React contexts
│   ├── hooks/                   # Custom hooks
│   ├── types/                   # TypeScript definitions
│   └── styles/                  # Global styles
├── public/                       # Static assets
├── scripts/                      # Build và deployment scripts
├── docs/                         # Tài liệu
└── ...
```

---

## 🛠️ 6. Hướng dẫn cài đặt và triển khai

### 6.1. Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0 (hoặc npm/yarn)
- **Git**: >= 2.0.0
- **Supabase Account**: Để sử dụng database và auth
- **VPS**: Để triển khai AI và IoT services (tùy chọn)

### 6.2. Cài đặt Local Development

1. **Clone repository:**
   ```bash
   git clone https://github.com/maitamdev/maitam-ai-learning.git
   cd maitam-ai-learning
   ```

2. **Cài đặt dependencies:**
   ```bash
   pnpm install
   ```

3. **Cấu hình biến môi trường:**
   Tạo file `.env.local` trong thư mục gốc:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Cloudinary Configuration (for video/image storage)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # VPS/MySQL Configuration (for AI & IoT services)
   MYSQL_HOST=your_mysql_host
   MYSQL_USER=your_mysql_user
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DATABASE=your_mysql_database
   
   # AI Services Configuration
   AI_SERVICE_URL=your_ai_service_url
   AI_API_KEY=your_ai_api_key
   
   # IoT Gateway Configuration
   IOT_GATEWAY_URL=your_iot_gateway_url
   MQTT_BROKER_URL=your_mqtt_broker_url
   ```

4. **Khởi tạo database:**
   - Chạy migration scripts trên Supabase
   - Thiết lập Row Level Security (RLS) policies
   - Tạo các stored procedures và functions cần thiết

5. **Chạy development server:**
   ```bash
   pnpm dev
   ```

6. **Truy cập:** [http://localhost:3000](http://localhost:3000)

### 6.3. Triển khai Production

**Frontend (Vercel):**
1. Kết nối repository với Vercel
2. Cấu hình environment variables
3. Deploy tự động khi push code lên main branch

**Backend Services (VPS):**
1. Setup Node.js/Python environment trên VPS
2. Cài đặt MySQL và cấu hình database
3. Deploy AI và IoT services
4. Cấu hình reverse proxy (Nginx)
5. Setup SSL certificate (Let's Encrypt)

**IoT Devices:**
1. Flash firmware lên ESP32/Arduino
2. Cấu hình WiFi và MQTT connection
3. Kết nối với hệ thống qua IoT Gateway

---

## 📊 7. Kết quả đạt được và đánh giá

### 7.1. Kết quả đã đạt được

✅ **Hệ thống E-Learning cốt lõi**:
- Hệ thống quản lý khóa học và nội dung học tập hoàn chỉnh
- Giao diện người dùng hiện đại, responsive và thân thiện
- Hệ thống xác thực và phân quyền người dùng
- Quản lý nội dung với Markdown editor chuyên nghiệp
- Theo dõi tiến độ học tập với visualization

✅ **Cải thiện giao diện**:
- Landing page marketing cho khóa học
- Video giới thiệu khóa học
- Hiển thị thông tin giảng viên
- Roadmap theo phong cách roadmap.sh

🔄 **Đang phát triển**:
- Hệ thống gợi ý AI (Content-based & Collaborative Filtering)
- IoT Fingerprint Attendance
- AI Face Recognition Attendance
- Environment Monitoring
- AI Proctoring
- Gamification system
- Interactive Code Sandbox
- Digital Certificates
- Payment integration

### 7.2. Đánh giá và so sánh

**Ưu điểm**:
- Kiến trúc phân tán, dễ mở rộng
- Tích hợp nhiều công nghệ hiện đại (AI, IoT)
- Giao diện đẹp và trải nghiệm người dùng tốt
- Code quality cao với TypeScript

**Hạn chế và thách thức**:
- Độ phức tạp cao khi tích hợp nhiều công nghệ
- Chi phí infrastructure cho AI và IoT services
- Cần tối ưu hóa hiệu suất khi scale

---

## 🔮 8. Kết luận và hướng phát triển

### 8.1. Kết luận

Đồ án tốt nghiệp này đã thành công trong việc nâng cấp hệ thống E-Learning từ đồ án chuyên ngành lên một nền tảng học tập thông minh tích hợp AI và IoT. Hệ thống không chỉ cung cấp các tính năng học tập cơ bản mà còn tích hợp các công nghệ tiên tiến để tạo ra trải nghiệm học tập cá nhân hóa và tự động hóa.

### 8.2. Hướng phát triển tương lai

1. **Mobile Application**: Phát triển ứng dụng mobile (React Native/Flutter) để học viên có thể học mọi lúc mọi nơi.

2. **Advanced AI Features**:
   - Chatbot hỗ trợ học tập sử dụng Large Language Models (LLM)
   - Tự động tạo nội dung bài học với AI
   - Phân tích cảm xúc và engagement của học viên

3. **Social Learning**:
   - Tích hợp mạng xã hội học tập
   - Học nhóm và collaboration tools
   - Peer review và mentoring system

4. **Analytics & Insights**:
   - Advanced analytics dashboard
   - Predictive analytics cho dropout prevention
   - Learning path optimization

5. **Accessibility**:
   - Hỗ trợ đa ngôn ngữ
   - Accessibility features cho người khuyết tật
   - Offline mode cho các khu vực internet kém

---

## 📚 9. Tài liệu tham khảo

### 9.1. Tài liệu kỹ thuật
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Monaco Editor Documentation](https://microsoft.github.io/monaco-editor/)
- [Sandpack Documentation](https://sandpack.codesandbox.io/)

### 9.2. Tài liệu AI/ML
- Scikit-learn Documentation - Machine Learning algorithms
- TensorFlow.js Documentation - Browser-based ML
- OpenCV Documentation - Computer Vision

### 9.3. Tài liệu IoT
- ESP32 Documentation
- MQTT Protocol Specification
- Arduino Documentation

### 9.4. Tài liệu học thuật
- Industry 5.0 Trends in Education
- E-Learning Best Practices
- Gamification in Education Research Papers

---

## 📝 10. Liên hệ

**Sinh viên thực hiện**: MaiTamDev  
**Email**: maitamdev@gmail.com  
**GitHub**: [maitamdev](https://github.com/maitamdev)  
**Website**: [maitamdev.com](https://maitamdev.com)

**Trường MaiTamDev Academy**  
**MaiTamDev Team**

---

© 2025 Nền tảng học lập trình tích hợp AI - MaiTamDev Academy. All rights reserved.
