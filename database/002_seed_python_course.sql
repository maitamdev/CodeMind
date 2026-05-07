-- ============================================
-- CodeMind — Seed Data cho Khóa học Python (Chương 1)
-- ============================================

DO $$
DECLARE
    v_category_id UUID;
    v_course_id UUID;
    v_chapter_id UUID;
BEGIN
    -- ============================================
    -- 1. TẠO DANH MỤC LẬP TRÌNH
    -- ============================================
    INSERT INTO categories (name, slug, description, icon)
    VALUES (
        'Lập trình', 
        'lap-trinh', 
        'Nền tảng vững chắc để bước vào thế giới Công nghệ thông tin', 
        'Code2'
    )
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_category_id;

    -- ============================================
    -- 2. TẠO KHÓA HỌC PYTHON
    -- ============================================
    INSERT INTO courses (
        title, slug, description, short_description, thumbnail_url, 
        level, is_free, is_published, estimated_duration, 
        category_id, learning_outcomes, requirements, tags
    )
    VALUES (
        'Python từ Zero đến Hero', 
        'python-tu-zero-den-hero', 
        'Khóa học Python toàn diện được thiết kế đặc biệt dành cho người mới bắt đầu. Không chỉ dạy cú pháp, khóa học tập trung mạnh vào việc rèn luyện "tư duy lập trình" - thứ quan trọng nhất để bạn có thể tự học bất kỳ ngôn ngữ nào khác sau này.',
        'Khởi đầu hành trình lập trình của bạn với Python - ngôn ngữ dễ học, mạnh mẽ và phổ biến nhất thế giới hiện nay.',
        'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?q=80&w=1200&auto=format&fit=crop',
        'BEGINNER', 
        true, 
        true, 
        1200, -- 20 giờ
        v_category_id,
        '["Hiểu rõ tư duy lập trình và cách giao tiếp với máy tính", "Thành thạo cú pháp cơ bản và các cấu trúc dữ liệu cốt lõi của Python", "Có khả năng tự viết các script tự động hóa công việc hàng ngày", "Tự tin bước tiếp vào các lĩnh vực chuyên sâu như Web Backend, Data Science hoặc Trí tuệ nhân tạo (AI)"]'::jsonb,
        '["Sở hữu một chiếc máy tính có kết nối Internet", "Không yêu cầu bất kỳ kiến thức lập trình nào trước đó", "Sự kiên trì và tinh thần sẵn sàng đối mặt với lỗi (bugs)"]'::jsonb,
        ARRAY['python', 'lập trình cơ bản', 'backend', 'ai']
    )
    ON CONFLICT (slug) DO UPDATE SET 
        title = EXCLUDED.title,
        is_published = true
    RETURNING id INTO v_course_id;

    -- Xóa các chương cũ của khóa này (nếu chạy lại script)
    DELETE FROM chapters WHERE course_id = v_course_id;

    -- ============================================
    -- 3. TẠO CHƯƠNG 1
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 1: Nhập môn Python & Tư duy lập trình', 
        'Làm quen với ngôn ngữ Python, cài đặt môi trường và viết những dòng code đầu tiên. Ở chương này, quan trọng nhất là hình thành tư duy học đúng đắn.',
        1
    )
    RETURNING id INTO v_chapter_id;

    -- ============================================
    -- 4. TẠO CÁC BÀI HỌC (LESSONS)
    -- ============================================

    -- BÀI 1: PYTHON LÀ GÌ?
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 1: Python là gì? Vì sao nên bắt đầu với Python?', 
        'reading', 
        1, 
        15,
        E'# Python là gì và dùng để làm gì?\n\nChào mừng bạn đến với bài học đầu tiên! Trước khi bắt tay vào viết những dòng code rực rỡ, chúng ta cần hiểu rõ chúng ta đang học cái gì và tại sao lại học nó.\n\n## 1. Ngôn ngữ lập trình là gì?\n\nMáy tính là một cỗ máy cực kỳ mạnh mẽ, nhưng nó lại rất "ngốc". Nó không tự hiểu ngôn ngữ của con người như tiếng Việt hay tiếng Anh. Nó chỉ hiểu tín hiệu điện (0 và 1).\n\n**Ngôn ngữ lập trình** chính là công cụ trung gian, giúp con người có thể "ra lệnh" cho máy tính thực hiện các công việc mà chúng ta mong muốn, bằng một cú pháp mà cả con người (có thể đọc được) và máy tính (có thể dịch ra 0 và 1) đều hiểu.\n\n## 2. Vậy Python là gì?\n\nPython là một ngôn ngữ lập trình bậc cao, được thiết kế với triết lý: **Mã nguồn phải dễ đọc, dễ viết và gần gũi với ngôn ngữ tự nhiên (tiếng Anh).**\n\n> 💡 **Fun Fact:** Tên gọi Python không xuất phát từ loài rắn độc, mà được cha đẻ Guido van Rossum lấy cảm hứng từ chương trình hài kịch *Monty Python’s Flying Circus* trên đài BBC.\n\nVí dụ, để in ra dòng chữ "Xin chào", trong khi các ngôn ngữ khác (như Java, C++) đòi hỏi bạn phải viết 4-5 dòng code phức tạp, thì Python chỉ cần đúng 1 dòng:\n\n```python\nprint("Xin chào Python!")\n```\n\n## 3. Vì sao Python lại là "Vua" của người mới bắt đầu?\n\n1. **Cú pháp tối giản:** Bạn không phải đau đầu với các ký tự `{ }`, `;` chằng chịt. Code Python nhìn rất sạch sẽ và giống như bạn đang đọc một câu tiếng Anh.\n2. **Tập trung vào tư duy:** Nhờ cú pháp dễ, bạn sẽ dành 90% não bộ để suy nghĩ cách giải quyết bài toán (tư duy thuật toán) thay vì vật lộn với cách viết code sao cho khỏi báo lỗi.\n3. **Cộng đồng khổng lồ:** Gặp lỗi ư? Chỉ cần copy lỗi đó lên Google, sẽ có hàng triệu lập trình viên đi trước đã gặp lỗi đó và có sẵn câu trả lời cho bạn.\n\n## 4. Học Python xong có thể làm gì?\n\nPython được mệnh danh là "Ngôn ngữ đa năng". Khi thành thạo Python, bạn có thể rẽ hướng sang:\n\n*   **Trí tuệ nhân tạo (AI) & Machine Learning:** Lĩnh vực "hot" nhất hiện nay. Từ Chatbot, nhận diện khuôn mặt đến xe tự lái đều dùng Python.\n*   **Phân tích dữ liệu (Data Analysis):** Thay vì dùng Excel xử lý vài nghìn dòng dữ liệu bị giật lag, Python có thể xử lý hàng triệu dòng dữ liệu trong vài giây.\n*   **Lập trình Web (Backend):** Các "ông lớn" như Instagram, Spotify, Netflix đều sử dụng Python để xây dựng hệ thống máy chủ.\n*   **Tự động hóa (Automation):** Viết bot tự động gửi email, tự động tải file, tự động cào dữ liệu (crawl data) từ các website khác.\n\n## 5. Nhược điểm của Python\n\nLà một người học lập trình, bạn cần có cái nhìn khách quan. Python không hoàn hảo. Nhược điểm lớn nhất của nó là **Tốc độ thực thi chậm hơn** so với các ngôn ngữ biên dịch như C hay C++. \n\nTuy nhiên, trong 90% các bài toán thực tế, tốc độ của máy tính hiện đại đã bù đắp lại nhược điểm này. Lợi ích về thời gian viết code nhanh chóng mà Python mang lại vượt trội hơn nhiều so với phần nghìn giây thời gian chạy bị mất đi.\n\n---\n\n### 📝 Bài tập tự tư duy\n1. Hãy lấy giấy bút và ghi lại **Mục tiêu lớn nhất** của bạn khi học khóa Python này là gì? (Làm web, làm AI, hay đơn giản là muốn biết lập trình?)\n2. Viết mục tiêu đó ra một tờ giấy note và dán lên màn hình máy tính. Khi nào gặp code khó (chắc chắn sẽ có), hãy nhìn vào tờ giấy đó để đi tiếp!'
    );

    -- BÀI 2: CÀI ĐẶT
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 2: Trang bị vũ khí (Cài đặt Python & VS Code)', 
        'reading', 
        2, 
        20,
        E'# Trang bị "vũ khí" để học lập trình\n\nĐể bắt đầu hành trình, chúng ta không thể "code chay" ra giấy được. Bạn cần cài đặt môi trường lập trình lên chiếc máy tính của mình. Chúng ta cần 2 công cụ cốt lõi:\n\n1.  **Python Interpreter (Trình thông dịch Python):** Đây là "bộ não" giúp máy tính của bạn đọc và hiểu được các đoạn code Python bạn sắp viết ra.\n2.  **Code Editor (Trình soạn thảo mã):** Nơi bạn gõ code. Có rất nhiều công cụ, nhưng trong khóa này ta sẽ dùng **Visual Studio Code (VS Code)** vì nó nhẹ, miễn phí và phổ biến nhất thế giới.\n\n---\n\n## 1. Cài đặt Python Interpreter\n\n### Bước 1: Tải bộ cài\nTruy cập trang chủ chính thức: [https://www.python.org/downloads/](https://www.python.org/downloads/)\nBấm vào nút **Download Python 3.x.x** (phiên bản mới nhất).\n\n### Bước 2: Chạy file cài đặt (CỰC KỲ QUAN TRỌNG)\nKhi mở file cài đặt (.exe) vừa tải về, bạn sẽ thấy một cửa sổ hiện ra. **Khoan hãy bấm Next!**\n\n> ⚠️ **LƯU Ý SINH TỬ:** Ở phía dưới cùng của cửa sổ cài đặt, có một ô vuông ghi là `Add Python to PATH` (hoặc `Add python.exe to PATH`). **BẠN BẮT BUỘC PHẢI TÍCH VÀO Ô NÀY!**\n\nNếu quên tích ô này, máy tính sẽ "mù quáng" không biết lệnh `python` nằm ở đâu khi bạn gõ trên Terminal sau này.\n\nSau khi đã tích, hãy bấm `Install Now` và đợi hoàn tất.\n\n### Bước 3: Kiểm tra cài đặt\nMở ứng dụng **Command Prompt** (trên Windows) hoặc **Terminal** (trên macOS) và gõ chính xác dòng lệnh sau:\n\n```bash\npython --version\n```\n\nNếu màn hình in ra dòng chữ `Python 3.x.x` (ví dụ: Python 3.12.1) thì xin chúc mừng, bạn đã cài thành công!\n\n---\n\n## 2. Cài đặt Visual Studio Code (VS Code)\n\n### Bước 1: Tải và cài đặt\nTruy cập [https://code.visualstudio.com/](https://code.visualstudio.com/) và tải bản dành cho hệ điều hành của bạn. Cài đặt cứ bấm `Next` liên tục như các phần mềm bình thường.\n\n### Bước 2: Cài Extension Python cho VS Code\nVS Code mặc định chưa hỗ trợ Python tận răng. Bạn cần "độ" thêm cho nó.\n\n1. Mở VS Code lên.\n2. Nhìn sang thanh menu dọc bên tay trái, bấm vào icon có hình **4 ô vuông** (Extensions).\n3. Gõ chữ `Python` vào ô tìm kiếm.\n4. Chọn kết quả đầu tiên (do Microsoft phát hành) và bấm **Install**.\n\nTiện ích này sẽ giúp bạn tô màu code cho đẹp, tự động gợi ý code, và hỗ trợ chạy code chỉ bằng một nút bấm (nút hình tam giác ở góc phải màn hình).\n\n---\n\n## 3. Viết chương trình đầu tay\n\nGiờ thì vũ khí đã đầy đủ, hãy xuất chiêu!\n\n1. Tạo một thư mục mới trên Desktop máy tính, đặt tên là `HocPython`.\n2. Mở VS Code, chọn `File > Open Folder...` và mở thư mục `HocPython` đó lên.\n3. Trong thư mục này, tạo một file mới có tên là `bai1.py` (Nhớ phải có đuôi `.py`).\n4. Gõ đoạn code kinh điển sau vào:\n\n```python\nprint("Xin chao CodeMind! Toi dang hoc Python.")\n```\n\n5. Nhấn `Ctrl + S` để lưu file.\n6. Nhấn vào nút **Play (Run)** hình tam giác ở góc trên cùng bên phải của VS Code.\n7. Nhìn xuống cửa sổ Terminal bên dưới, bạn sẽ thấy máy tính đã "nói" lại chính xác câu bạn vừa ra lệnh!\n\n> 🎉 Chúc mừng! Bạn đã chính thức trở thành một Coder (Người viết mã)!'
    );

    -- BÀI 3: TERMINAL & FILE
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 3: Giao tiếp với Terminal & Phân biệt Shell vs File', 
        'reading', 
        3, 
        15,
        E'# Bí thuật sử dụng Terminal\n\nHầu hết người dùng máy tính bình thường chỉ biết dùng chuột click vào các biểu tượng đồ họa (GUI). Nhưng các Hacker hay Lập trình viên chuyên nghiệp lại thích gõ những dòng lệnh màu trắng trên màn hình đen. Đó chính là **Terminal**.\n\n## 1. Terminal là gì?\nTerminal (hay Command Prompt trên Windows) là cửa sổ để bạn gõ lệnh văn bản điều khiển máy tính, thay vì dùng chuột.\n\nTrong lập trình, đặc biệt là lập trình web/backend, bạn sẽ phải làm việc với Terminal cực kỳ nhiều. Hãy làm quen với nó.\n\n### Các lệnh Terminal "phải thuộc lòng":\n\n*   `pwd` (trên Mac/Linux) hoặc `cd` (không có tham số trên Win): Xem bạn đang đứng ở thư mục nào.\n*   `ls` (trên Mac/Linux) hoặc `dir` (trên Win): Liệt kê tất cả các file có trong thư mục hiện tại.\n*   `cd ten_thu_muc`: Di chuyển vào bên trong một thư mục (Change Directory).\n*   `cd ..`: Lùi lại thư mục cha (ra ngoài một bậc).\n*   `clear` (trên Mac/Linux) hoặc `cls` (trên Win): Xóa sạch màn hình Terminal cho đỡ rối mắt.\n\n---\n\n## 2. Phân biệt Python Shell và File `.py`\n\nCó 2 cách để ra lệnh cho Python:\n\n### Cách 1: Gõ lệnh trực tiếp qua Python Shell (Interactive Mode)\nMở Terminal lên, bạn chỉ cần gõ `python` rồi Enter. Màn hình sẽ hiện ra dấu `>>>`.\n\nLúc này bạn đang "chat" trực tiếp với Python. \nBạn gõ `10 + 20` rồi Enter -> Nó trả về `30` ngay lập tức.\n\n**Ưu điểm:** Cực nhanh để nháp, test thử một công thức toán học hoặc một đoạn code ngắn.\n**Nhược điểm:** Tắt Terminal là bay sạch code, không lưu lại được.\n\n### Cách 2: Viết vào File `.py` (Script Mode)\nThay vì chat trực tiếp, bạn viết tất cả "kịch bản" (script) vào một file văn bản như `app.py`. \nSau đó, bạn bắt Terminal chạy kịch bản đó bằng lệnh:\n\n```bash\npython app.py\n```\n\n**Ưu điểm:** Lưu trữ vĩnh viễn, chia sẻ được cho người khác, viết được ứng dụng lớn hàng vạn dòng code.\n\n> 🎯 **Quy tắc:** Khi học cú pháp mới ngắn gọn -> Dùng Shell. Khi làm bài tập hoặc dự án -> Dùng File `.py`.'
    );

    -- BÀI 4: CẤU TRÚC CHƯƠNG TRÌNH
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 4: Mổ xẻ cấu trúc một chương trình Python', 
        'reading', 
        4, 
        20,
        E'# Cấu trúc của một chương trình Python\n\nMột bài văn luôn có Mở bài, Thân bài, Kết bài. Code Python cũng có những quy tắc về cấu trúc mà bạn phải tuân thủ nghiêm ngặt.\n\n## 1. Dòng chảy từ trên xuống dưới (Top-Down)\n\nPython đọc và thực thi code y hệt như cách con người đọc sách: Từ trên xuống dưới, từ trái qua phải.\n\n```python\nprint("Dòng 1")\nprint("Dòng 2")\nprint("Dòng 3")\n```\nMáy tính không bao giờ in Dòng 3 trước Dòng 1. Nếu dòng 1 bị lỗi, chương trình sẽ lập tức "chết" (Crash) ngay tại dòng 1 và dòng 2, 3 sẽ không bao giờ được chạy.\n\n## 2. Comment (Ghi chú)\n\nTrong lúc viết code, đôi khi bạn cần viết những câu giải thích bằng tiếng người cho chính mình hoặc đồng nghiệp đọc. Nhưng nếu viết lung tung, Python sẽ báo lỗi vì nó không hiểu.\n\nGiải pháp là dùng **Comment (Ghi chú)**. Python sẽ **lờ đi hoàn toàn** những gì được đánh dấu là ghi chú.\n\n*   **Ghi chú 1 dòng:** Bắt đầu bằng dấu `#`\n\n```python\n# Đây là chương trình tính tiền điện\nprint(50 * 3500) # Lấy 50 số điện nhân với giá 3500đ\n```\n\n## 3. Lỗi thụt lề (Indentation Error)\n\nĐây là "đặc sản" của Python và cũng là thứ làm người mới điên đầu nhất. \n\nTrong các ngôn ngữ khác, người ta dùng dấu ngoặc nhọn `{ }` để gom nhóm các đoạn code lại với nhau. Code có lộn xộn, không thẳng hàng thì máy tính vẫn chạy tốt. \n\nNhưng với Python, **khoảng trắng và sự thẳng hàng là bắt buộc**.\n\n```python\n# ĐOẠN CODE LỖI:\nprint("Bắt đầu")\n  print("Xin chào") # Lỗi! Tự nhiên bị thụt vào 2 dấu cách vô lý\n\n# ĐOẠN CODE ĐÚNG:\nprint("Bắt đầu")\nprint("Xin chào")\n```\n\n> 🛑 **Kỷ luật thép:** Khi mới học, hãy đảm bảo TẤT CẢ các dòng code của bạn đều dính sát lề bên trái (trừ khi sau này học đến các cấu trúc rẽ nhánh `if` hay vòng lặp `for`).'
    );

    -- BÀI 5: PHƯƠNG PHÁP HỌC
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 5: Bí kíp sống sót - Cách học code không nản', 
        'reading', 
        5, 
        10,
        E'# Cách học lập trình khác hoàn toàn học Lịch sử!\n\nRất nhiều bạn sinh viên mang thói quen học thuộc lòng ở cấp 3 áp dụng vào lập trình và thất bại thảm hại. Dưới đây là những tư duy bạn BẮT BUỘC phải cài đặt vào não mình ngay từ hôm nay:\n\n## 1. Không xem video/đọc bài như xem phim\n\nNhìn người khác code thì rất dễ hiểu, "A, ra là thế!". Nhưng khi tự gập máy lại và gõ, bạn sẽ quên sạch hoặc báo lỗi tè le.\n\n👉 **Giải pháp:** Học đến đâu, mở VS Code ra tự gõ lại đến đó. Tuyệt đối **KHÔNG COPY PASTE** mã nguồn mẫu. Việc tự tay gõ từng chữ sẽ giúp "cơ bắp" của các ngón tay ghi nhớ cú pháp.\n\n## 2. Bug (Lỗi) là bạn, không phải kẻ thù\n\nKhi thấy Terminal hiện lên những dòng chữ màu đỏ báo lỗi (SyntaxError, NameError...), người mới thường có tâm lý hoảng sợ, tưởng mình làm hỏng máy tính hoặc nghĩ mình quá dốt.\n\nSự thật: Lập trình viên 10 năm kinh nghiệm mỗi ngày vẫn gặp hàng tá lỗi! \n\n👉 **Giải pháp:** Khi gặp lỗi đỏ, hãy hít một hơi thật sâu. Đọc lỗi từ dưới lên trên. Copy dòng thông báo lỗi bằng tiếng Anh đó ném lên Google. 99% sẽ có người chỉ bạn cách sửa ở các trang web như StackOverflow.\n\n## 3. Hãy đập phá code\n\nSau khi gõ lại được một ví dụ thành công, đừng vội chuyển bài. Hãy "đập phá" nó. \n*Thử xóa bớt một dấu ngoặc xem nó báo lỗi gì?* \n*Thử đổi chữ này thành chữ khác xem kết quả đổi thế nào?* \n\nQuá trình "nghịch ngợm" này chính là lúc tư duy lập trình của bạn thực sự phát triển.\n\n## 4. Quy tắc 15 phút\n\nKhi gặp một bài tập khó hoặc một cái lỗi mãi không sửa được. Hãy tự vật lộn với nó trong đúng 15 phút. \nNếu sau 15 phút não bạn bắt đầu bốc khói, hãy đứng dậy, đi uống nước, làm việc khác hoặc đi ngủ. Rất thường xuyên, khi bạn quay lại sau vài giờ, bộ não nghỉ ngơi sẽ giúp bạn nhìn ra lỗi sai ngớ ngẩn (như thiếu dấu phẩy) chỉ trong 3 giây!'
    );

    -- BÀI 6: THỰC HÀNH TỔNG HỢP
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 6: [Dự án nhỏ] Cỗ máy in danh thiếp', 
        'code_exercise', 
        6, 
        30,
        E'# Thử thách đầu tiên: Tạo Name Card trên Terminal\n\nĐã đến lúc tổng hợp tất cả những gì bạn đã học ở Chương 1. Hãy mở VS Code lên, tạo một file tên là `my_profile.py` và thực hiện thử thách sau.\n\n## Yêu cầu đề bài:\n\nSử dụng hàm `print()`, hãy in ra màn hình Terminal một chiếc thẻ danh thiếp (Name Card) của chính bạn, được bọc trong các đường viền đẹp mắt. Thẻ danh thiếp cần có ít nhất các thông tin:\n\n1. Họ và tên\n2. Năm sinh\n3. Nghề nghiệp hiện tại\n4. Sở thích\n5. Một câu nói tâm đắc (Quote)\n\n## Kết quả mong đợi (Ví dụ):\n\n```text\n==============================================\n=               THẺ DANH THIẾP               =\n==============================================\n= Họ Tên: Trần Văn Lập Trình                  =\n= Năm sinh: 2005                             =\n= Nghề nghiệp: Sinh viên IT                  =\n= Sở thích: Chơi game, Nuôi mèo              =\n= Câu nói: \"Chỉ cần không bỏ cuộc, lỗi sẽ fix được!\" =\n==============================================\n```\n\n## Hướng dẫn từng bước:\n\n1. Sử dụng nhiều hàm `print()` xếp liền nhau.\n2. Ở những hàm in ra khung viền, hãy copy một dải các dấu `=` hoặc `*` cho độ dài bằng nhau.\n3. Thử chạy bằng lệnh `python my_profile.py`.\n4. Căn chỉnh lại các khoảng trắng bên trong chuỗi văn bản `" "` sao cho cột chữ nhìn cân đối và thẳng hàng.\n\n> 🏆 Làm xong bài này, bạn đã chính thức bước một chân qua cánh cửa của thế giới Lập trình viên! Hãy chụp ảnh màn hình thành quả và tự thưởng cho mình một tràng pháo tay nhé!'
    );

    -- ============================================
    
    -- ============================================
    -- 5. TẠO CHƯƠNG 2: BIẾN, KIỂU DỮ LIỆU & PHÉP TOÁN
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 2: Biến, Kiểu dữ liệu & Phép toán cơ bản (Chi tiết)', 
        'Đi sâu vào cách Python quản lý bộ nhớ, thao tác với số học, xử lý chuỗi văn bản nâng cao và nền tảng của các thuật toán.',
        2
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI 7
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 7: Biến (Variables) và Bộ Nhớ - Chiếc hộp thần kỳ chứa dữ liệu', 
        'reading', 
        1, 
        25,
        E'# Biến (Variable) và cách Python cấp phát bộ nhớ\n\nTrong Bài 1, bạn đã biết sơ qua về lập trình. Giờ là lúc chúng ta thực sự "nhúng chàm" vào cách hệ thống hoạt động.\n\n## 1. Bản chất của Biến là gì?\n\nHãy tưởng tượng bộ nhớ RAM của máy tính giống như một dãy hàng nghìn chiếc tủ khóa trong siêu thị. Khi bạn muốn cất đồ (dữ liệu), bạn cần chọn một chiếc tủ trống, nhét đồ vào, khóa lại và **dán tên bạn lên đó** để lúc sau còn biết đường lấy ra.\n\nTrong Python, chiếc tủ đó là địa chỉ bộ nhớ, và cái nhãn dán tên bạn chính là **Biến (Variable)**.\n\n```python\n# Cú pháp: Tên_biến = Giá_trị\ntuoi_cua_toi = 25\nten_khoa_hoc = "Python Zero to Hero"\n```\n\nNgay khi bạn chạy dòng code trên, Python đã âm thầm chạy vào RAM, tìm một chiếc tủ trống, nhét con số `25` vào đó, và dán nhãn `tuoi_cua_toi` ra bên ngoài.\n\n## 2. Quy tắc đặt tên biến (Tuyệt đối tuân thủ)\n\nViệc dán nhãn (đặt tên) phải tuân theo luật của siêu thị (Python), nếu không bạn sẽ bị đuổi ra ngoài (Lỗi `SyntaxError`).\n\n✅ **ĐƯỢC PHÉP:**\n- Dùng chữ cái tiếng Anh (a-z, A-Z).\n- Dùng số (0-9) nhưng **KHÔNG ĐƯỢC ĐỨNG ĐẦU**.\n- Dùng dấu gạch dưới `_` để thay thế khoảng trắng.\n\n❌ **CẤM:**\n- Cấm bắt đầu bằng số: `1st_name = "Tâm"` (Lỗi!)\n- Cấm dùng ký tự đặc biệt: `tien_luong$ = 5000` (Lỗi!)\n- Cấm chứa dấu cách: `ten cua toi = "Tâm"` (Lỗi!)\n- Cấm trùng từ khóa của Python: `print`, `if`, `while`, `for`, `def`, `True`, `False`.\n\n## 3. Phong cách đặt tên (Sống còn khi đi làm)\n\nBạn viết code không phải chỉ cho máy tính đọc, mà còn cho **bạn của 3 tháng sau** và **đồng nghiệp** đọc. Nếu đặt tên biến kiểu `a = 5`, `b = 10`, bạn sẽ sớm bị đồng nghiệp "tế sống".\n\nTrong Python, chuẩn mực tối cao do cộng đồng đề ra (gọi là chuẩn **PEP-8**) yêu cầu dùng phong cách **snake_case** (con rắn):\n\n```python\n# Tồi: Không biết biến này chứa cái gì\nx = 1000\ny = True\n\n# Bình thường: Camel Case (Phổ biến ở Java/JS, ít dùng ở Python)\nsoTienTrongVi = 1000\n\n# Hoàn hảo: Snake Case (Đậm chất Python)\nso_tien_trong_vi = 1000\nda_thanh_toan = True\n```\n\n## 4. Cơ chế "Dynamic Typing" (Kiểu động) của Python\n\nNếu bạn đã từng học C++ hoặc Java, bạn phải khai báo rõ kiểu dữ liệu trước khi dùng: `int tuoi = 25;`.\n\nPython là ngôn ngữ **Kiểu Động**. Bạn KHÔNG CẦN khai báo kiểu. Python đủ thông minh để tự đoán nó là số hay chữ dựa vào giá trị bạn gán vào. Đặc biệt hơn, biến có thể "thay tâm đổi tính" giữa chừng!\n\n```python\nvi_tien = 500  # Khởi đầu là một con số\nprint(vi_tien)\n\nvi_tien = "Đã rỗng túi!" # Đột nhiên biến thành một chuỗi chữ. Python VẪN CHẤP NHẬN!\nprint(vi_tien)\n```\nSự linh hoạt này giúp Python viết code cực nhanh, nhưng cũng dễ gây ra lỗi tiềm ẩn nếu bạn quên mất biến đó đang chứa loại dữ liệu gì.\n\n---
\n### 📝 Bài tập nhỏ cuối bài\nBạn hãy mở VS Code, tạo file `bai7.py` và thử tạo 3 biến:\n1. Họ tên đầy đủ của bạn.\n2. Năm sinh.\n3. Chiều cao (theo mét, ví dụ 1.75).\nSau đó dùng hàm `print()` in cả 3 biến ra màn hình.'
    );

    -- BÀI 8
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 8: Các kiểu dữ liệu cơ bản - Con số, Văn bản và Logic', 
        'reading', 
        2, 
        25,
        E'# Tứ đại gia tộc Kiểu Dữ Liệu\n\nMáy tính nhìn nhận thế giới qua các định dạng khác nhau. Số `5` dùng để cộng trừ nhân chia, nhưng chữ `"5"` thì chỉ để hiển thị, không thể mang đi làm toán. Việc hiểu rõ 4 kiểu dữ liệu cơ bản dưới đây là BẮT BUỘC.\n\n## 1. Số nguyên (Integer - việt tắt là `int`)\n\nĐại diện cho các số đếm tròn trịa, không có phần lẻ. Có thể là âm hoặc dương. Khác với C++, số `int` trong Python có thể dài vô tận, chỉ bị giới hạn bởi RAM của máy tính.\n\n```python\nso_nguoi = 10\ntien_no = -500000\nkhoang_cach_vu_tru = 9999999999999999999999999999999 # Python cân được hết\n```\n\n## 2. Số thực (Float - viết tắt là `float`)\n\nĐại diện cho các con số có phần thập phân. Lưu ý, trong lập trình ta dùng **dấu chấm `.`** để ngăn cách thập phân (theo chuẩn Mỹ).\n\n```python\nchieu_cao_m = 1.75\npi = 3.14159\n```\n> ⚠️ **Bẫy lỗi:** Nếu bạn viết `1,75` (dùng dấu phẩy), Python sẽ không hiểu nó là số thực mà sẽ hiểu nó là một danh sách (Tuple) chứa số 1 và số 75!\n\n## 3. Chuỗi văn bản (String - viết tắt là `str`)\n\nChuỗi là một dải các ký tự (chữ, số, ký hiệu). Để phân biệt với code lệnh, chuỗi BẮT BUỘC phải nằm giữa cặp dấu ngoặc kép `" "` hoặc ngoặc đơn `\' \' `.\n\n```python\ncau_chao = "Xin chào các bạn"\nso_dien_thoai = \'0987123456\' # Là chuỗi vì nằm trong ngoặc!\n```\n\n**Làm sao để viết chuỗi dài nhiều dòng?**\nSử dụng cặp 3 dấu ngoặc kép `""" """`. Cực kỳ hữu dụng khi viết email hoặc thông báo dài.\n\n```python\nthu_moi = """\nThân gửi anh/chị,\nChúng tôi trân trọng mời anh/chị tham dự buổi tiệc tri ân.\nThời gian: 19h00 tối nay.\n"""\n```\n\n## 4. Logic Đúng/Sai (Boolean - viết tắt là `bool`)\n\nKiểu dữ liệu chỉ có đúng 2 trạng thái: `True` (Đúng) hoặc `False` (Sai). Tên kiểu được lấy theo tên nhà toán học George Boole.\nKiểu Boolean sinh ra để phục vụ cho các cấu trúc rẽ nhánh `if-else` sau này.\n\n```python\nda_thanh_toan = True\nla_nguoi_dung_vip = False\n```\n> ⚠️ **Ghi nhớ:** Chữ cái đầu tiên của `True` và `False` bắt buộc phải **VIẾT HOA**.\n\n---
\n## Kính lúp soi kiểu: Hàm `type()`\n\nKhi nhận dữ liệu từ nguồn ngoài (API, đọc file), bạn thường không biết nó là số hay chữ. Hãy dùng hàm `type()` để ép Python nói ra sự thật.\n\n```python\nbien_bi_an = "100"\nprint(type(bien_bi_an))  # Kết quả: <class \'str\'>\n\nbien_bi_an_2 = 100.0\nprint(type(bien_bi_an_2)) # Kết quả: <class \'float\'>\n```'
    );

    -- BÀI 9
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 9: Ép kiểu dữ liệu (Type Casting) - Khi râu ông nọ cắm cằm bà kia', 
        'reading', 
        3, 
        20,
        E'# Nỗi đau đầu mang tên "TypeError"\n\nBạn sẽ gặp cái lỗi này hàng chục lần mỗi ngày trong thời gian đầu đi làm. Hãy xem đoạn code sau:\n\n```python\ntuoi_chuoi = "20"  # Đây là chuỗi\ntuoi_so = 5      # Đây là số\n\nprint(tuoi_chuoi + tuoi_so)\n```\nNếu chạy đoạn code này, màn hình Terminal sẽ nổ tung với dòng đỏ lòm: `TypeError: can only concatenate str (not "int") to str`.\n\nNguyên nhân: Python từ chối việc cộng một chuỗi chữ cái với một con số toán học. Nó không biết bạn muốn làm toán (ra `25`) hay muốn nối chữ (ra `"205"`).\n\n## Giải pháp: Ép Kiểu (Type Casting)\n\nBạn phải dùng các "Câu thần chú" để biến đổi dữ liệu về cùng một phe trước khi thao tác.\n\n### 1. Ép mọi thứ thành Số Nguyên: `int()`\n\n```python\nchuoi_gia_tien = "50000"\ntien_thue = 5000\n\n# Biến chuỗi thành số thực sự\ngia_tien_that = int(chuoi_gia_tien)\n\nprint(gia_tien_that + tien_thue) # Kết quả: 55000 (Toán học)\n```\n> ⚠️ **Cảnh báo:** Bạn KHÔNG THỂ ép chữ cái thành số! `int("Hello")` sẽ lập tức văng lỗi `ValueError` làm sập phần mềm.\n\n### 2. Ép mọi thứ thành Số Thực: `float()`\n\n```python\ngpa = float("8.5")\nprint(gpa + 1.0) # Kết quả: 9.5\n```\n\n### 3. Ép mọi thứ thành Chuỗi Văn Bản: `str()`\n\n```python\ndiem_toan = 10\nloi_nhan = "Chúc mừng bạn đạt điểm "\n\n# Ép số thành chuỗi để nối với chuỗi khác\nprint(loi_nhan + str(diem_toan)) \n# Kết quả: Chúc mừng bạn đạt điểm 10\n```\n\nÉp kiểu là kỹ năng sống còn khi bạn xử lý dữ liệu từ File Excel, CSV hoặc Database, vì các công cụ này thường xuyên tự động chuyển đổi số thành chuỗi mà bạn không hề hay biết.'
    );

    -- BÀI 10
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 10: Toán tử và Biểu thức - Biến máy tính thành siêu máy tính cầm tay', 
        'reading', 
        4, 
        25,
        E'# Phép thuật của Toán học trong Code\n\nTrong phần mềm thực tế, thuật toán đa phần dựa trên các phép toán cơ bản này.\n\n## 1. Toán tử số học căn bản\n\n```python\na = 10\nb = 3\n\nprint("Cộng:", a + b)   # 13\nprint("Trừ:", a - b)    # 7\nprint("Nhân:", a * b)   # 30 (Ký hiệu dấu sao)\nprint("Chia:", a / b)   # 3.3333333333333335 (Luôn ra số Float)\n```\n\n## 2. Bộ ba phép toán Cốt lõi của Lập trình viên\n\nNếu 4 phép trên chỉ là trò trẻ con, thì 3 phép dưới đây mới là vũ khí để bạn vượt qua các vòng phỏng vấn thuật toán.\n\n### A. Chia lấy dư (Modulo `%`)\nTrả về phần "dư thừa" sau khi chia hết. Ví dụ 10 chia 3 được 3, **dư 1**.\n```python\nprint(10 % 3) # Kết quả: 1\n```\n**Ứng dụng thần thánh:**\n- Kiểm tra số chẵn/lẻ: `x % 2 == 0` là chẵn, `x % 2 == 1` là lẻ.\n- Đảo vòng chu kỳ: Ví dụ tìm ngày trong tuần sau N ngày (dùng `% 7`).\n\n### B. Chia lấy nguyên (Floor Division `//`)\nTrả về kết quả phép chia nhưng vứt bỏ toàn bộ phần thập phân (không làm tròn lên).\n```python\nprint(10 // 3) # Kết quả: 3 (Thay vì 3.3333)\nprint(11 // 2) # Kết quả: 5\n```\n\n### C. Lũy thừa (Exponentiation `**`)\n```python\nprint(2 ** 3) # 2 mũ 3 = 8\nprint(5 ** 2) # 5 bình phương = 25\n```\n\n## 3. Toán tử gán rút gọn\n\nLập trình viên rất lười gõ phím. Thay vì viết dài dòng để cập nhật một biến:\n```python\ndiem_kinh_nghiem = 100\n\n# Đánh quái được cộng 50 điểm, cách truyền thống:\ndiem_kinh_nghiem = diem_kinh_nghiem + 50\n\n# Cách dân Pro (Gọn gàng, sạch sẽ):\ndiem_kinh_nghiem += 50\n```\nTương tự, ta có `-=`, `*=`, `/=`. Đặc biệt `+=` còn dùng để nối chuỗi: `loi_chao += " Python"`.'
    );

    -- BÀI 11
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 11: Giao tiếp 2 chiều - Hàm input() và ma thuật F-string', 
        'reading', 
        5, 
        20,
        E'# Tương tác với con người\n\nCode sẽ vô dụng nếu không có dữ liệu từ người dùng. \n\n## 1. Dùng `input()` để lấy thông tin\n\nHàm `input("Câu hỏi")` sẽ làm luồng chạy của chương trình TẠM DỪNG, in câu hỏi ra màn hình và chờ người dùng gõ nội dung từ bàn phím. Khi người dùng ấn Enter, nó sẽ bắt toàn bộ nội dung đó.\n\n```python\nten_khach_hang = input("Xin chào, bạn tên gì? ")\nprint("Chào mừng", ten_khach_hang, "đến với khách sạn.")\n```\n\n> ☠️ **Lưu ý Tử Thần:** Hàm `input()` LUÔN LUÔN trả về dữ liệu kiểu Chuỗi (String). Bất kể người dùng có gõ "1999" thì Python vẫn hiểu đó là `"1999"` (chữ). Để tính toán, bạn phải bọc nó bằng ép kiểu:\n```python\n# Bọc int() ra ngoài input() để lấy số nguyên\nnam_sinh = int(input("Bạn sinh năm bao nhiêu? "))\ntuoi = 2026 - nam_sinh\n```\n\n## 2. Ma thuật F-string (Formatting String)\n\nĐể in ra một đoạn văn bản có ghép các biến vào giữa, cách dùng dấu phẩy `,` hoặc dấu cộng `+` vừa dài vừa dễ sai sót lỗi khoảnh trắng.\n\nTừ Python 3.6, **F-string** ra đời và trở thành chuẩn mực bắt buộc.\n\n**Cú pháp:** Đặt chữ `f` (viết tắt của Format) ngay TRƯỚC dấu ngoặc kép mở. Bất cứ khi nào cần gọi biến, hãy nhét nó vào trong cặp ngoặc nhọn `{}`.\n\n```python\nten = "Mai"\ntuoi = 22\nnghe_nghiep = "Lập trình viên"\n\n# Rất gọn gàng và tự nhiên:\nprint(f"Hồ sơ: Xin chào, tôi tên là {ten}, năm nay tôi {tuoi} tuổi. Tôi là một {nghe_nghiep}.")\n```\n\n**Bí kíp nâng cao với F-string:** Bạn có thể làm toán ngay bên trong `{}`!\n```python\nprint(f"Sau 5 năm nữa, tôi sẽ {tuoi + 5} tuổi.")\n```'
    );

    -- BÀI 12
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 12: [Project thực hành] Phần mềm tính tiền siêu thị nâng cao', 
        'code_exercise', 
        6, 
        40,
        E'# Đồ án kết thúc Chương 2\n\nĐến lúc tổng hợp sức mạnh của Biến, Kiểu dữ liệu, Toán tử, Ép kiểu và F-string. Bạn được siêu thị WinMart thuê viết một script Python thu ngân.\n\n## Đề bài:\nViết file `thu_ngan.py` thực hiện các quy trình sau:\n\n1. Khởi động phần mềm: In ra một banner chào mừng đẹp mắt.\n2. Hỏi người dùng các thông tin sau (nhớ ép kiểu cẩn thận):\n   - `Tên món hàng`\n   - `Số lượng mua`\n   - `Đơn giá (VNĐ)`\n   - `Số tiền khách đưa (VNĐ)`\n3. Thực hiện tính toán Backend:\n   - `Tổng tiền` = Số lượng x Đơn giá\n   - `Tiền thuế VAT (10%)` = Tổng tiền * 0.1\n   - `Tiền cần thanh toán` = Tổng tiền + Thuế\n   - `Tiền thối lại cho khách` = Số tiền khách đưa - Tiền cần thanh toán\n4. In ra màn hình hóa đơn thanh toán chuẩn xác.\n\n## Kết quả in mẫu mong đợi:\n```text\n=========================================\n       HỆ THỐNG THU NGÂN WINMART         \n=========================================\nNhập tên món hàng: Nước ngọt Coca\nNhập số lượng: 5\nNhập đơn giá: 10000\nNhập số tiền khách đưa: 100000\n\nĐANG IN HÓA ĐƠN...\n-----------------------------------------\nSản phẩm: Nước ngọt Coca\nSố lượng: 5  |  Đơn giá: 10000 VNĐ\nTổng trước thuế: 50000 VNĐ\nThuế VAT (10%): 5000.0 VNĐ\n\nTỔNG CỘNG PHẢI TRẢ: 55000.0 VNĐ\nTIỀN KHÁCH ĐƯA: 100000 VNĐ\nTIỀN THỐI LẠI: 45000.0 VNĐ\n-----------------------------------------\nCảm ơn quý khách! Hẹn gặp lại!\n```\n\n> 💡 **Thử thách khó (Điểm A+):** Làm sao để nếu tiền thối lại bị ÂM (khách đưa thiếu tiền), máy vẫn in ra số âm bình thường (Chúng ta sẽ học cách xử lý vụ khách đưa thiếu tiền ở Chương 3 - Lệnh If/Else).\n\nHãy mở VS Code lên và thực hành ngay! Không copy code. Phải tự gõ để bộ não nạp kiến thức sâu nhất.'
    );

    -- ============================================
    -- 6. TẠO CHƯƠNG 3: CẤU TRÚC RẼ NHÁNH & VÒNG LẶP
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 3: Cấu trúc Rẽ nhánh & Vòng lặp (Chuyên sâu)', 
        'Cách điều khiển luồng thực thi của máy tính: Bắt máy tính ra quyết định thông minh dựa trên điều kiện và thực hiện các tác vụ lặp lại hàng vạn lần chỉ trong chớp mắt.',
        3
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI 13
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 13: Biểu thức Logic (So sánh) - Trái tim của sự thông minh', 
        'reading', 
        1, 
        20,
        E'# Toán tử So sánh (Relational Operators)\n\nTrước khi dạy máy tính cách rẽ nhánh (If/Else), bạn phải dạy nó cách **So sánh** sự vật sự việc.\n\nMáy tính không biết ai cao hơn ai, nó chỉ biết so sánh con số thông qua các Toán tử So sánh. Kết quả của mọi phép so sánh LUÔN LUÔN là kiểu `Boolean` (Tức là `True` hoặc `False`).\n\n## 1. Bảng 6 phép so sánh thần thánh\n\n```python\nx = 10\ny = 15\n\nprint(x > y)   # Lớn hơn -> False\nprint(x < y)   # Nhỏ hơn -> True\nprint(x >= 10) # Lớn hơn hoặc bằng -> True\nprint(x <= 5)  # Nhỏ hơn hoặc bằng -> False\n\n# Cực kỳ lưu ý 2 phép dưới đây:\nprint(x == 10) # Dấu bằng KÉP: Kiểm tra xem x có BẰNG 10 không? -> True\nprint(x != y)  # Dấu chấm than bằng: Kiểm tra xem x có KHÁC y không? -> True\n```\n\n> ☠️ **Lỗi "Tử Hình" của người mới:** \n> Rất nhiều bạn viết `x = 10` bên trong khối lệnh `if`. Nhớ kỹ: \n> Dấu `=` đơn là **GÁN giá trị** (đưa tiền vào ví).\n> Dấu `==` kép là **SO SÁNH bằng nhau** (hỏi xem ví có đúng 10 đồng không).\n\n## 2. Toán tử Logic (Kết hợp nhiều điều kiện)\n\nĐời không như mơ, một điều kiện hiếm khi đứng một mình. Ví dụ: Để vay vốn ngân hàng, bạn phải "Trên 18 tuổi" **VÀ** "Lương trên 10 triệu". Ta dùng các toán tử `and`, `or`, `not`.\n\n### A. `and` (VÀ)\nCả 2 vế đều phải ĐÚNG thì kết quả mới ĐÚNG.\n```python\ntuoi = 20\nluong = 15\n\n# True and True -> Trả về True\nprint(tuoi >= 18 and luong > 10) \n```\n\n### B. `or` (HOẶC)\nChỉ cần 1 trong 2 vế ĐÚNG là đủ.\n```python\nco_nha_mat_pho = False\nbo_lam_to = True\n\n# False or True -> Trả về True (Cưới được vợ!)\nprint(co_nha_mat_pho or bo_lam_to)\n```\n\n### C. `not` (PHỦ ĐỊNH)\nLật ngược đen thành trắng. Đúng thành Sai.\n```python\nco_the_bay = False\nprint(not co_the_bay) # Trả về True\n```'
    );

    -- BÀI 14
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 14: Câu lệnh If - Elif - Else: Phân luồng dòng chảy của App', 
        'reading', 
        2, 
        25,
        E'# Trí thông minh nhân tạo bắt đầu từ If-Else\n\nKhi có khả năng so sánh đúng sai, ta có thể xây dựng các ngã rẽ cho chương trình. `if-else` chính là viên gạch đầu tiên của trí tuệ nhân tạo.\n\n## 1. Cấu trúc If (Nếu có... thì làm...)\n\nTừ khóa `if` bắt đầu một luồng điều kiện. Dòng mã kết thúc bằng dấu hai chấm `:`. **Toàn bộ nội dung bên trong If phải lùi vào 1 Tab (hoặc 4 dấu cách)**.\n\n```python\ntuoi = int(input("Bạn bao nhiêu tuổi: "))\n\nif tuoi >= 18:\n    print("Bạn đã đủ tuổi trưởng thành.")\n    print("Bạn có thể đi thi bằng lái xe.")\n    \nprint("Dòng này thụt ra ngoài lề, nên không thuộc về IF. Nó luôn được in ra.")\n```\n\n## 2. Cấu trúc If - Else (Nếu - Ngược lại)\n\nHai luồng song song, chạy 1 trong 2.\n```python\ntien_trong_vi = 50000\ngia_bat_pho = 45000\n\nif tien_trong_vi >= gia_bat_pho:\n    print("Ông chủ, cho 1 bát phở bò đầy đủ!")\n    tien_trong_vi -= gia_bat_pho\nelse:\n    print("Đành ăn mì tôm vậy...")\n```\n\n## 3. Cấu trúc If - Elif - Else (Đa ngã rẽ)\n\n`elif` là viết tắt của "Else If". Nó giúp kiểm tra một loạt các điều kiện từ trên xuống dưới. Ngay khi tìm thấy 1 điều kiện ĐÚNG, khối lệnh đó được chạy và TOÀN BỘ các dòng phía dưới bị bỏ qua lập tức.\n\n```python\ndiem_so = 8.5\n\nif diem_so >= 9.0:\n    print("Học lực: Xuất sắc")\nelif diem_so >= 8.0:\n    print("Học lực: Giỏi")\nelif diem_so >= 6.5:\n    print("Học lực: Khá")\nelse:\n    print("Học lực: Yếu kém")\n```\n> 🧠 **Tư duy Logic:** Bạn có thắc mắc tại sao dòng `elif diem_so >= 8.0` không cần viết thêm điều kiện `and diem_so < 9.0` không? Vì nếu điểm lớn hơn 9.0, nó đã bị chặn lại ngay ở cái `if` đầu tiên rồi, không bao giờ lọt được xuống chữ `elif` thứ hai đâu!'
    );

    -- BÀI 15
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 15: Vòng lặp while - Cỗ máy cày cuốc không mệt mỏi', 
        'reading', 
        3, 
        20,
        E'# Khái niệm Vòng Lặp (Loops)\n\nMáy tính vĩ đại ở chỗ: Nó không biết chán. Bắt nó tính toán 1 phép tính hay 1 tỷ phép tính, thời gian mất chỉ là vài mili-giây. Để ra lệnh lặp lại, ta dùng `while`.\n\n## 1. Cấu trúc của While\n\n`while` dịch ra tiếng Việt là "Trong khi". \nNghĩa là: *Trong khi điều kiện này vẫn còn đúng, thì hãy cứ làm đi làm lại khối code bên trong mãi mãi.*\n\n```python\nso_lan_lap = 1\n\nwhile so_lan_lap <= 5:\n    print(f"Đang chạy lần thứ {so_lan_lap}")\n    so_lan_lap += 1  # BƯỚC CỰC KỲ QUAN TRỌNG: Tăng biến lên để thoát\n    \nprint("Vòng lặp đã kết thúc!")\n```\nCơ chế chạy:\n- Lần 1: `so_lan_lap` là 1. Kiểm tra `1 <= 5` -> Đúng. In ra. Tăng `so_lan_lap` lên 2.\n- Lần 2: `so_lan_lap` là 2. Kiểm tra `2 <= 5` -> Đúng. In ra. Tăng lên 3.\n- ...\n- Lần 6: `so_lan_lap` là 6. Kiểm tra `6 <= 5` -> **SAI**. Vòng lặp lập tức bị hủy bỏ, chạy tiếp code phía dưới.\n\n## 2. Vòng lặp vô tận (Infinite Loop)\n\nNếu bạn quên tăng biến `so_lan_lap`, điều kiện `1 <= 5` sẽ LUÔN LUÔN ĐÚNG ở hàng tỷ lần lặp. Chương trình của bạn sẽ bị treo cứng (Crash).\n\nTuy nhiên, **Vòng lặp vô tận có chủ đích** lại là xương sống của mọi Game hoặc Server.\n```python\n# Một game vòng lặp vô tận cơ bản\nwhile True:\n    lenh = input("Nhập lệnh (go, attack, quit): ")\n    if lenh == "quit":\n        print("Đang tắt game...")\n        break # Lệnh bẻ gãy vòng lặp để thoát\n    else:\n        print("Đang xử lý lệnh của bạn...")\n```'
    );

    -- BÀI 16
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 16: Vòng lặp for và range() - Vẻ đẹp thanh lịch của Python', 
        'reading', 
        4, 
        20,
        E'# Sự mệt mỏi của While\n\nDùng `while` bắt buộc bạn phải nhớ 3 thứ: (1) Khởi tạo biến đếm, (2) Viết điều kiện, (3) Tăng biến đếm. Quên bước (3) là toang.\nPython cung cấp `for` để tự động hóa toàn bộ quá trình đó một cách an toàn và gọn gàng nhất thế giới.\n\n## 1. Lặp qua các phần tử của một tập hợp\n\nChữ `for` trong Python hoạt động theo nguyên lý "Duyệt qua từng cái một".\n\n```python\nchuoi_chu = "PYTHON"\n\n# Biến chu_cai sẽ tự động nhận lần lượt từng chữ cái P, Y, T... qua mỗi vòng lặp\nfor chu_cai in chuoi_chu:\n    print("Chữ:", chu_cai)\n```\n\n## 2. Kết hợp với hàm `range()`\n\nNếu không có sẵn chuỗi chữ cái mà chỉ muốn lặp 100 lần thì sao? Dùng `range()`.\nHàm `range()` tạo ra một nhà máy sản xuất các con số tuần tự.\n\n```python\n# 1. Sinh các số từ 0 đến 4 (Nhỏ hơn 5)\nfor i in range(5):\n    print(i) # Kết quả: 0, 1, 2, 3, 4\n\n# 2. Sinh các số từ 2 đến nhỏ hơn 6 (range(start, stop))\nfor i in range(2, 6):\n    print(i) # Kết quả: 2, 3, 4, 5\n\n# 3. Sinh số nhảy cóc (range(start, stop, step))\nfor i in range(10, 20, 2):\n    print(i) # Kết quả: 10, 12, 14, 16, 18\n```\n\n## 3. Lệnh Break và Continue\n\n- **`break`**: Cầm búa đập vỡ nát vòng lặp. Thoát hẳn ra ngoài.\n- **`continue`**: Bỏ qua các code bên dưới của **lần lặp hiện tại**, cưỡng ép vòng lặp nhảy sang lần lặp tiếp theo.\n\n```python\n# In các số chẵn từ 1 đến 10, nhưng nếu lớn hơn 8 thì dừng.\nfor i in range(1, 11):\n    if i % 2 != 0: # Nếu là số lẻ\n        continue   # Bỏ qua khối code in, nhảy lên lấy i tiếp theo\n    \n    if i > 8:\n        break      # Phá vỡ vòng lặp, thoát hẳn ra ngoài\n        \n    print(i) # Chỉ in ra: 2, 4, 6, 8\n```'
    );

    -- BÀI 17
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 17: [Project thực hành] Xây dựng máy đoán số bí mật', 
        'code_exercise', 
        5, 
        45,
        E'# Đồ án kết thúc Chương 3\n\nHãy tạo một tựa game tương tác cực thú vị bằng vòng lặp và câu lệnh rẽ nhánh.\n\n## Yêu cầu đề bài (Game Đoán Số):\n\n1. Khi game bắt đầu, máy tính sử dụng thư viện `random` để tự động quay ra một con số bí mật từ 1 đến 100.\n   ```python\n   import random\n   so_bi_mat = random.randint(1, 100)\n   ```\n2. Cung cấp cho người chơi **tối đa 7 mạng** (7 lần đoán). Gợi ý: Dùng vòng lặp `for i in range(7)` hoặc `while` đếm mạng.\n3. Mỗi lượt, in ra màn hình: `"Bạn còn [X] lần đoán. Hãy nhập số:"`\n4. Dùng `input()` bắt số người chơi nhập. Ghi nhớ việc ép kiểu `int`!\n5. Dùng `if-elif-else` để kiểm tra:\n   - Nếu đoán sai và lớn hơn số bí mật: In ra "Quá LỚN! Hãy đoán nhỏ hơn."\n   - Nếu đoán sai và nhỏ hơn số bí mật: In ra "Quá NHỎ! Hãy đoán lớn hơn."\n   - Nếu đoán ĐÚNG: In ra "🎉 CHÚC MỪNG! BẠN ĐÃ TRÚNG ĐỘC ĐẮC SAU [Y] LẦN ĐOÁN!". Chặn đứng vòng lặp bằng `break`.\n6. Khi vòng lặp kết thúc mà người chơi vẫn chưa `break` (tức là dùng hết 7 mạng mà vẫn sai), in ra dòng chữ: `"💀 GAME OVER! Bạn đã hết mạng. Số bí mật là: [so_bi_mat]"`.\n\n> 💡 **Gợi ý bí kíp:** Trong Python, vòng lặp `for/while` có thể gắn kèm chữ `else`. Khối `else` này sẽ CHỈ CHẠY nếu vòng lặp kết thúc tự nhiên (không bị phá vỡ bởi `break`). Đây là một trick cực kỳ hay để xử lý trường hợp thua game!\n\nChơi trò này với gia đình hoặc bạn bè để xem họ có đánh bại được thuật toán tìm kiếm nhị phân không nhé!'
    );


    -- ============================================
    -- 7. TẠO CHƯƠNG 4: CẤU TRÚC DỮ LIỆU CỐT LÕI
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 4: Cấu trúc dữ liệu Python cốt lõi (Chuyên sâu)', 
        'Vượt qua giai đoạn tạo biến đơn lẻ. Học cách thao tác và truy xuất hàng triệu dữ liệu cùng lúc thông qua List, Tuple, Dictionary và Set.',
        4
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI 18
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 18: Danh sách (List) - Chiếc túi Doraemon không đáy', 
        'reading', 
        1, 
        25,
        E'# List: Cấu trúc dữ liệu quan trọng số 1\n\nThử tưởng tượng bạn làm quản lý cho 100 nhân viên. Nếu không có List, bạn sẽ phải tạo 100 biến: `nv_1 = "Tâm"`, `nv_2 = "Lan"`... Khi có nhân viên nghỉ việc, bạn không thể xóa biến đó đi một cách dễ dàng.\n\nList sinh ra để gom tất cả lại thành một Khối duy nhất. Nó được biểu diễn bằng ngoặc vuông `[]`.\n\n## 1. Mọi thứ đều có số thứ tự (Index)\n\nList sắp xếp đồ đạc cực kỳ ngăn nắp. Món đồ đầu tiên đưa vào sẽ được đánh số thứ tự là 0, món thứ hai là 1.\n\n```python\ngio_hang = ["Áo thun", "Quần Jean", "Mắt kính"]\n\n# Lấy đồ ra bằng cách đưa Index vào trong ngoặc vuông\nprint(gio_hang[0]) # Áo thun\nprint(gio_hang[2]) # Mắt kính\n\n# 💥 Tuyệt chiêu của Python: Đếm ngược\n# Giả sử List có 1 triệu phần tử, bạn không biết phần tử cuối là bao nhiêu?\nprint(gio_hang[-1]) # Lấy phần tử CUỐI CÙNG: Mắt kính\nprint(gio_hang[-2]) # Lấy phần tử ÁP CHÓT: Quần Jean\n```\n\n## 2. Dao kéo cắt List (Slicing)\n\nBạn không chỉ lấy được 1 phần tử, mà có thể "cắt" một khúc của List ra để dùng.\nCú pháp: `list[start : stop : step]`\n\n```python\ndiem_so = [10, 8, 9, 7, 5, 4]\n\n# Cắt từ vị trí 1 đến sát vị trí 4\ntop_giua = diem_so[1:4] # Kết quả: [8, 9, 7]\n\n# Cắt từ đầu đến vị trí 3\nprint(diem_so[:3]) # [10, 8, 9]\n\n# Cắt toàn bộ List và đảo ngược nó (Mẹo đi thi)\nprint(diem_so[::-1]) # [4, 5, 7, 9, 8, 10]\n```\n\n## 3. Các hàm "Phép thuật" của List\n\n```python\nds = ["A", "B", "C"]\n\nds.append("D")     # Nhét "D" vào cuối List -> ["A", "B", "C", "D"]\nds.insert(1, "X")  # Chen "X" vào vị trí số 1 -> ["A", "X", "B", "C", "D"]\n\nds.remove("B")     # Tìm chữ "B" và vứt nó đi -> ["A", "X", "C", "D"]\nphan_tu_cuoi = ds.pop() # Rút phần tử cuối cùng ra và trả về nó (Rút "D")\n\nprint(len(ds))     # Lấy độ dài (số lượng phần tử) -> Kết quả: 3\n```'
    );

    -- BÀI 19
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 19: Tuple và Set - Những người anh em họ hàng', 
        'reading', 
        2, 
        20,
        E'# Tuple - Chàng vệ sĩ trung thành (Immutable)\n\nTuple (phát âm là Tu-pờ) giống List đến 90%. Nhưng nó dùng ngoặc tròn `()` thay vì ngoặc vuông `[]`.\n\n**Điểm khác biệt chí mạng:** Một khi Tuple đã được tạo ra, **TRỜI SẬP CŨNG KHÔNG THỂ THAY ĐỔI ĐƯỢC NÓ**.\n\n```python\n# Danh sách tọa độ GPS không được phép sai lệch\ntoa_do = (10.5, 20.8)\n\n# Có thể đọc bình thường\nprint(toa_do[0]) \n\n# CẤM SỬA CHỮA\ntoa_do[0] = 99.9 # ❌ TypeError: \'tuple\' object does not support item assignment\n```\n\n> **Tại sao phải dùng Tuple?** \n> 1. Tránh việc đồng nghiệp khác code lỡ tay xóa mất cấu hình quan trọng.\n> 2. Bộ nhớ xử lý Tuple luôn nhanh và nhẹ hơn List.\n\n---\n\n# Set - Tập hợp toán học (Không trùng lặp)\n\nSet là cấu trúc dữ liệu dùng ngoặc nhọn `{}`. Đặc điểm nổi bật nhất của Set là: **Tuyệt đối không chứa 2 phần tử giống nhau!**.\n\n```python\nid_nguoi_dung = {101, 102, 103, 101, 101, 102}\n\n# Python sẽ tự động đè bẹp các giá trị trùng lặp\nprint(id_nguoi_dung) # Kết quả chỉ còn: {101, 102, 103}\n```\n\n**Ứng dụng thực tế của Set:** Lọc trùng dữ liệu.\nGiả sử bạn cào data được 1000 email, nhưng trong đó có nhiều email bị trùng. Thay vì viết vòng lặp dài dòng để kiểm tra, bạn chỉ cần ép List thành Set.\n\n```python\nlist_email_rac = ["a@gmail.com", "b@gmail.com", "a@gmail.com"]\n\n# Bước 1: Ép thành Set để xóa trùng\nset_email_sach = set(list_email_rac)\n\n# Bước 2: Ép ngược lại thành List để dùng\nlist_email_sach = list(set_email_sach) \nprint(list_email_sach) # [\'a@gmail.com\', \'b@gmail.com\']\n```'
    );

    -- BÀI 20
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 20: Từ điển (Dictionary) - Bản đồ Key-Value vạn năng', 
        'reading', 
        3, 
        25,
        E'# Dictionary (Dict) - Cấu trúc dữ liệu của các vị thần\n\nNếu List bắt bạn phải nhớ Index bằng Số (0, 1, 2) cực kỳ đau đầu, thì Dict cho phép bạn đánh Index bằng **CHỮ (Key)**.\n\nDictionary đại diện cho cấu trúc thông tin đời thực (JSON) mà bạn sẽ gặp ở mọi Web API (Tiki, Shopee, Facebook đều dùng cấu trúc này để lưu data).\n\n## 1. Khai báo Dict\n\nDict dùng cặp ngoặc nhọn `{}` nhưng có chứa **dấu hai chấm `:`** để phân tách Chìa khóa (Key) và Giá trị (Value).\n\n```python\nthong_tin_xe = {\n    "hang": "Toyota",\n    "dong_xe": "Camry",\n    "nam_san_xuat": 2024,\n    "mau_sac": ["Đen", "Trắng"] # Value có thể là một List!\n}\n```\n\n## 2. Tương tác với Dict\n\nBạn không gọi `thong_tin_xe[0]` nữa. Bạn gọi thẳng tên Key:\n\n```python\n# 1. Đọc dữ liệu\nprint(thong_tin_xe["hang"]) # In ra: Toyota\n\n# Tuyệt kỹ đọc dữ liệu chống lỗi Crash app\n# Nếu gọi Key không tồn tại như thong_tin_xe["gia_ban"], app sẽ văng lỗi KeyError.\n# Cách Pro là dùng hàm .get()\nprint(thong_tin_xe.get("gia_ban", "Chưa có giá")) # Sẽ in ra "Chưa có giá" thay vì báo lỗi đỏ lòm.\n\n# 2. Sửa dữ liệu / Thêm dữ liệu\nthong_tin_xe["nam_san_xuat"] = 2025  # Vì Key này đã có, nó sẽ SỬA\nthong_tin_xe["nhien_lieu"] = "Xăng"  # Vì Key này chưa có, nó sẽ THÊM MỚI\n\n# 3. Xóa dữ liệu\ndel thong_tin_xe["mau_sac"]\n```\n\n## 3. Lặp qua Dictionary bằng Vòng lặp `for`\n\nĐể lặp qua Dict, ta có 3 cách.\n\n```python\nhoc_sinh = {"Toán": 9, "Văn": 7, "Anh": 8}\n\n# Lặp qua các Key (Tên môn học)\nfor mon in hoc_sinh.keys():\n    print(mon)\n\n# Lặp qua các Value (Điểm số)\nfor diem in hoc_sinh.values():\n    print(diem)\n\n# Lặp qua CẢ HAI (Cực kỳ hay dùng)\nfor mon, diem in hoc_sinh.items():\n    print(f"Môn {mon} được {diem} điểm.")\n```'
    );

    -- BÀI 21
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 21: [Project thực hành] Quản lý Danh bạ điện thoại chuyên nghiệp', 
        'code_exercise', 
        4, 
        40,
        E'# Đồ án ứng dụng List và Dictionary\n\nHãy đóng vai một Software Engineer tại Apple và viết phần lõi lưu trữ cho ứng dụng Danh bạ (Contacts).\n\n## Đề bài:\nKhởi tạo một Dict trống: `danh_ba = {}`. Key sẽ là Tên người, Value sẽ là Số điện thoại.\n\nDùng vòng lặp `while True` tạo một Menu hiển thị liên tục cho người dùng chọn:\n```text\n===== ỨNG DỤNG DANH BẠ =====\n1. Hiển thị toàn bộ danh bạ\n2. Thêm số liên lạc mới\n3. Cập nhật số liên lạc\n4. Xóa số liên lạc\n5. Tìm kiếm theo tên\n0. Thoát ứng dụng\n============================\nLựa chọn của bạn: \n```\n\n## Chi tiết các chức năng:\n- **Chức năng 1:** Dùng `for k,v in danh_ba.items()` để in ra dạng `"Tên: ... | Số: ..."`. Nếu `danh_ba` đang trống (độ dài = 0) thì in ra "Danh bạ đang trống".\n- **Chức năng 2:** Hỏi tên, hỏi số. Nếu tên **đã có** trong dict (dùng chữ `in`), báo lỗi "Tên đã tồn tại". Nếu chưa, gán `danh_ba[ten] = so`.\n- **Chức năng 3:** Hỏi tên cần sửa. Nếu không có tên đó, báo "Không tìm thấy". Nếu có, hỏi số điện thoại mới và gán lại.\n- **Chức năng 4:** Hỏi tên cần xóa. Dùng `del` để xóa. Báo thành công.\n- **Chức năng 5:** Hỏi tên cần tìm. In ra số điện thoại.\n\n> 🧠 **Bài học kinh nghiệm:** Nếu bạn dùng List để chứa danh bạ, bạn sẽ phải dùng vòng lặp for duyệt từ trên xuống dưới List để tìm người tên "A". Việc này siêu chậm nếu List có 1 triệu người. Bằng việc dùng Dictionary với Key là tên người, thời gian tìm kiếm "A" là Bằng 0 (Tức thì). Đó chính là sức mạnh của Cấu trúc dữ liệu!'
    );

    -- ============================================
    -- 8. TẠO CHƯƠNG 5: HÀM (FUNCTIONS) VÀ TỔ CHỨC CODE
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 5: Hàm (Functions) & Tư duy tổ chức Code chuẩn kỹ sư', 
        'Khái niệm cốt lõi giúp biến hàng ngàn dòng code rối rắm (spaghetti code) thành các khối module gọn gàng, có thể tái sử dụng.',
        5
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI 22
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 22: Triết lý "Don''t Repeat Yourself" (DRY) và Định nghĩa Hàm', 
        'reading', 
        1, 
        20,
        E'# Nỗi sợ hãi Spaghetti Code\n\n"Spaghetti Code" là thuật ngữ mỉa mai những lập trình viên viết từ dòng 1 đến dòng 1000 liên tục không ngắt nghỉ, khiến luồng dữ liệu rối như một đĩa mì Ý. Chạm vào 1 sợi sẽ làm rối toàn bộ đĩa mì.\n\nGiải pháp lớn nhất là Nguyên tắc **DRY (Đừng lặp lại chính mình)**. Khi có một đoạn code dài 10 dòng bị lặp lại ở 3 nơi khác nhau, hãy gói 10 dòng đó vào một **Hàm (Function)**.\n\n## 1. Cách xây dựng một Hàm (`def`)\n\nTừ khóa `def` (Define) dùng để khai báo hàm.\n\n```python\n# Xây nhà máy đóng gói chức năng in hóa đơn\ndef in_hoa_don():\n    print("===================")\n    print("   HÓA ĐƠN MUA HÀNG  ")\n    print("===================")\n    print("Xin cảm ơn quý khách.")\n```\n\nLưu ý: Mới chỉ định nghĩa thì code KHÔNG CHẠY. Giống như bạn mới viết bản thiết kế tòa nhà chứ chưa cho thuê.\n\n## 2. Kích hoạt Hàm (Gọi hàm - Calling Function)\n\nBạn chỉ cần gọi tên hàm và bắt buộc phải có cặp ngoặc tròn `()` ở cuối.\n\n```python\nin_hoa_don()\n\n# Một tháng sau, cần in lại? Chỉ tốn 1 dòng code!\nin_hoa_don()\n```\n\n## 3. Lợi ích khổng lồ\nGiả sử giám đốc yêu cầu đổi chữ "HÓA ĐƠN" thành tiếng Anh "INVOICE". Nếu không dùng hàm, bạn phải mở 100 trang code ra để sửa 100 chữ thủ công. Khi dùng hàm, bạn chỉ cần sửa DUY NHẤT một dòng trong `def in_hoa_don()`, 100 nơi kia sẽ tự động cập nhật ngay lập tức!'
    );

    -- BÀI 23
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 23: Truyền nguyên liệu (Parameters) và Xuất thành phẩm (Return)', 
        'reading', 
        2, 
        25,
        E'# Biến Hàm thành cỗ máy đa năng\n\nHàm `in_hoa_don()` ở trên chỉ in được đúng một kiểu hóa đơn. Cỗ máy này bị "cứng nhắc". Ta cần truyền nguyên liệu linh hoạt vào cho nó xử lý.\n\n## 1. Khai báo Tham số (Parameters)\n\nTham số là các "lỗ hổng" chờ đợi được nhét dữ liệu vào.\n\n```python\ndef chao_khach_vip(ten_khach, so_tien_da_nap):\n    print(f"Kính chào VIP {ten_khach}!")\n    if so_tien_da_nap > 1000:\n        print("Tặng bạn Voucher 50%.")\n        \n# Khi gọi hàm, phải nhét ĐÚNG 2 nguyên liệu vào (gọi là Arguments)\nchao_khach_vip("Chủ tịch HĐQT", 5000)\nchao_khach_vip("Tâm", 100)\n```\n\n## 2. Nhận thành phẩm trả về với lệnh `return`\n\nHàm `print()` bên trong `def` chỉ có ý nghĩa Hiển thị ra màn hình cho con người đọc, máy tính không thể lấy được con số đó mang đi làm việc khác.\n\nĐể Hàm thực sự "nhả ra" một dữ liệu có thể đem tính toán, BẮT BUỘC dùng `return`.\n\n```python\ndef tinh_thue_vat(gia_tien):\n    thue = gia_tien * 0.1\n    return thue  # Quẳng biến thue này ra ngoài!\n    print("Dòng này vô tác dụng") # Hàm CHẾT NGAY LẬP TỨC tại dòng return.\n\n# Hứng lấy thành phẩm do hàm ném ra\ntien_thue_cua_bim_bim = tinh_thue_vat(10000)\ntong_phai_tra = 10000 + tien_thue_cua_bim_bim\nprint("Tổng trả:", tong_phai_tra)\n```\n\n> 🌟 **Lời khuyên vàng ngọc:** Một Lập trình viên giỏi rất hiếm khi viết `print()` bên trong hàm xử lý logic. Họ luôn `return` kết quả, để phía ngoài tự quyết định việc in ấn.'
    );

    -- BÀI 24
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Bài 24: [Dự án cuối khóa] Kiến trúc Hệ thống Quản lý Sinh Viên đa module', 
        'code_exercise', 
        3, 
        60,
        E'# Chúc mừng bạn đến với Ải Cuối Cùng!\n\nHãy xây dựng phần mềm quản lý Sinh viên. Ứng dụng này sẽ kết hợp Dictionary, List, Vòng lặp, If-Else và HÀM.\n\n## Yêu cầu Kiến trúc File:\n\nKhởi tạo List toàn cục (Global Variable): `database_sv = []`\nDanh sách này sẽ chứa nhiều cái Dict. Mỗi Dict là 1 Sinh viên (Ví dụ: `{"id": "SV01", "ten": "Tâm", "diem": 9}`).\n\n## Xây dựng 4 Hàm cốt lõi (Core Functions):\n\n1. **`def them_sv(id, ten, diem):`**\n   Tạo 1 biến `sv_moi` là dictionary. Sau đó `database_sv.append(sv_moi)`. Trả về `True` nếu thành công.\n2. **`def tim_sv(id):`**\n   Dùng vòng lặp `for sv in database_sv:`. Nếu `sv["id"] == id` thì `return sv`. Nếu hết vòng lặp không thấy thì `return None`.\n3. **`def xoa_sv(id):`**\n   Gọi hàm `tim_sv(id)` ở trên để lấy ra sinh viên đó. Nếu lấy được, dùng `database_sv.remove(sinh_vien_do)`.\n4. **`def hien_thi_toan_bo():`**\n   In ra màn hình danh sách cực đẹp mắt bằng F-string.\n\n## Xây dựng Giao diện Điều khiển (UI Terminal):\nViết một vòng lặp `while True` hiển thị Menu từ 1 đến 5 để gọi các Hàm trên. Người dùng nhập phím nào thì dùng `if/elif` để rẽ nhánh tương ứng.\n\n---\n\n## 🎓 Lời kết Khóa Học Căn Bản\n\nHoàn thành 24 bài học này và tự tay code được bài Quản lý Sinh viên nghĩa là bộ não của bạn đã chính thức hình thành **"Nếp nhăn Lập Trình"**.\n\nTừ đây, bạn hoàn toàn có đủ nền tảng vững chắc để học tiếp lên **Lập trình Hướng đối tượng (OOP)**, và tiến thẳng vào thế giới Web Backend với **Django / FastAPI** hoặc Trí tuệ nhân tạo **Data Science**.\n\nCon đường trở thành Kỹ Sư Phần Mềm (Software Engineer) chuyên nghiệp đã rộng mở. Chúc bạn chân cứng đá mềm và code không còn bị Bug!'
    );

END $$;
