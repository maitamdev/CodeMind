-- ============================================
-- CodeMind — Seed Data cho Khóa học Git & GitHub
-- ============================================

DO $$
DECLARE
    v_category_id UUID;
    v_course_id UUID;
    v_chapter_id UUID;
BEGIN
    -- 1. TẠO DANH MỤC (NẾU CHƯA CÓ)
    INSERT INTO categories (name, slug, description, icon)
    VALUES (
        'Công cụ', 
        'cong-cu', 
        'Các công cụ hỗ trợ lập trình viên', 
        'Wrench'
    )
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_category_id;

    -- 2. TẠO KHÓA HỌC
    INSERT INTO courses (
        title, slug, description, short_description, thumbnail_url, 
        level, is_free, is_published, estimated_duration, 
        category_id, tags
    )
    VALUES (
        'Git & GitHub từ Cơ bản đến Nâng cao', 
        'git-github-tu-co-ban-den-nang-cao', 
        'Khóa học Git & GitHub toàn diện dành cho lập trình viên từ con số 0.',
        'Nắm vững công cụ quản lý phiên bản quan trọng nhất và quy trình làm việc nhóm chuyên nghiệp.',
        '/images/courses/git-course-thumbnail.png',
        'BEGINNER', 
        true, 
        true, 
        1200, 
        v_category_id,
        ARRAY['git', 'github', 'devops', 'công cụ']
    )
    ON CONFLICT (slug) DO UPDATE SET 
        title = EXCLUDED.title,
        thumbnail_url = EXCLUDED.thumbnail_url,
        is_published = true
    RETURNING id INTO v_course_id;

    -- Xóa các chương cũ của khóa này (nếu chạy lại script)
    DELETE FROM chapters WHERE course_id = v_course_id;


    -- ============================================
    -- TẠO CHƯƠNG 0
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 0: GIỚI THIỆU KHÓA HỌC', 
        '',
        0
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: GIỚI THIỆU KHÓA HỌC
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: GIỚI THIỆU KHÓA HỌC', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 0.1. Mục tiêu khóa học\n\n\nSau khi hoàn thành khóa học này, bạn có thể:\n\n1. Hiểu Git là gì, GitHub là gì và vì sao lập trình viên cần dùng.\n2. Sử dụng thành thạo Git trong dự án cá nhân.\n3. Làm việc nhóm bằng GitHub: clone, push, pull, pull request, review code.\n4. Quản lý branch, merge, rebase, conflict.\n5. Khôi phục lỗi bằng reset, revert, checkout, restore.\n6. Sử dụng tag, release, issue, project board.\n7. Tạo workflow CI/CD cơ bản bằng GitHub Actions.\n8. Áp dụng quy trình Git chuyên nghiệp như Git Flow, trunk-based development.\n9. Xử lý các lỗi Git thường gặp trong thực tế.\n10. Có đủ nền tảng để tham gia dự án mã nguồn mở hoặc làm việc trong công ty.\n\n\n## 0.2. Đối tượng phù hợp\n\n\nKhóa học phù hợp với:\n\n- Người mới học lập trình.\n- Sinh viên công nghệ thông tin.\n- Lập trình viên frontend, backend, mobile, DevOps.\n- Tester, BA, PM cần hiểu quy trình làm việc với source code.\n- Người muốn đóng góp open source.\n- Người muốn quản lý tài liệu, cấu hình, nội dung bằng Git.\n\n\n## 0.3. Yêu cầu đầu vào\n\n\nBạn không cần biết Git trước. Tuy nhiên, bạn nên có:\n\n- Kiến thức cơ bản về máy tính.\n- Biết mở terminal/cmd.\n- Biết tạo file, thư mục.\n- Nếu biết HTML/CSS/JavaScript hoặc Python thì thực hành sẽ dễ hơn, nhưng không bắt buộc.\n\n\n## 0.4. Cách học hiệu quả\n\n\nKhông nên chỉ đọc. Hãy thực hành từng lệnh.\n\nGợi ý cách học:\n\n- Đọc lý thuyết ngắn.\n- Gõ lại lệnh.\n- Quan sát kết quả.\n- Cố tình tạo lỗi nhỏ.\n- Tự sửa lỗi.\n- Ghi chú lại quy trình.\n- Làm bài tập cuối mỗi phần.\n\n\n## 0.5. Quy ước trong giáo trình\n\n\nCác lệnh bắt đầu bằng ký hiệu $ là lệnh chạy trong terminal.\n\nVí dụ:\n\n$ git status\n\nBạn không cần gõ dấu $.\n\nKý hiệu:\n\n- Working Directory: thư mục làm việc hiện tại.\n- Staging Area: khu vực chờ commit.\n- Repository: kho lưu trữ Git.\n- Remote: kho lưu trữ trên máy chủ như GitHub.\n- HEAD: vị trí commit hiện tại bạn đang đứng.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 1
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 1: TƯ DUY NỀN TẢNG VỀ GIT, GITHUB VÀ VERSION CONTROL', 
        '',
        1
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: TƯ DUY NỀN TẢNG VỀ GIT, GITHUB VÀ VERSION CONTROL
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: TƯ DUY NỀN TẢNG VỀ GIT, GITHUB VÀ VERSION CONTROL', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 1.1. Version control là gì?\n\n\nVersion control, hay quản lý phiên bản, là cách theo dõi sự thay đổi của file theo thời gian.\n\nVí dụ bạn viết một tài liệu:\n\n- bao_cao_v1.docx\n- bao_cao_v2.docx\n- bao_cao_final.docx\n- bao_cao_final_sua_lan_cuoi.docx\n- bao_cao_final_that_su_lan_cuoi.docx\n\nCách đặt tên này rất dễ rối. Git giải quyết vấn đề bằng cách lưu lịch sử thay đổi một cách có hệ thống.\n\nGit giúp bạn biết:\n\n- Ai thay đổi?\n- Thay đổi lúc nào?\n- Thay đổi dòng nào?\n- Vì sao thay đổi?\n- Có thể quay lại phiên bản cũ không?\n- Có thể làm nhiều tính năng song song không?\n\n\n## 1.2. Git là gì?\n\n\nGit là hệ thống quản lý phiên bản phân tán.\n\nĐiểm quan trọng:\n\n- Git chạy được trên máy cá nhân.\n- Mỗi người có một bản sao đầy đủ lịch sử dự án.\n- Không cần internet vẫn commit được.\n- Có thể đồng bộ với remote như GitHub khi cần.\n- Rất nhanh và mạnh.\n\n\n## 1.3. GitHub là gì?\n\n\nGitHub là nền tảng lưu trữ Git repository trên internet.\n\nGitHub cung cấp:\n\n- Lưu code online.\n- Làm việc nhóm.\n- Pull request.\n- Code review.\n- Issue tracking.\n- Project board.\n- Wiki.\n- Release.\n- GitHub Actions.\n- Quản lý quyền truy cập.\n- Hồ sơ cá nhân lập trình viên.\n\nGit là công cụ. GitHub là dịch vụ/platform dùng Git.\n\n\n## 1.4. So sánh Git và GitHub\n\n\nGit:\n- Chạy trên máy của bạn.\n- Quản lý lịch sử code.\n- Dùng bằng terminal hoặc GUI.\n- Không bắt buộc cần tài khoản.\n\nGitHub:\n- Chạy trên web.\n- Lưu repository online.\n- Hỗ trợ cộng tác.\n- Cần tài khoản.\n- Có nhiều tính năng ngoài Git.\n\n\n## 1.5. Vì sao nên học Git sớm?\n\n\nVì Git là kỹ năng bắt buộc trong hầu hết công việc lập trình.\n\nLợi ích:\n\n- Không sợ mất code.\n- Dễ thử nghiệm ý tưởng mới.\n- Dễ làm việc nhóm.\n- Có portfolio trên GitHub.\n- Tăng tính chuyên nghiệp.\n- Hiểu quy trình phát triển phần mềm thực tế.\n\n\n## 1.6. Mô hình hoạt động cơ bản của Git\n\n\nGit thường có 3 khu vực chính:\n\n1. Working Directory\n   Nơi bạn sửa file.\n\n2. Staging Area\n   Nơi bạn chọn các thay đổi chuẩn bị commit.\n\n3. Local Repository\n   Nơi Git lưu commit vào lịch sử.\n\nLuồng cơ bản:\n\nSửa file -> git add -> git commit\n\nSau đó nếu làm việc với GitHub:\n\ngit push -> đưa commit lên GitHub\ngit pull -> lấy thay đổi mới từ GitHub về máy\n\n\n## 1.7. Commit là gì?\n\n\nCommit là một điểm lưu lịch sử.\n\nMỗi commit giống như một snapshot của dự án tại thời điểm đó.\n\nMột commit thường gồm:\n\n- Mã hash duy nhất.\n- Tác giả.\n- Thời gian.\n- Nội dung thay đổi.\n- Commit message.\n- Con trỏ đến commit cha.\n\nVí dụ commit message:\n\nAdd login form\nFix navbar layout\nUpdate README instructions\n\n\n## 1.8. Branch là gì?\n\n\nBranch là nhánh phát triển độc lập.\n\nVí dụ:\n\n- main: code ổn định.\n- feature/login: phát triển chức năng đăng nhập.\n- bugfix/navbar: sửa lỗi thanh điều hướng.\n- release/v1.0.0: chuẩn bị phát hành.\n\nBranch giúp bạn làm việc mà không ảnh hưởng trực tiếp đến code chính.\n\n\n## 1.9. Merge là gì?\n\n\nMerge là gộp thay đổi từ branch này vào branch khác.\n\nVí dụ:\n\nBạn làm xong chức năng login ở branch feature/login.\nBạn merge vào main để đưa vào code chính.\n\n\n## 1.10. Conflict là gì?\n\n\nConflict xảy ra khi Git không tự quyết định được cách gộp thay đổi.\n\nVí dụ:\n\nBạn sửa dòng 10 trong file app.js.\nĐồng đội cũng sửa dòng 10 trong file app.js.\nKhi merge, Git hỏi bạn nên giữ bản nào.\n\nConflict không đáng sợ. Nó chỉ cần con người quyết định.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 2
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 2: CÀI ĐẶT VÀ CẤU HÌNH MÔI TRƯỜNG', 
        '',
        2
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: CÀI ĐẶT VÀ CẤU HÌNH MÔI TRƯỜNG
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: CÀI ĐẶT VÀ CẤU HÌNH MÔI TRƯỜNG', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 2.1. Cài Git\n\n\nTrên Windows:\n\n1. Truy cập trang chính thức của Git.\n2. Tải Git for Windows.\n3. Cài đặt theo mặc định.\n4. Mở Git Bash hoặc PowerShell.\n5. Kiểm tra:\n\n$ git --version\n\nTrên macOS:\n\nCách 1: Dùng Xcode Command Line Tools\n\n$ git --version\n\nNếu chưa có, macOS sẽ hỏi cài đặt.\n\nCách 2: Dùng Homebrew\n\n$ brew install git\n\nTrên Ubuntu/Linux:\n\n$ sudo apt update\n$ sudo apt install git\n$ git --version\n\n\n## 2.2. Cấu hình tên và email\n\n\nGit cần biết bạn là ai khi tạo commit.\n\n$ git config --global user.name "Ten Cua Ban"\n$ git config --global user.email "email@example.com"\n\nKiểm tra:\n\n$ git config --global --list\n\n\n## 2.3. Cấu hình editor mặc định\n\n\nVí dụ dùng VS Code:\n\n$ git config --global core.editor "code --wait"\n\n\n## 2.4. Cấu hình tên branch mặc định\n\n\nHiện nay thường dùng main:\n\n$ git config --global init.defaultBranch main\n\n\n## 2.5. Cấu hình xuống dòng\n\n\nTrên Windows:\n\n$ git config --global core.autocrlf true\n\nTrên macOS/Linux:\n\n$ git config --global core.autocrlf input\n\n\n## 2.6. Cài GitHub CLI tùy chọn\n\n\nGitHub CLI là công cụ thao tác GitHub bằng terminal.\n\nKiểm tra:\n\n$ gh --version\n\nĐăng nhập:\n\n$ gh auth login\n\nCác lệnh hay dùng:\n\n$ gh repo create\n$ gh repo clone owner/repo\n$ gh pr create\n$ gh pr list\n$ gh issue list\n\n\n## 2.7. Cài VS Code và extension\n\n\nNên cài:\n\n- Visual Studio Code.\n- GitLens.\n- Git Graph.\n- GitHub Pull Requests and Issues.\n\n\n## 2.8. Tạo tài khoản GitHub\n\n\nBạn cần:\n\n- Username chuyên nghiệp.\n- Email chính xác.\n- Ảnh đại diện rõ ràng.\n- Bật xác thực hai bước nếu có thể.\n\n\n## 2.9. Kiểm tra môi trường hoàn chỉnh\n\n\nChạy:\n\n$ git --version\n$ git config --global user.name\n$ git config --global user.email\n\nNếu có kết quả đầy đủ, bạn đã sẵn sàng.\n\nBài tập phần 2:\n\n1. Cài Git.\n2. Cấu hình username/email.\n3. Tạo tài khoản GitHub.\n4. Tạo thư mục git-course-practice trên máy.\n5. Mở terminal tại thư mục đó.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 3
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 3: LÀM VIỆC VỚI REPOSITORY CỤC BỘ', 
        '',
        3
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: LÀM VIỆC VỚI REPOSITORY CỤC BỘ
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: LÀM VIỆC VỚI REPOSITORY CỤC BỘ', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 3.1. Repository là gì?\n\n\nRepository, gọi tắt là repo, là thư mục được Git theo dõi.\n\nMột repo gồm:\n\n- File dự án.\n- Thư mục .git chứa dữ liệu Git.\n- Lịch sử commit.\n- Cấu hình.\n- Branch, tag, remote.\n\n\n## 3.2. Tạo repository mới\n\n\nTạo thư mục:\n\n$ mkdir my-first-repo\n$ cd my-first-repo\n\nKhởi tạo Git:\n\n$ git init\n\nKết quả:\n\nInitialized empty Git repository...\n\nTừ lúc này, thư mục my-first-repo là Git repository.\n\n\n## 3.3. Kiểm tra trạng thái\n\n\n$ git status\n\nBạn sẽ thấy branch hiện tại và trạng thái file.\n\n\n## 3.4. Tạo file đầu tiên\n\n\n$ echo "# My First Repo" > README.md\n\nKiểm tra:\n\n$ git status\n\nGit sẽ báo README.md là untracked file.\n\n\n## 3.5. Untracked file là gì?\n\n\nUntracked file là file tồn tại trong thư mục nhưng Git chưa theo dõi.\n\nMuốn Git theo dõi, dùng:\n\n$ git add README.md\n\n\n## 3.6. Staging Area\n\n\nSau khi git add, file được đưa vào staging area.\n\nStaging area cho phép bạn chọn chính xác thay đổi nào sẽ nằm trong commit.\n\n\n## 3.7. Commit đầu tiên\n\n\n$ git commit -m "Initial commit"\n\nCommit message nên mô tả ngắn gọn thay đổi.\n\n\n## 3.8. Xem lịch sử commit\n\n\n$ git log\n\nXem gọn hơn:\n\n$ git log --oneline\n\n\n## 3.9. Sửa file và commit tiếp\n\n\nMở README.md, thêm nội dung:\n\nDay 1: Learning Git basics.\n\nSau đó:\n\n$ git status\n$ git add README.md\n$ git commit -m "Update README with learning note"\n\n\n## 3.10. Git theo dõi thay đổi như thế nào?\n\n\nGit không lưu mỗi file đầy đủ theo kiểu đơn giản. Git lưu object trong database nội bộ.\n\nCác loại object chính:\n\n- Blob: nội dung file.\n- Tree: cấu trúc thư mục.\n- Commit: metadata và liên kết snapshot.\n- Tag: nhãn cho commit.\n\nBạn không cần biết sâu ở giai đoạn đầu, nhưng hiểu rằng Git lưu lịch sử rất tối ưu.\n\n\n## 3.11. Xem sự khác biệt\n\n\nSửa README.md rồi chạy:\n\n$ git diff\n\nLệnh này cho biết thay đổi chưa staged.\n\nSau khi add:\n\n$ git add README.md\n$ git diff --staged\n\n\n## 3.12. Bỏ theo dõi file khỏi staging\n\n\nNếu add nhầm:\n\n$ git restore --staged README.md\n\n\n## 3.13. Khôi phục thay đổi chưa commit\n\n\nNếu bạn sửa file nhưng muốn bỏ thay đổi:\n\n$ git restore README.md\n\nCẩn thận: lệnh này có thể làm mất thay đổi chưa commit.\n\n\n## 3.14. Xóa file bằng Git\n\n\n$ rm old-file.txt\n$ git status\n$ git add old-file.txt\n$ git commit -m "Remove old file"\n\nHoặc:\n\n$ git rm old-file.txt\n$ git commit -m "Remove old file"\n\n\n## 3.15. Đổi tên file\n\n\n$ git mv oldname.txt newname.txt\n$ git commit -m "Rename file"\n\nBài tập phần 3:\n\n1. Tạo repo local tên git-basic.\n2. Tạo README.md.\n3. Commit lần đầu.\n4. Tạo file notes.txt.\n5. Commit notes.txt.\n6. Sửa README.md.\n7. Dùng git diff để xem thay đổi.\n8. Commit thay đổi.\n9. Xem lịch sử bằng git log --oneline.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 4
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 4: SNAPSHOT, COMMIT VÀ LỊCH SỬ THAY ĐỔI', 
        '',
        4
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: SNAPSHOT, COMMIT VÀ LỊCH SỬ THAY ĐỔI
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: SNAPSHOT, COMMIT VÀ LỊCH SỬ THAY ĐỔI', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 4.1. Commit tốt là gì?\n\n\nCommit tốt nên:\n\n- Nhỏ.\n- Có mục đích rõ.\n- Không trộn nhiều việc không liên quan.\n- Có message dễ hiểu.\n- Có thể revert nếu cần.\n\nCommit không tốt:\n\n- "fix"\n- "update"\n- "abc"\n- "done"\n- Một commit chứa cả sửa bug, thêm feature, format code, xóa file.\n\n\n## 4.2. Cấu trúc commit message chuyên nghiệp\n\n\nDạng đơn giản:\n\n<verb> <object>\n\nVí dụ:\n\nAdd user login page\nFix password validation\nUpdate API documentation\nRemove unused CSS\n\nDạng Conventional Commits:\n\n<type>(scope): <description>\n\nVí dụ:\n\nfeat(auth): add login form\nfix(api): handle timeout error\ndocs(readme): update setup guide\nrefactor(user): simplify profile service\ntest(auth): add login validation tests\n\nCác type thường dùng:\n\n- feat: thêm tính năng.\n- fix: sửa lỗi.\n- docs: tài liệu.\n- style: format, dấu cách, không đổi logic.\n- refactor: tái cấu trúc code.\n- test: thêm/sửa test.\n- chore: việc phụ trợ.\n- perf: tối ưu hiệu năng.\n- ci: cấu hình CI/CD.\n- build: hệ thống build.\n\n\n## 4.3. Xem log đẹp hơn\n\n\n$ git log --oneline --graph --decorate --all\n\nÝ nghĩa:\n\n- --oneline: mỗi commit một dòng.\n- --graph: vẽ nhánh.\n- --decorate: hiện branch/tag.\n- --all: hiện tất cả branch.\n\n\n## 4.4. Xem chi tiết một commit\n\n\n$ git show <commit-hash>\n\nVí dụ:\n\n$ git show a1b2c3d\n\n\n## 4.5. Xem ai sửa dòng nào\n\n\n$ git blame README.md\n\nLệnh này hữu ích khi cần biết dòng code do ai thay đổi và ở commit nào.\n\n\n## 4.6. Xem file thay đổi trong commit\n\n\n$ git show --name-only <commit-hash>\n\n\n## 4.7. Xem thống kê thay đổi\n\n\n$ git show --stat <commit-hash>\n\n\n## 4.8. Commit tất cả file đã tracked\n\n\nNếu file đã từng được Git theo dõi:\n\n$ git commit -am "Update tracked files"\n\nLưu ý: -a không add file mới untracked.\n\n\n## 4.9. Sửa commit gần nhất\n\n\nNếu vừa commit xong nhưng quên file:\n\n$ git add missing-file.txt\n$ git commit --amend\n\nNếu chỉ muốn sửa message:\n\n$ git commit --amend -m "Better commit message"\n\nCẩn thận: không nên amend commit đã push lên branch chung nếu không hiểu hậu quả.\n\n\n## 4.10. File .gitignore\n\n\n.gitignore dùng để bỏ qua file không cần commit.\n\nVí dụ .gitignore cho Node.js:\n\nnode_modules/\n.env\ndist/\ncoverage/\nnpm-debug.log\n\nVí dụ cho Python:\n\n__pycache__/\n*.pyc\n.venv/\n.env\ndist/\nbuild/\n\nVí dụ chung:\n\n.DS_Store\nThumbs.db\n*.log\n\n\n## 4.11. Tại sao không commit file nhạy cảm?\n\n\nKhông nên commit:\n\n- Password.\n- API key.\n- Access token.\n- Private key.\n- File .env chứa secret.\n- Database production.\n\nNếu lỡ commit secret, xóa trong commit mới chưa đủ. Secret vẫn nằm trong lịch sử. Cần rotate secret và làm sạch history.\n\n\n## 4.12. Xóa file đã tracked nhưng muốn giữ local\n\n\nVí dụ đã commit .env, giờ muốn Git ngừng theo dõi:\n\n$ git rm --cached .env\n$ echo ".env" >> .gitignore\n$ git add .gitignore\n$ git commit -m "Stop tracking env file"\n\nBài tập phần 4:\n\n1. Tạo 5 commit nhỏ.\n2. Xem log dạng graph.\n3. Dùng git show xem commit thứ 2.\n4. Tạo .gitignore.\n5. Thêm file .env rồi đảm bảo Git không track.\n6. Thử amend commit gần nhất.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 5
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 5: BRANCH, MERGE VÀ QUY TRÌNH PHÁT TRIỂN SONG SONG', 
        '',
        5
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: BRANCH, MERGE VÀ QUY TRÌNH PHÁT TRIỂN SONG SONG
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: BRANCH, MERGE VÀ QUY TRÌNH PHÁT TRIỂN SONG SONG', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 5.1. Branch giải quyết vấn đề gì?\n\n\nKhi bạn muốn thêm tính năng mới, bạn không nên sửa trực tiếp main.\n\nLý do:\n\n- Code main nên luôn ổn định.\n- Feature có thể làm dở nhiều ngày.\n- Có thể thử nghiệm mà không phá code chính.\n- Dễ review và rollback.\n\n\n## 5.2. Xem branch\n\n\n$ git branch\n\n\n## 5.3. Tạo branch mới\n\n\n$ git branch feature/login\n\n\n## 5.4. Chuyển branch\n\n\n$ git switch feature/login\n\nHoặc dùng lệnh cũ:\n\n$ git checkout feature/login\n\n\n## 5.5. Tạo và chuyển branch cùng lúc\n\n\n$ git switch -c feature/login\n\nHoặc:\n\n$ git checkout -b feature/login\n\n\n## 5.6. Commit trên branch\n\n\nVí dụ:\n\n$ echo "Login page" > login.html\n$ git add login.html\n$ git commit -m "Add login page"\n\nCommit này nằm trên branch feature/login.\n\n\n## 5.7. Quay lại main\n\n\n$ git switch main\n\nBạn sẽ thấy login.html có thể biến mất vì file đó thuộc branch feature/login.\n\n\n## 5.8. Merge branch\n\n\nSau khi làm xong:\n\n$ git switch main\n$ git merge feature/login\n\n\n## 5.9. Fast-forward merge\n\n\nNếu main chưa có commit mới kể từ khi tách branch, Git có thể fast-forward.\n\nNghĩa là con trỏ main được đẩy thẳng tới commit mới.\n\n\n## 5.10. Three-way merge\n\n\nNếu main và feature đều có commit mới, Git tạo merge commit.\n\n\n## 5.11. Xóa branch sau khi merge\n\n\n$ git branch -d feature/login\n\nNếu branch chưa merge mà vẫn muốn xóa:\n\n$ git branch -D feature/login\n\n\n## 5.12. Đặt tên branch chuyên nghiệp\n\n\nQuy ước phổ biến:\n\nfeature/login-page\nfeature/payment-integration\nbugfix/navbar-overlap\nhotfix/security-patch\nrelease/v1.2.0\nchore/update-dependencies\ndocs/api-guide\n\n\n## 5.13. Branch main/master\n\n\nTrước đây nhiều repo dùng master.\nHiện nay nhiều repo dùng main.\n\n\n## 5.14. Branch develop\n\n\nMột số quy trình dùng:\n\n- main: production.\n- develop: tích hợp tính năng.\n- feature/*: phát triển tính năng.\n- release/*: chuẩn bị phát hành.\n- hotfix/*: sửa lỗi khẩn cấp.\n\n\n## 5.15. Merge conflict cơ bản\n\n\nTạo ví dụ:\n\nTrên main, file hello.txt:\n\nHello from main\n\nTrên branch feature, sửa cùng dòng:\n\nHello from feature\n\nKhi merge, Git có thể báo conflict.\n\nFile sẽ có dạng:\n\n<<<<<<< HEAD\nHello from main\n=======\nHello from feature\n>>>>>>> feature/example\n\nBạn cần sửa thành nội dung mong muốn, ví dụ:\n\nHello from main and feature\n\nSau đó:\n\n$ git add hello.txt\n$ git commit\n\n\n## 5.16. Quy tắc xử lý conflict\n\n\n1. Đọc kỹ file conflict.\n2. Hiểu thay đổi của hai bên.\n3. Không xóa bừa.\n4. Chạy test sau khi sửa.\n5. Add file đã sửa.\n6. Commit merge.\n7. Báo đồng đội nếu cần.\n\nBài tập phần 5:\n\n1. Tạo branch feature/about-page.\n2. Tạo file about.html.\n3. Commit.\n4. Merge vào main.\n5. Xóa branch.\n6. Tạo conflict giả lập.\n7. Tự giải quyết conflict.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 6
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 6: REMOTE REPOSITORY VÀ GITHUB', 
        '',
        6
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: REMOTE REPOSITORY VÀ GITHUB
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: REMOTE REPOSITORY VÀ GITHUB', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 6.1. Remote repository là gì?\n\n\nRemote repository là repo nằm trên máy chủ khác, thường là GitHub.\n\nNó giúp:\n\n- Sao lưu code.\n- Chia sẻ code.\n- Làm việc nhóm.\n- Deploy.\n- Code review.\n\n\n## 6.2. Tạo repository trên GitHub\n\n\nCác bước:\n\n1. Đăng nhập GitHub.\n2. Chọn New repository.\n3. Đặt tên repo.\n4. Chọn public hoặc private.\n5. Không nên tick tạo README nếu bạn đã có repo local, để tránh conflict ban đầu.\n6. Nhấn Create repository.\n\n\n## 6.3. Kết nối local repo với GitHub\n\n\nGiả sử URL repo là:\n\nhttps://github.com/username/my-repo.git\n\nChạy:\n\n$ git remote add origin https://github.com/username/my-repo.git\n\nKiểm tra:\n\n$ git remote -v\n\n\n## 6.4. Push lần đầu\n\n\n$ git push -u origin main\n\n-u thiết lập upstream để lần sau chỉ cần:\n\n$ git push\n\n\n## 6.5. Clone repository\n\n\nNếu repo đã có trên GitHub:\n\n$ git clone https://github.com/username/my-repo.git\n\nSau đó:\n\n$ cd my-repo\n\n\n## 6.6. Push thay đổi\n\n\nQuy trình:\n\n$ git status\n$ git add .\n$ git commit -m "Update project"\n$ git push\n\n\n## 6.7. Pull thay đổi\n\n\nKhi người khác có thay đổi trên GitHub:\n\n$ git pull\n\ngit pull thực chất thường tương đương:\n\ngit fetch + git merge\n\n\n## 6.8. Fetch là gì?\n\n\n$ git fetch\n\nFetch tải dữ liệu mới từ remote về nhưng chưa gộp vào branch hiện tại.\n\nSau fetch, có thể xem:\n\n$ git log --oneline --all --graph\n\n\n## 6.9. Remote origin là gì?\n\n\norigin là tên mặc định của remote repo.\n\nBạn có thể đổi tên nhưng thường không cần.\n\n\n## 6.10. Xem remote branch\n\n\n$ git branch -r\n\nXem tất cả:\n\n$ git branch -a\n\n\n## 6.11. Tạo branch local theo remote branch\n\n\n$ git switch -c feature/login origin/feature/login\n\nHoặc:\n\n$ git switch feature/login\n\nnếu Git tự nhận biết được.\n\n\n## 6.12. Push branch mới lên GitHub\n\n\n$ git push -u origin feature/login\n\n\n## 6.13. Xóa branch remote\n\n\n$ git push origin --delete feature/login\n\n\n## 6.14. HTTPS và SSH\n\n\nCó hai cách kết nối GitHub phổ biến:\n\nHTTPS:\n\nhttps://github.com/username/repo.git\n\nSSH:\n\ngit@github.com:username/repo.git\n\nSSH tiện hơn khi làm việc lâu dài vì không phải nhập token nhiều lần.\n\n\n## 6.15. Fork là gì?\n\n\nFork là sao chép repo của người khác về tài khoản GitHub của bạn.\n\nDùng khi:\n\n- Đóng góp open source.\n- Không có quyền push trực tiếp vào repo gốc.\n- Muốn thử nghiệm riêng.\n\n\n## 6.16. Upstream là gì?\n\n\nKhi bạn fork repo, repo gốc thường gọi là upstream.\n\nThêm upstream:\n\n$ git remote add upstream https://github.com/original-owner/original-repo.git\n\nLấy thay đổi từ upstream:\n\n$ git fetch upstream\n$ git switch main\n$ git merge upstream/main\n\nBài tập phần 6:\n\n1. Tạo repo trên GitHub.\n2. Push repo local lên GitHub.\n3. Clone repo về thư mục khác.\n4. Sửa README ở thư mục clone.\n5. Commit và push.\n6. Quay lại thư mục cũ, pull thay đổi.\n7. Tạo branch mới và push branch đó lên GitHub.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 7
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 7: QUẢN LÝ XUNG ĐỘT, PULL, FETCH, REBASE', 
        '',
        7
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: QUẢN LÝ XUNG ĐỘT, PULL, FETCH, REBASE
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: QUẢN LÝ XUNG ĐỘT, PULL, FETCH, REBASE', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 7.1. Pull hoạt động như thế nào?\n\n\nLệnh:\n\n$ git pull\n\nthường gồm:\n\n$ git fetch\n$ git merge\n\nNó tải commit mới từ remote và gộp vào branch hiện tại.\n\n\n## 7.2. Vấn đề với pull\n\n\nNếu local và remote cùng có commit mới, pull có thể tạo merge commit.\n\nĐiều này không sai, nhưng lịch sử có thể rối.\n\n\n## 7.3. Pull với rebase\n\n\n$ git pull --rebase\n\nLệnh này tải commit remote, sau đó đặt commit local của bạn lên trên commit remote.\n\nLịch sử sẽ thẳng hơn.\n\n\n## 7.4. Rebase là gì?\n\n\nRebase là thay đổi nền của branch.\n\nVí dụ:\n\nBạn có branch feature tách từ main.\nTrong lúc bạn làm, main có thêm commit mới.\nBạn muốn feature như thể được tách từ main mới nhất.\n\nChạy:\n\n$ git switch feature\n$ git rebase main\n\n\n## 7.5. Merge vs Rebase\n\n\nMerge:\n\n- Giữ nguyên lịch sử thật.\n- Có thể tạo merge commit.\n- An toàn hơn cho branch đã chia sẻ.\n- Phù hợp khi muốn thấy điểm gộp.\n\nRebase:\n\n- Lịch sử tuyến tính, sạch.\n- Có thể viết lại commit hash.\n- Không nên rebase branch public/shared nếu người khác đang dựa vào nó.\n- Phù hợp dọn branch cá nhân trước khi merge.\n\n\n## 7.6. Nguyên tắc vàng của rebase\n\n\nKhông rebase commit đã public nếu người khác đang dùng branch đó.\n\nCó thể rebase:\n\n- Branch cá nhân.\n- Commit chưa push.\n- Branch feature bạn là người duy nhất làm.\n\nHạn chế rebase:\n\n- main.\n- develop dùng chung.\n- branch nhiều người cùng push.\n\n\n## 7.7. Rebase conflict\n\n\nKhi rebase gặp conflict:\n\n1. Mở file conflict.\n2. Sửa conflict.\n3. Add file:\n\n$ git add file.txt\n\n4. Tiếp tục rebase:\n\n$ git rebase --continue\n\nNếu muốn hủy:\n\n$ git rebase --abort\n\nNếu muốn bỏ commit hiện tại:\n\n$ git rebase --skip\n\n\n## 7.8. Squash commit bằng interactive rebase\n\n\nNếu có nhiều commit nhỏ:\n\n$ git rebase -i HEAD~3\n\nBạn sẽ thấy:\n\npick a1 Add login html\npick b2 Fix typo\npick c3 Adjust button style\n\nĐổi thành:\n\npick a1 Add login html\nsquash b2 Fix typo\nsquash c3 Adjust button style\n\nSau đó sửa commit message.\n\n\n## 7.9. Khi nào squash?\n\n\nNên squash khi:\n\n- Có nhiều commit sửa lỗi nhỏ.\n- Muốn PR gọn.\n- Commit trung gian không có ý nghĩa.\n- Dự án yêu cầu lịch sử sạch.\n\nKhông nên squash nếu:\n\n- Mỗi commit có ý nghĩa riêng.\n- Cần giữ lịch sử phát triển chi tiết.\n- Commit đã được người khác dùng.\n\n\n## 7.10. Force push an toàn\n\n\nSau rebase branch đã push, cần force push:\n\n$ git push --force-with-lease\n\nKhông nên dùng:\n\n$ git push --force\n\nVì --force có thể ghi đè thay đổi của người khác. --force-with-lease an toàn hơn vì kiểm tra remote có thay đổi mới không.\n\nBài tập phần 7:\n\n1. Tạo branch feature/rebase-demo.\n2. Commit 3 lần.\n3. Trên main tạo commit mới.\n4. Rebase feature lên main.\n5. Tạo conflict và giải quyết.\n6. Squash 3 commit thành 1.\n7. Push bằng --force-with-lease trên branch cá nhân.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 8
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 8: GITHUB PULL REQUEST, CODE REVIEW VÀ COLLABORATION', 
        '',
        8
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: GITHUB PULL REQUEST, CODE REVIEW VÀ COLLABORATION
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: GITHUB PULL REQUEST, CODE REVIEW VÀ COLLABORATION', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 8.1. Pull Request là gì?\n\n\nPull Request, viết tắt PR, là yêu cầu gộp thay đổi từ branch này vào branch khác.\n\nPR giúp:\n\n- Thảo luận code.\n- Review trước khi merge.\n- Chạy test tự động.\n- Ghi lại quyết định.\n- Kiểm soát chất lượng.\n\n\n## 8.2. Quy trình PR cơ bản\n\n\n1. Tạo branch từ main mới nhất.\n2. Code và commit.\n3. Push branch lên GitHub.\n4. Tạo pull request.\n5. Mô tả thay đổi.\n6. Reviewer xem code.\n7. Sửa theo góp ý.\n8. CI pass.\n9. Merge PR.\n10. Xóa branch.\n\n\n## 8.3. Tạo PR trên GitHub\n\n\nSau khi push branch, GitHub thường hiện nút Compare & pull request.\n\nBạn điền:\n\n- Title.\n- Description.\n- Linked issue.\n- Screenshots nếu có UI.\n- Checklist.\n- Reviewer.\n- Assignee.\n- Labels.\n\n\n## 8.4. Mẫu mô tả PR\n\n\nTiêu đề:\nfeat(auth): add login page\n\nMô tả:\n\nSummary:\n- Add login page UI.\n- Add basic form validation.\n- Connect login button to auth service.\n\nWhy:\n- Users need to sign in before accessing dashboard.\n\nTesting:\n- Tested empty email.\n- Tested invalid password.\n- Tested successful login.\n\nScreenshots:\n- Attach image if UI change.\n\nChecklist:\n- [ ] Code builds successfully.\n- [ ] Tests passed.\n- [ ] No sensitive data committed.\n- [ ] Documentation updated if needed.\n\n\n## 8.5. Code review là gì?\n\n\nCode review là quá trình người khác đọc thay đổi của bạn trước khi merge.\n\nMục tiêu không phải bắt lỗi cá nhân, mà là tăng chất lượng code.\n\nReviewer kiểm tra:\n\n- Logic đúng không?\n- Code dễ đọc không?\n- Có test không?\n- Có bảo mật không?\n- Có ảnh hưởng performance không?\n- Có phá chức năng cũ không?\n- Có tuân thủ convention không?\n\n\n## 8.6. Cách nhận review chuyên nghiệp\n\n\nNên:\n\n- Cảm ơn reviewer.\n- Hỏi lại nếu chưa rõ.\n- Không phản ứng phòng thủ.\n- Giải thích lý do kỹ thuật.\n- Sửa và báo lại.\n\nKhông nên:\n\n- Tranh cãi cá nhân.\n- Ignore comment.\n- Push thay đổi không liên quan.\n- Nói "máy em chạy được" mà không kiểm tra kỹ.\n\n\n## 8.7. Cách review chuyên nghiệp\n\n\nNên viết:\n\n- "Consider renaming this variable for clarity."\n- "Could this return null? We may need a guard here."\n- "This logic looks good, but please add a test for the error case."\n\nKhông nên viết:\n\n- "Code dở quá."\n- "Sai rồi."\n- "Ai viết thế này?"\n\n\n## 8.8. Merge options trên GitHub\n\n\nGitHub thường có 3 kiểu merge:\n\n1. Create a merge commit\n   Giữ lịch sử đầy đủ, tạo merge commit.\n\n2. Squash and merge\n   Gộp toàn bộ commit trong PR thành một commit.\n\n3. Rebase and merge\n   Đưa commit trong PR lên main theo lịch sử tuyến tính.\n\n\n## 8.9. Chọn kiểu merge nào?\n\n\nMerge commit:\n- Tốt cho repo muốn giữ dấu vết nhánh.\n- Lịch sử có thể nhiều merge commit.\n\nSquash and merge:\n- Tốt cho PR có nhiều commit nhỏ.\n- main sạch, mỗi PR một commit.\n\nRebase and merge:\n- Lịch sử tuyến tính.\n- Giữ từng commit nhưng không có merge commit.\n\n\n## 8.10. Branch protection\n\n\nTrong dự án chuyên nghiệp, main thường được bảo vệ:\n\n- Không push trực tiếp.\n- Bắt buộc PR.\n- Bắt buộc review.\n- Bắt buộc CI pass.\n- Bắt buộc branch up to date.\n- Không cho force push.\n\n\n## 8.11. Draft Pull Request\n\n\nDraft PR dùng khi code chưa sẵn sàng merge nhưng muốn:\n\n- Chia sẻ tiến độ.\n- Xin góp ý sớm.\n- Chạy CI.\n- Thảo luận thiết kế.\n\n\n## 8.12. Linked issue\n\n\nTrong PR description có thể viết:\n\nCloses #12\nFixes #34\nResolves #56\n\nKhi PR merge, GitHub tự đóng issue tương ứng.\n\nBài tập phần 8:\n\n1. Tạo issue "Add contact page".\n2. Tạo branch feature/contact-page.\n3. Commit code.\n4. Push branch.\n5. Tạo PR.\n6. Viết mô tả PR theo mẫu.\n7. Merge PR.\n8. Kiểm tra issue tự đóng nếu dùng Closes #issue_number.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 9
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 9: GIT NÂNG CAO: STASH, RESET, REVERT, CHERRY-PICK, TAG', 
        '',
        9
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: GIT NÂNG CAO: STASH, RESET, REVERT, CHERRY-PICK, TAG
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: GIT NÂNG CAO: STASH, RESET, REVERT, CHERRY-PICK, TAG', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 9.1. Git stash\n\n\nStash dùng để cất tạm thay đổi chưa commit.\n\nTình huống:\n\nBạn đang code dở trên feature A.\nĐột nhiên cần chuyển sang sửa bug khẩn cấp.\nBạn chưa muốn commit code dở.\nDùng stash.\n\nLệnh:\n\n$ git stash\n\nXem danh sách stash:\n\n$ git stash list\n\nLấy stash mới nhất:\n\n$ git stash pop\n\nLấy nhưng không xóa stash:\n\n$ git stash apply\n\nStash với message:\n\n$ git stash push -m "WIP login form"\n\nXóa stash:\n\n$ git stash drop stash@{0}\n\nXóa toàn bộ stash:\n\n$ git stash clear\n\n\n## 9.2. Git restore\n\n\nKhôi phục file trong working directory:\n\n$ git restore file.txt\n\nBỏ file khỏi staging:\n\n$ git restore --staged file.txt\n\nKhôi phục file từ commit cụ thể:\n\n$ git restore --source=<commit-hash> file.txt\n\n\n## 9.3. Git checkout\n\n\nLệnh checkout cũ có nhiều chức năng:\n\n- Chuyển branch.\n- Tạo branch.\n- Khôi phục file.\n- Checkout commit.\n\nHiện nay nên dùng:\n\n- git switch cho branch.\n- git restore cho file.\n\n\n## 9.4. Git reset\n\n\nReset di chuyển HEAD và có thể thay đổi staging/working directory.\n\nBa chế độ chính:\n\n1. --soft\n   Di chuyển HEAD, giữ thay đổi trong staging.\n\n2. --mixed\n   Di chuyển HEAD, giữ thay đổi trong working directory nhưng bỏ staging.\n   Đây là mặc định.\n\n3. --hard\n   Di chuyển HEAD, xóa thay đổi trong staging và working directory.\n\nVí dụ:\n\n$ git reset --soft HEAD~1\n\nUndo commit gần nhất nhưng giữ staged.\n\n$ git reset HEAD~1\n\nUndo commit gần nhất, giữ file đã sửa nhưng unstaged.\n\n$ git reset --hard HEAD~1\n\nXóa commit gần nhất và xóa luôn thay đổi.\n\nCẩn thận với --hard.\n\n\n## 9.5. Git revert\n\n\nRevert tạo commit mới để đảo ngược thay đổi của commit cũ.\n\n$ git revert <commit-hash>\n\nNên dùng revert khi commit đã push/public vì không viết lại lịch sử.\n\n\n## 9.6. Reset vs Revert\n\n\nReset:\n- Viết lại lịch sử.\n- Phù hợp commit local.\n- Có thể nguy hiểm nếu đã push.\n\nRevert:\n- Không viết lại lịch sử.\n- Phù hợp commit đã public.\n- An toàn cho team.\n\n\n## 9.7. Git cherry-pick\n\n\nCherry-pick lấy một commit cụ thể từ branch khác áp dụng vào branch hiện tại.\n\nVí dụ:\n\n$ git switch main\n$ git cherry-pick a1b2c3d\n\nTình huống dùng:\n\n- Lấy hotfix từ branch khác.\n- Chọn một commit hữu ích mà không merge toàn bộ branch.\n- Backport bugfix.\n\n\n## 9.8. Git tag\n\n\nTag đánh dấu commit quan trọng, thường dùng cho version release.\n\nTạo lightweight tag:\n\n$ git tag v1.0.0\n\nTạo annotated tag:\n\n$ git tag -a v1.0.0 -m "Release version 1.0.0"\n\nXem tag:\n\n$ git tag\n\nPush tag:\n\n$ git push origin v1.0.0\n\nPush tất cả tag:\n\n$ git push origin --tags\n\nXóa tag local:\n\n$ git tag -d v1.0.0\n\nXóa tag remote:\n\n$ git push origin --delete v1.0.0\n\n\n## 9.9. Semantic Versioning\n\n\nVersion thường có dạng:\n\nMAJOR.MINOR.PATCH\n\nVí dụ:\n\n1.4.2\n\nÝ nghĩa:\n\n- MAJOR: thay đổi lớn, có thể breaking change.\n- MINOR: thêm tính năng tương thích ngược.\n- PATCH: sửa lỗi nhỏ.\n\nVí dụ:\n\nv1.0.0\nv1.1.0\nv1.1.1\nv2.0.0\n\n\n## 9.10. Git reflog\n\n\nReflog ghi lại lịch sử di chuyển HEAD.\n\nRất hữu ích khi lỡ reset sai.\n\n$ git reflog\n\nKhôi phục:\n\n$ git reset --hard <hash-from-reflog>\n\nReflog có thể cứu bạn trong nhiều tình huống, nhưng không nên phụ thuộc hoàn toàn.\n\nBài tập phần 9:\n\n1. Tạo thay đổi chưa commit rồi stash.\n2. Chuyển branch, sau đó pop stash.\n3. Tạo commit rồi reset --soft.\n4. Tạo commit rồi revert.\n5. Cherry-pick một commit từ branch khác.\n6. Tạo tag v1.0.0 và push lên GitHub.\n7. Dùng reflog để xem lịch sử HEAD.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 10
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 10: VIẾT COMMIT MESSAGE VÀ QUY ƯỚC LÀM VIỆC CHUYÊN NGHIỆP', 
        '',
        10
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: VIẾT COMMIT MESSAGE VÀ QUY ƯỚC LÀM VIỆC CHUYÊN NGHIỆP
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: VIẾT COMMIT MESSAGE VÀ QUY ƯỚC LÀM VIỆC CHUYÊN NGHIỆP', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 10.1. Vì sao commit message quan trọng?\n\n\nCommit message giúp người khác hiểu lịch sử dự án.\n\nMột lịch sử tốt giúp:\n\n- Debug nhanh.\n- Review dễ.\n- Rollback an toàn.\n- Tạo changelog tự động.\n- Hiểu vì sao code thay đổi.\n\n\n## 10.2. Nguyên tắc commit message\n\n\nNên:\n\n- Dùng động từ ở dạng mệnh lệnh tiếng Anh nếu làm dự án quốc tế.\n- Ngắn gọn ở dòng đầu.\n- Giải thích why ở phần body nếu cần.\n- Không viết mơ hồ.\n\nVí dụ tốt:\n\nAdd product search filter\nFix null response in payment API\nRefactor cart calculation logic\n\nVí dụ kém:\n\nupdate\nfix bug\ndone\ncode lại\nsửa linh tinh\n\n\n## 10.3. Commit message nhiều dòng\n\n\nDạng:\n\nShort summary under 50 characters\n\nExplain the problem and why this change is needed.\nMention side effects or migration notes if any.\n\nVí dụ:\n\nFix order total rounding\n\nThe payment provider requires totals to be rounded to\ntwo decimal places. This change prevents mismatch errors\nduring checkout.\n\n\n## 10.4. Conventional Commits chi tiết\n\n\nCấu trúc:\n\ntype(scope): description\n\nbody\n\nfooter\n\nVí dụ:\n\nfeat(auth): add password reset flow\n\nAllow users to request a reset link by email and set a\nnew password through a time-limited token.\n\nCloses #42\n\n\n## 10.5. Breaking change\n\n\nVí dụ:\n\nfeat(api)!: remove legacy user endpoint\n\nBREAKING CHANGE: /api/v1/users has been removed. Use\n/api/v2/users instead.\n\n\n## 10.6. Quy tắc chia commit\n\n\nMột commit nên đại diện cho một ý tưởng hoàn chỉnh.\n\nKhông nên:\n\n- Commit quá lớn.\n- Commit code không chạy được.\n- Commit file format hàng loạt chung với sửa logic.\n- Commit secret.\n\nNên:\n\n- Commit sau khi hoàn thành phần nhỏ.\n- Commit khi test qua.\n- Commit refactor riêng với feature.\n- Commit tài liệu riêng nếu lớn.\n\n\n## 10.7. Pre-commit hook\n\n\nHook là script chạy ở thời điểm nhất định.\n\nPre-commit chạy trước khi commit.\n\nCó thể dùng để:\n\n- Format code.\n- Chạy lint.\n- Chạy test.\n- Chặn secret.\n\nVí dụ công cụ:\n\n- pre-commit framework.\n- Husky cho Node.js.\n- lint-staged.\n- commitlint.\n\n\n## 10.8. Quy ước branch\n\n\nVí dụ:\n\nfeature/JIRA-123-login-page\nbugfix/JIRA-456-cart-total\nhotfix/JIRA-789-payment-crash\n\n\n## 10.9. Quy ước PR\n\n\nPR nên:\n\n- Nhỏ vừa đủ.\n- Mô tả rõ.\n- Có ảnh nếu UI.\n- Có test.\n- Không trộn nhiều chủ đề.\n- Gắn issue/task.\n\n\n## 10.10. Definition of Done\n\n\nMột task được coi là xong khi:\n\n- Code hoàn thành.\n- Test pass.\n- Không còn lỗi lint.\n- Đã review.\n- Đã cập nhật tài liệu nếu cần.\n- Đã kiểm tra bảo mật cơ bản.\n- Đã merge vào branch chính theo quy trình.\n\nBài tập phần 10:\n\n1. Viết lại 10 commit message kém thành tốt.\n2. Tạo 3 commit theo Conventional Commits.\n3. Viết PR template cho dự án của bạn.\n4. Tạo checklist Definition of Done.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 11
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 11: GITHUB ISSUES, PROJECTS, WIKI, RELEASES', 
        '',
        11
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: GITHUB ISSUES, PROJECTS, WIKI, RELEASES
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: GITHUB ISSUES, PROJECTS, WIKI, RELEASES', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 11.1. GitHub Issues\n\n\nIssue dùng để theo dõi:\n\n- Bug.\n- Feature request.\n- Task.\n- Discussion kỹ thuật.\n- Documentation work.\n\n\n## 11.2. Viết issue tốt\n\n\nMột bug issue tốt nên có:\n\nTitle:\nLogin fails when password contains special characters\n\nDescription:\n- What happened?\n- What did you expect?\n- Steps to reproduce.\n- Environment.\n- Screenshots/logs.\n- Possible cause.\n\nMẫu bug issue:\n\n## Description\nMô tả lỗi.\n\n## Steps to reproduce\n1. Go to ...\n2. Click ...\n3. Enter ...\n4. See error ...\n\n## Expected behavior\nĐiều mong đợi.\n\n## Actual behavior\nĐiều thực tế.\n\n## Environment\n- OS:\n- Browser:\n- App version:\n\n## Additional context\nLog, ảnh, link liên quan.\n\n\n## 11.3. Labels\n\n\nLabel giúp phân loại issue/PR.\n\nVí dụ:\n\n- bug\n- enhancement\n- documentation\n- good first issue\n- help wanted\n- question\n- priority/high\n- priority/low\n- frontend\n- backend\n- security\n\n\n## 11.4. Milestones\n\n\nMilestone nhóm issue/PR theo mục tiêu.\n\nVí dụ:\n\n- v1.0.0\n- Sprint 12\n- Beta Release\n- MVP\n\n\n## 11.5. Assignees\n\n\nAssignee là người chịu trách nhiệm xử lý issue/PR.\n\n\n## 11.6. GitHub Projects\n\n\nProjects là bảng quản lý công việc.\n\nCó thể tạo các cột:\n\n- Backlog\n- To do\n- In progress\n- In review\n- Done\n\n\n## 11.7. GitHub Wiki\n\n\nWiki dùng để viết tài liệu dự án:\n\n- Hướng dẫn cài đặt.\n- Kiến trúc hệ thống.\n- Quy trình release.\n- Quy tắc coding.\n- Hướng dẫn onboarding.\n\n\n## 11.8. GitHub Releases\n\n\nRelease là bản phát hành chính thức dựa trên tag.\n\nMột release thường gồm:\n\n- Version.\n- Release notes.\n- Assets.\n- Changelog.\n- Source code snapshot.\n\n\n## 11.9. Changelog\n\n\nChangelog ghi lại thay đổi theo phiên bản.\n\nVí dụ:\n\n## v1.2.0\n\n### Added\n- Add user profile page.\n- Add search filter.\n\n### Fixed\n- Fix login redirect issue.\n\n### Changed\n- Improve dashboard layout.\n\n\n## 11.10. README chuyên nghiệp\n\n\nREADME nên có:\n\n- Tên dự án.\n- Mô tả ngắn.\n- Demo/screenshot.\n- Tính năng.\n- Công nghệ sử dụng.\n- Cài đặt.\n- Cách chạy.\n- Cách test.\n- Cấu trúc thư mục.\n- Environment variables.\n- Deployment.\n- Contribution guide.\n- License.\n\nMẫu README:\n\n# Project Name\n\nShort description.\n\n## Features\n- Feature 1\n- Feature 2\n\n## Tech Stack\n- Frontend:\n- Backend:\n- Database:\n\n## Getting Started\n\n### Prerequisites\n- Node.js\n- Git\n\n### Installation\n```bash\ngit clone ...\ncd project\nnpm install\nnpm run dev\n```\n\n## Environment Variables\nCreate `.env`:\n\n```\nAPI_URL=\nDATABASE_URL=\n```\n\n## Scripts\n- npm run dev\n- npm run build\n- npm run test\n\n## Contributing\nOpen an issue or pull request.\n\n## License\nMIT\n\nBài tập phần 11:\n\n1. Tạo 3 issue: bug, feature, docs.\n2. Tạo label cho từng issue.\n3. Tạo project board.\n4. Tạo milestone v1.0.0.\n5. Tạo tag và GitHub Release.\n6. Viết README hoàn chỉnh cho repo.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 12
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 12: GITHUB ACTIONS VÀ CI/CD CƠ BẢN', 
        '',
        12
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: GITHUB ACTIONS VÀ CI/CD CƠ BẢN
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: GITHUB ACTIONS VÀ CI/CD CƠ BẢN', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 12.1. CI/CD là gì?\n\n\nCI là Continuous Integration.\nCD là Continuous Delivery hoặc Continuous Deployment.\n\nCI giúp tự động:\n\n- Cài dependencies.\n- Chạy lint.\n- Chạy test.\n- Build project.\n\nCD giúp tự động:\n\n- Deploy staging.\n- Deploy production.\n- Publish package.\n- Tạo release.\n\n\n## 12.2. GitHub Actions là gì?\n\n\nGitHub Actions là hệ thống tự động hóa tích hợp trong GitHub.\n\nWorkflow được viết bằng YAML trong thư mục:\n\n.github/workflows/\n\n\n## 12.3. Workflow đầu tiên\n\n\nTạo file:\n\n.github/workflows/ci.yml\n\nNội dung mẫu cho Node.js:\n\nname: CI\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n\n    steps:\n      - name: Checkout code\n        uses: actions/checkout@v4\n\n      - name: Setup Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: 20\n\n      - name: Install dependencies\n        run: npm ci\n\n      - name: Run tests\n        run: npm test\n\n\n## 12.4. Các thành phần chính\n\n\nname:\nTên workflow.\n\non:\nSự kiện kích hoạt.\n\njobs:\nDanh sách công việc.\n\nruns-on:\nMáy chạy workflow.\n\nsteps:\nCác bước trong job.\n\nuses:\nDùng action có sẵn.\n\nrun:\nChạy lệnh shell.\n\n\n## 12.5. Trigger workflow\n\n\nVí dụ chạy khi push:\n\non: push\n\nChạy khi PR:\n\non: pull_request\n\nChạy thủ công:\n\non: workflow_dispatch\n\nChạy theo lịch:\n\non:\n  schedule:\n    - cron: "0 0 * * *"\n\n\n## 12.6. Workflow cho Python\n\n\nname: Python CI\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.11"\n\n      - run: pip install -r requirements.txt\n\n      - run: pytest\n\n\n## 12.7. Matrix build\n\n\nChạy nhiều version:\n\nstrategy:\n  matrix:\n    node-version: [18, 20, 22]\n\n\n## 12.8. Secrets trong GitHub Actions\n\n\nKhông ghi secret trực tiếp vào YAML.\n\nDùng GitHub Secrets:\n\nSettings -> Secrets and variables -> Actions -> New repository secret\n\nVí dụ dùng:\n\nenv:\n  API_KEY: ${{ secrets.API_KEY }}\n\n\n## 12.9. Artifacts\n\n\nArtifact là file sinh ra từ workflow, ví dụ build output hoặc report.\n\nVí dụ:\n\n- name: Upload coverage\n  uses: actions/upload-artifact@v4\n  with:\n    name: coverage-report\n    path: coverage/\n\n\n## 12.10. CI trong branch protection\n\n\nCó thể yêu cầu CI pass trước khi merge PR vào main.\n\n\n## 12.11. Lỗi thường gặp trong Actions\n\n\n- Sai indent YAML.\n- Dùng npm install thay vì npm ci trong CI.\n- Thiếu lock file.\n- Secret không có trong fork PR.\n- Test phụ thuộc timezone hoặc môi trường local.\n- Lệnh chạy được local nhưng thiếu dependency trên runner.\n\nBài tập phần 12:\n\n1. Tạo workflow CI đơn giản.\n2. Chạy khi push và PR.\n3. Cố tình làm test fail.\n4. Sửa test để CI pass.\n5. Thêm badge CI vào README.\n6. Tạo workflow chạy thủ công bằng workflow_dispatch.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 13
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 13: BẢO MẬT, SSH, TOKEN, SECRET VÀ QUẢN LÝ QUYỀN', 
        '',
        13
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: BẢO MẬT, SSH, TOKEN, SECRET VÀ QUẢN LÝ QUYỀN
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: BẢO MẬT, SSH, TOKEN, SECRET VÀ QUẢN LÝ QUYỀN', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 13.1. Vì sao bảo mật GitHub quan trọng?\n\n\nRepo có thể chứa:\n\n- Source code.\n- Key deploy.\n- API endpoint.\n- Logic nghiệp vụ.\n- Thông tin khách hàng nếu quản lý sai.\n\nLộ secret có thể gây:\n\n- Mất tiền cloud.\n- Bị chiếm tài khoản.\n- Rò rỉ dữ liệu.\n- Bị tấn công hệ thống.\n\n\n## 13.2. SSH key\n\n\nTạo SSH key:\n\n$ ssh-keygen -t ed25519 -C "email@example.com"\n\nXem public key:\n\n$ cat ~/.ssh/id_ed25519.pub\n\nCopy public key lên GitHub:\n\nSettings -> SSH and GPG keys -> New SSH key\n\nKiểm tra:\n\n$ ssh -T git@github.com\n\n\n## 13.3. Personal Access Token\n\n\nGitHub có thể yêu cầu token thay cho password khi dùng HTTPS.\n\nNguyên tắc:\n\n- Token chỉ cấp quyền cần thiết.\n- Đặt hạn sử dụng.\n- Không lưu token trong code.\n- Không chia sẻ token.\n- Thu hồi token nếu nghi lộ.\n\n\n## 13.4. .env và secret\n\n\nFile .env nên nằm trong .gitignore.\n\nVí dụ:\n\n.env\n.env.local\n.env.production\n\nTạo file mẫu:\n\n.env.example\n\nNội dung:\n\nAPI_URL=\nDATABASE_URL=\nJWT_SECRET=\n\n\n## 13.5. GitHub Secrets\n\n\nDùng cho Actions và deploy.\n\nKhông in secret ra log.\nKhông echo secret.\nKhông đưa secret vào artifact.\n\n\n## 13.6. Quyền repo\n\n\nCác vai trò thường gặp:\n\n- Read: đọc repo.\n- Triage: quản lý issue/PR cơ bản.\n- Write: push branch, tạo PR.\n- Maintain: quản lý repo không gồm quyền nguy hiểm nhất.\n- Admin: toàn quyền.\n\n\n## 13.7. Public vs Private repository\n\n\nPublic:\n\n- Ai cũng xem được.\n- Tốt cho open source/portfolio.\n- Không được chứa thông tin nhạy cảm.\n\nPrivate:\n\n- Chỉ người được cấp quyền xem.\n- Phù hợp dự án công ty hoặc cá nhân chưa công khai.\n\n\n## 13.8. Dependabot\n\n\nDependabot giúp:\n\n- Cảnh báo dependency có lỗ hổng.\n- Tạo PR cập nhật dependency.\n- Giảm rủi ro bảo mật.\n\n\n## 13.9. Secret scanning\n\n\nGitHub có tính năng phát hiện secret trong repo.\n\nTuy nhiên không nên phụ thuộc hoàn toàn. Hãy phòng từ đầu bằng .gitignore và review kỹ.\n\n\n## 13.10. Khi lỡ commit secret\n\n\nCác bước:\n\n1. Thu hồi hoặc rotate secret ngay.\n2. Xóa secret khỏi code.\n3. Thêm vào .gitignore.\n4. Làm sạch lịch sử nếu cần.\n5. Force push sau khi team thống nhất.\n6. Kiểm tra log và hệ thống liên quan.\n\nCông cụ có thể dùng:\n\n- git filter-repo.\n- BFG Repo-Cleaner.\n\nBài tập phần 13:\n\n1. Tạo SSH key và kết nối GitHub.\n2. Tạo .env.example.\n3. Đảm bảo .env không bị Git track.\n4. Bật Dependabot nếu dự án phù hợp.\n5. Kiểm tra quyền thành viên trong repo test.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 14
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 14: GIT TRONG DỰ ÁN THỰC TẾ', 
        '',
        14
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: GIT TRONG DỰ ÁN THỰC TẾ
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: GIT TRONG DỰ ÁN THỰC TẾ', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 14.1. Quy trình solo developer\n\n\nQuy trình đơn giản:\n\n1. main luôn ổn định.\n2. Tạo branch cho mỗi feature.\n3. Commit nhỏ.\n4. Push lên GitHub.\n5. Tạo PR, tự review.\n6. Merge khi xong.\n7. Tạo release/tag nếu cần.\n\n\n## 14.2. Quy trình team nhỏ\n\n\nGợi ý:\n\n- main được bảo vệ.\n- Không push trực tiếp vào main.\n- Mỗi task có issue.\n- Mỗi issue có branch.\n- Mỗi branch tạo PR.\n- Ít nhất 1 reviewer.\n- CI phải pass.\n- Squash merge để main gọn.\n\n\n## 14.3. Git Flow\n\n\nGit Flow dùng các branch:\n\n- main: production.\n- develop: development integration.\n- feature/*: tính năng.\n- release/*: chuẩn bị release.\n- hotfix/*: sửa production khẩn cấp.\n\nPhù hợp:\n\n- Dự án release theo phiên bản.\n- Team cần quy trình rõ.\n- Sản phẩm có môi trường staging/production.\n\nNhược điểm:\n\n- Nhiều branch.\n- Có thể phức tạp.\n- Không luôn phù hợp với deploy liên tục.\n\n\n## 14.4. Trunk-based development\n\n\nMô hình:\n\n- main/trunk là nhánh trung tâm.\n- Branch sống ngắn.\n- Merge thường xuyên.\n- Dùng feature flags nếu tính năng chưa hoàn thiện.\n\nPhù hợp:\n\n- Team có CI mạnh.\n- Deploy thường xuyên.\n- Muốn giảm merge conflict.\n\n\n## 14.5. Feature flags\n\n\nFeature flag cho phép đưa code lên main nhưng chưa bật cho user.\n\nVí dụ:\n\nif ENABLE_NEW_CHECKOUT:\n    show_new_checkout()\nelse:\n    show_old_checkout()\n\n\n## 14.6. Hotfix production\n\n\nQuy trình:\n\n1. Tạo branch hotfix từ main.\n2. Sửa lỗi nhỏ nhất có thể.\n3. Test kỹ.\n4. PR vào main.\n5. Tag release mới.\n6. Merge/cherry-pick về develop nếu dùng Git Flow.\n\n\n## 14.7. Release branch\n\n\nDùng khi chuẩn bị phát hành:\n\n- Chỉ nhận bugfix.\n- Không thêm feature lớn.\n- Cập nhật version.\n- Cập nhật changelog.\n- Tạo tag khi release.\n\n\n## 14.8. Monorepo và polyrepo\n\n\nMonorepo:\n- Nhiều project trong một repo.\n- Dễ chia sẻ code.\n- CI có thể phức tạp.\n- Cần quy ước rõ.\n\nPolyrepo:\n- Mỗi service/package một repo.\n- Dễ phân quyền.\n- Quản lý version giữa repo phức tạp hơn.\n\n\n## 14.9. Git submodule\n\n\nSubmodule cho phép repo chứa repo khác.\n\nThêm submodule:\n\n$ git submodule add https://github.com/user/lib.git libs/lib\n\nClone repo có submodule:\n\n$ git clone --recurse-submodules <url>\n\nCập nhật:\n\n$ git submodule update --init --recursive\n\nSubmodule mạnh nhưng dễ gây nhầm lẫn cho người mới.\n\n\n## 14.10. Large files\n\n\nGit không phù hợp lưu file quá lớn như video, dataset, binary nặng.\n\nCó thể dùng Git LFS:\n\n$ git lfs install\n$ git lfs track "*.psd"\n$ git add .gitattributes\n$ git commit -m "Track PSD files with Git LFS"\n\n\n## 14.11. Quy trình review file cấu hình\n\n\nCẩn thận với:\n\n- Dockerfile.\n- CI workflow.\n- Deployment config.\n- Infrastructure as Code.\n- Permission policy.\n- Script migration database.\n\n\n## 14.12. Code ownership\n\n\nGitHub có CODEOWNERS để tự động yêu cầu reviewer.\n\nVí dụ file .github/CODEOWNERS:\n\n# Frontend\n/frontend/ @frontend-team\n\n# Backend\n/backend/ @backend-team\n\n# CI\n/.github/workflows/ @devops-team\n\nBài tập phần 14:\n\n1. Thiết kế workflow Git cho team 3 người.\n2. Viết quy tắc đặt branch.\n3. Viết quy tắc merge.\n4. Tạo file CODEOWNERS giả lập.\n5. Mô phỏng hotfix production.\n6. Tạo release branch và tag.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 15
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 15: CÁC TÌNH HUỐNG LỖI THƯỜNG GẶP VÀ CÁCH XỬ LÝ', 
        '',
        15
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: CÁC TÌNH HUỐNG LỖI THƯỜNG GẶP VÀ CÁCH XỬ LÝ
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: CÁC TÌNH HUỐNG LỖI THƯỜNG GẶP VÀ CÁCH XỬ LÝ', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 15.1. Lỗi: not a git repository\n\n\nThông báo:\n\nfatal: not a git repository\n\nNguyên nhân:\n\n- Bạn không ở trong thư mục repo.\n- Chưa chạy git init.\n- Thư mục .git bị xóa.\n\nCách xử lý:\n\n$ pwd\n$ ls -a\n$ git init\n\nHoặc cd vào đúng thư mục.\n\n\n## 15.2. Lỗi: nothing to commit\n\n\nThông báo:\n\nnothing to commit, working tree clean\n\nÝ nghĩa:\n\n- Không có thay đổi mới.\n- Hoặc bạn chưa sửa file.\n- Hoặc file bị .gitignore bỏ qua.\n\nKiểm tra:\n\n$ git status\n\n\n## 15.3. Lỗi push rejected\n\n\nThông báo:\n\nrejected\nfetch first\n\nNguyên nhân:\n\nRemote có commit mới mà local chưa có.\n\nCách xử lý:\n\n$ git pull --rebase\n$ git push\n\nNếu conflict, giải quyết conflict rồi tiếp tục.\n\n\n## 15.4. Lỗi authentication failed\n\n\nNguyên nhân:\n\n- Sai token.\n- Token hết hạn.\n- Chưa đăng nhập.\n- SSH key chưa cấu hình.\n\nCách xử lý HTTPS:\n\n- Tạo token mới.\n- Đăng nhập lại credential manager.\n- Kiểm tra remote URL.\n\nCách xử lý SSH:\n\n$ ssh -T git@github.com\n$ git remote -v\n\n\n## 15.5. Lỡ commit sai file\n\n\nNếu chưa push:\n\n$ git reset --soft HEAD~1\n$ git restore --staged wrong-file.txt\n$ git commit -m "Correct commit"\n\nNếu đã push:\n\n- Nếu chỉ sai file bình thường: tạo commit mới xóa/sửa.\n- Nếu là secret: rotate secret và làm sạch lịch sử.\n\n\n## 15.6. Lỡ commit vào main\n\n\nNếu chưa push:\n\n$ git switch -c feature/my-work\n$ git switch main\n$ git reset --hard origin/main\n\nNếu đã push lên main chung, không tự ý reset. Hãy trao đổi team và dùng revert nếu cần.\n\n\n## 15.7. Muốn đổi tên branch\n\n\nĐổi local branch hiện tại:\n\n$ git branch -m new-name\n\nĐổi branch local khác:\n\n$ git branch -m old-name new-name\n\nPush branch mới:\n\n$ git push -u origin new-name\n\nXóa branch cũ remote:\n\n$ git push origin --delete old-name\n\n\n## 15.8. Muốn undo git add\n\n\n$ git restore --staged file.txt\n\n\n## 15.9. Muốn undo thay đổi file\n\n\n$ git restore file.txt\n\n\n## 15.10. Muốn undo commit cuối nhưng giữ code\n\n\n$ git reset --soft HEAD~1\n\nHoặc giữ trong working directory:\n\n$ git reset HEAD~1\n\n\n## 15.11. Muốn xóa sạch thay đổi local\n\n\nCẩn thận:\n\n$ git reset --hard\n$ git clean -fd\n\ngit clean -fd xóa file untracked.\n\n\n## 15.12. Detached HEAD\n\n\nDetached HEAD xảy ra khi bạn checkout trực tiếp một commit thay vì branch.\n\nVí dụ:\n\n$ git checkout a1b2c3d\n\nNếu bạn muốn giữ thay đổi:\n\n$ git switch -c new-branch-name\n\n\n## 15.13. Conflict khi pull\n\n\nCách xử lý:\n\n$ git pull\n# Git báo conflict\n# Mở file sửa conflict\n$ git add .\n$ git commit\n\nNếu pull --rebase:\n\n$ git pull --rebase\n# sửa conflict\n$ git add .\n$ git rebase --continue\n\n\n## 15.14. Không thấy branch remote\n\n\nChạy:\n\n$ git fetch --all\n$ git branch -a\n\n\n## 15.15. Remote URL sai\n\n\nXem:\n\n$ git remote -v\n\nĐổi:\n\n$ git remote set-url origin git@github.com:username/repo.git\n\n\n## 15.16. Permission denied publickey\n\n\nNguyên nhân SSH key chưa đúng.\n\nKiểm tra:\n\n$ ssh-add -l\n$ ssh -T git@github.com\n\nThêm key:\n\n$ ssh-add ~/.ssh/id_ed25519\n\n\n## 15.17. File bị Git ignore nhưng vẫn được track\n\n\nNếu file đã được track trước khi thêm .gitignore, .gitignore không tự bỏ track.\n\nCách xử lý:\n\n$ git rm --cached file.txt\n$ git commit -m "Stop tracking ignored file"\n\nBài tập phần 15:\n\n1. Tạo lỗi push rejected và sửa.\n2. Tạo detached HEAD và thoát ra bằng branch mới.\n3. Lỡ add file rồi undo.\n4. Lỡ commit rồi reset --soft.\n5. Đổi remote URL.\n6. Xử lý conflict khi pull --rebase.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 16
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 16: BÀI TẬP THỰC HÀNH THEO CẤP ĐỘ', 
        '',
        16
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: BÀI TẬP THỰC HÀNH THEO CẤP ĐỘ
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: BÀI TẬP THỰC HÀNH THEO CẤP ĐỘ', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 16.1. Cấp độ 1: Người mới\n\n\nBài 1: Repository đầu tiên\n\nYêu cầu:\n\n1. Tạo folder git-lab-1.\n2. git init.\n3. Tạo README.md.\n4. Commit lần đầu.\n5. Sửa README.\n6. Commit lần hai.\n7. Xem git log --oneline.\n\nBài 2: Staging\n\nYêu cầu:\n\n1. Tạo 3 file: a.txt, b.txt, c.txt.\n2. Chỉ add a.txt và b.txt.\n3. Commit.\n4. Kiểm tra c.txt vẫn untracked.\n5. Add và commit c.txt.\n\nBài 3: .gitignore\n\nYêu cầu:\n\n1. Tạo file .env.\n2. Tạo .gitignore bỏ qua .env.\n3. Đảm bảo .env không xuất hiện trong git status.\n4. Tạo .env.example và commit.\n\n\n## 16.2. Cấp độ 2: Branch và merge\n\n\nBài 4: Feature branch\n\nYêu cầu:\n\n1. Tạo branch feature/homepage.\n2. Tạo index.html.\n3. Commit.\n4. Merge vào main.\n5. Xóa branch.\n\nBài 5: Conflict\n\nYêu cầu:\n\n1. Tạo file text.txt.\n2. Trên main sửa dòng 1.\n3. Trên branch feature/conflict sửa cùng dòng 1.\n4. Merge để tạo conflict.\n5. Giải quyết conflict.\n6. Commit merge.\n\nBài 6: GitHub remote\n\nYêu cầu:\n\n1. Tạo repo GitHub.\n2. Push repo local.\n3. Clone repo vào folder khác.\n4. Sửa từ folder clone và push.\n5. Pull về folder ban đầu.\n\n\n## 16.3. Cấp độ 3: Rebase và PR\n\n\nBài 7: Rebase\n\nYêu cầu:\n\n1. Tạo branch feature/rebase.\n2. Commit 2 lần.\n3. Quay lại main, commit 1 lần.\n4. Rebase feature lên main.\n5. Xem log graph.\n\nBài 8: Squash\n\nYêu cầu:\n\n1. Tạo 4 commit nhỏ trên branch.\n2. Dùng interactive rebase squash thành 1 commit.\n3. Push branch lên GitHub.\n4. Tạo PR.\n\nBài 9: Pull Request\n\nYêu cầu:\n\n1. Tạo issue.\n2. Tạo branch từ issue.\n3. Commit thay đổi.\n4. Tạo PR.\n5. Link issue bằng Closes #.\n6. Merge PR.\n\n\n## 16.4. Cấp độ 4: Nâng cao\n\n\nBài 10: Stash\n\nYêu cầu:\n\n1. Sửa file nhưng chưa commit.\n2. Stash thay đổi.\n3. Chuyển branch.\n4. Quay lại branch cũ.\n5. Pop stash.\n\nBài 11: Reset và revert\n\nYêu cầu:\n\n1. Tạo commit sai.\n2. Dùng reset khi chưa push.\n3. Tạo commit sai khác.\n4. Push lên GitHub.\n5. Dùng revert để đảo ngược.\n\nBài 12: Cherry-pick\n\nYêu cầu:\n\n1. Tạo branch bugfix.\n2. Commit một fix.\n3. Quay lại main.\n4. Cherry-pick commit fix.\n5. Kiểm tra log.\n\nBài 13: Tag và release\n\nYêu cầu:\n\n1. Tạo tag v1.0.0.\n2. Push tag.\n3. Tạo GitHub Release.\n4. Viết release notes.\n\n\n## 16.5. Cấp độ 5: Team workflow\n\n\nBài 14: Mô phỏng team\n\nYêu cầu:\n\n1. Tạo repo.\n2. Tạo branch develop.\n3. Tạo 2 feature branch.\n4. Merge vào develop bằng PR.\n5. Tạo release branch.\n6. Merge release vào main.\n7. Tag v1.0.0.\n\nBài 15: CI/CD\n\nYêu cầu:\n\n1. Tạo workflow CI.\n2. Chạy test tự động.\n3. Làm test fail.\n4. Sửa test.\n5. Bật branch protection yêu cầu CI pass.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 17
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 17: DỰ ÁN CUỐI KHÓA', 
        '',
        17
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: DỰ ÁN CUỐI KHÓA
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: DỰ ÁN CUỐI KHÓA', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 17.1. Mục tiêu dự án\n\n\nBạn sẽ xây dựng một repository GitHub hoàn chỉnh cho một website tài liệu cá nhân hoặc app nhỏ.\n\nTên dự án gợi ý:\n\npersonal-knowledge-base\n\n\n## 17.2. Yêu cầu kỹ thuật\n\n\nRepository phải có:\n\n- README.md đầy đủ.\n- .gitignore đúng.\n- Branch main được bảo vệ nếu có thể.\n- Ít nhất 5 issue.\n- Ít nhất 3 pull request.\n- Ít nhất 1 conflict đã được giải quyết.\n- Ít nhất 1 tag.\n- Ít nhất 1 GitHub Release.\n- GitHub Actions CI đơn giản.\n- Changelog.\n- License.\n- Contribution guide.\n\n\n## 17.3. Cấu trúc repo gợi ý\n\n\npersonal-knowledge-base/\n  README.md\n  CHANGELOG.md\n  CONTRIBUTING.md\n  LICENSE\n  .gitignore\n  .github/\n    workflows/\n      ci.yml\n    PULL_REQUEST_TEMPLATE.md\n    ISSUE_TEMPLATE/\n      bug_report.md\n      feature_request.md\n  docs/\n    git-notes.md\n    github-notes.md\n  src/\n    index.html\n    style.css\n    app.js\n\n\n## 17.4. Quy trình thực hiện\n\n\nBước 1: Khởi tạo\n\n$ mkdir personal-knowledge-base\n$ cd personal-knowledge-base\n$ git init\n\nBước 2: Tạo README, .gitignore, LICENSE\n\nCommit:\n\n$ git add .\n$ git commit -m "chore: initialize project"\n\nBước 3: Push lên GitHub\n\n$ git remote add origin <repo-url>\n$ git push -u origin main\n\nBước 4: Tạo issue\n\nVí dụ:\n\n- Add homepage.\n- Add Git notes page.\n- Add GitHub notes page.\n- Add dark mode.\n- Add deployment workflow.\n\nBước 5: Làm từng issue bằng branch riêng\n\nVí dụ:\n\n$ git switch -c feature/homepage\n$ git add .\n$ git commit -m "feat: add homepage"\n$ git push -u origin feature/homepage\n\nTạo PR, review, merge.\n\nBước 6: Tạo CI\n\nFile:\n\n.github/workflows/ci.yml\n\nNếu là HTML/CSS/JS đơn giản, có thể chạy kiểm tra placeholder:\n\nname: CI\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  basic-check:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: List files\n        run: ls -la\n      - name: Check README exists\n        run: test -f README.md\n\nBước 7: Tạo tag release\n\n$ git tag -a v1.0.0 -m "Release v1.0.0"\n$ git push origin v1.0.0\n\nTạo GitHub Release từ tag.\n\n\n## 17.5. Tiêu chí đánh giá\n\n\nĐiểm tối đa 100:\n\n- Repository structure: 10\n- Commit history rõ ràng: 15\n- Branch/PR workflow: 20\n- Issue/project management: 10\n- Conflict handling: 10\n- CI workflow: 10\n- README/documentation: 15\n- Release/tag/changelog: 10\n\n\n## 17.6. Bài nộp cuối khóa\n\n\nBạn cần nộp:\n\n1. Link GitHub repo.\n2. Ảnh chụp Pull Requests.\n3. Ảnh chụp GitHub Actions chạy thành công.\n4. Link release v1.0.0.\n5. Mô tả ngắn những lỗi bạn gặp và cách xử lý.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 18
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 18: CHEAT SHEET LỆNH GIT & GITHUB', 
        '',
        18
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: CHEAT SHEET LỆNH GIT & GITHUB
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: CHEAT SHEET LỆNH GIT & GITHUB', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 18.1. Cấu hình\n\n\ngit config --global user.name "Your Name"\ngit config --global user.email "you@example.com"\ngit config --global --list\ngit config --global init.defaultBranch main\n\n\n## 18.2. Khởi tạo và clone\n\n\ngit init\ngit clone <url>\n\n\n## 18.3. Trạng thái và diff\n\n\ngit status\ngit diff\ngit diff --staged\n\n\n## 18.4. Add và commit\n\n\ngit add file.txt\ngit add .\ngit commit -m "message"\ngit commit -am "message"\ngit commit --amend\n\n\n## 18.5. Log\n\n\ngit log\ngit log --oneline\ngit log --oneline --graph --decorate --all\ngit show <hash>\ngit blame file.txt\n\n\n## 18.6. Branch\n\n\ngit branch\ngit branch branch-name\ngit switch branch-name\ngit switch -c branch-name\ngit branch -d branch-name\ngit branch -D branch-name\ngit branch -m new-name\n\n\n## 18.7. Merge\n\n\ngit merge branch-name\ngit merge --abort\n\n\n## 18.8. Remote\n\n\ngit remote -v\ngit remote add origin <url>\ngit remote set-url origin <url>\n\n\n## 18.9. Push/Pull/Fetch\n\n\ngit push\ngit push -u origin main\ngit push -u origin branch-name\ngit pull\ngit pull --rebase\ngit fetch\ngit fetch --all\n\n\n## 18.10. Rebase\n\n\ngit rebase main\ngit rebase --continue\ngit rebase --abort\ngit rebase -i HEAD~3\n\n\n## 18.11. Stash\n\n\ngit stash\ngit stash push -m "message"\ngit stash list\ngit stash pop\ngit stash apply\ngit stash drop\ngit stash clear\n\n\n## 18.12. Reset/Restore/Revert\n\n\ngit restore file.txt\ngit restore --staged file.txt\ngit reset HEAD~1\ngit reset --soft HEAD~1\ngit reset --hard HEAD~1\ngit revert <hash>\n\n\n## 18.13. Cherry-pick\n\n\ngit cherry-pick <hash>\n\n\n## 18.14. Tag\n\n\ngit tag\ngit tag v1.0.0\ngit tag -a v1.0.0 -m "Release v1.0.0"\ngit push origin v1.0.0\ngit push origin --tags\ngit tag -d v1.0.0\ngit push origin --delete v1.0.0\n\n\n## 18.15. Clean\n\n\ngit clean -n\ngit clean -fd\n\n\n## 18.16. Reflog\n\n\ngit reflog\ngit reset --hard <hash>\n\n\n## 18.17. GitHub CLI\n\n\ngh auth login\ngh repo create\ngh repo clone owner/repo\ngh issue list\ngh issue create\ngh pr create\ngh pr list\ngh pr checkout <number>\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 19
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 19: LỘ TRÌNH ÔN TẬP 30 NGÀY', 
        '',
        19
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: LỘ TRÌNH ÔN TẬP 30 NGÀY
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: LỘ TRÌNH ÔN TẬP 30 NGÀY', 
        'reading', 
        1, 
        15,
        E'============================================================\n\nNgày 1:\nCài Git, cấu hình user.name, user.email.\n\nNgày 2:\nHọc git init, git status, git add, git commit.\n\nNgày 3:\nHọc git log, git diff, git show.\n\nNgày 4:\nTạo .gitignore, thực hành bỏ qua file.\n\nNgày 5:\nThực hành commit message tốt.\n\nNgày 6:\nHọc branch: tạo, chuyển, xóa.\n\nNgày 7:\nMerge branch, hiểu fast-forward.\n\nNgày 8:\nTạo conflict và giải quyết.\n\nNgày 9:\nTạo repo GitHub và push lần đầu.\n\nNgày 10:\nClone repo, pull và push.\n\nNgày 11:\nTạo branch remote.\n\nNgày 12:\nTạo Pull Request đầu tiên.\n\nNgày 13:\nViết mô tả PR tốt.\n\nNgày 14:\nReview code giả lập.\n\nNgày 15:\nHọc fetch và pull --rebase.\n\nNgày 16:\nHọc rebase branch cá nhân.\n\nNgày 17:\nInteractive rebase và squash.\n\nNgày 18:\nHọc stash.\n\nNgày 19:\nHọc reset --soft, --mixed, --hard.\n\nNgày 20:\nHọc revert.\n\nNgày 21:\nHọc cherry-pick.\n\nNgày 22:\nHọc tag và release.\n\nNgày 23:\nTạo issue, label, milestone.\n\nNgày 24:\nTạo GitHub Project.\n\nNgày 25:\nViết README chuyên nghiệp.\n\nNgày 26:\nTạo GitHub Actions CI.\n\nNgày 27:\nCấu hình SSH.\n\nNgày 28:\nHọc bảo mật secret, .env, token.\n\nNgày 29:\nMô phỏng workflow team.\n\nNgày 30:\nHoàn thành dự án cuối khóa và tạo release.\n\n============================================================'
    );

    -- ============================================
    -- TẠO CHƯƠNG 20
    -- ============================================
    INSERT INTO chapters (course_id, title, description, sort_order)
    VALUES (
        v_course_id, 
        'Chương 20: PHỤ LỤC', 
        '',
        20
    )
    RETURNING id INTO v_chapter_id;

    -- BÀI: Nội dung: PHỤ LỤC
    INSERT INTO lessons (chapter_id, title, lesson_type, sort_order, estimated_duration, content)
    VALUES (
        v_chapter_id, 
        'Nội dung: PHỤ LỤC', 
        'reading', 
        1, 
        15,
        E'============================================================\n\n\n## 20.1. Thuật ngữ quan trọng\n\n\nRepository:\nKho lưu trữ dự án.\n\nCommit:\nMột điểm lưu lịch sử.\n\nBranch:\nNhánh phát triển độc lập.\n\nMerge:\nGộp branch.\n\nRebase:\nĐặt lại nền lịch sử commit.\n\nRemote:\nRepo trên máy chủ khác.\n\nOrigin:\nTên remote mặc định.\n\nUpstream:\nRepo gốc khi bạn fork.\n\nPull Request:\nYêu cầu gộp code và review.\n\nConflict:\nXung đột khi Git không tự merge được.\n\nStaging Area:\nKhu vực chuẩn bị commit.\n\nWorking Directory:\nThư mục đang làm việc.\n\nHEAD:\nCon trỏ tới commit hiện tại.\n\nTag:\nNhãn cho commit, thường dùng đánh dấu version.\n\nFork:\nBản sao repo trên tài khoản của bạn.\n\nClone:\nTải repo về máy.\n\nPush:\nĐẩy commit lên remote.\n\nPull:\nLấy và gộp thay đổi từ remote.\n\nFetch:\nLấy thay đổi từ remote nhưng chưa gộp.\n\n\n## 20.2. Quy tắc an toàn khi dùng Git\n\n\n1. Luôn chạy git status trước khi làm lệnh nguy hiểm.\n2. Không dùng reset --hard nếu chưa hiểu rõ.\n3. Không force push lên branch chung.\n4. Dùng --force-with-lease thay vì --force.\n5. Không commit secret.\n6. Pull/rebase main thường xuyên khi làm feature lâu.\n7. Tạo commit nhỏ và rõ nghĩa.\n8. Không merge code chưa test.\n9. Không xóa branch nếu chưa chắc đã merge.\n10. Trước khi xử lý conflict, đọc kỹ thay đổi của cả hai bên.\n\n\n## 20.3. Quy trình hằng ngày cho lập trình viên\n\n\nBuổi sáng:\n\n$ git switch main\n$ git pull --rebase\n\nNhận task:\n\n$ git switch -c feature/task-name\n\nTrong lúc làm:\n\n$ git status\n$ git add .\n$ git commit -m "feat: implement task"\n\nCập nhật main mới:\n\n$ git fetch origin\n$ git rebase origin/main\n\nPush:\n\n$ git push -u origin feature/task-name\n\nTạo PR, review, sửa, merge.\n\nSau merge:\n\n$ git switch main\n$ git pull --rebase\n$ git branch -d feature/task-name\n\n\n## 20.4. Khi nào dùng lệnh nào?\n\n\nMuốn lưu thay đổi:\ngit add + git commit\n\nMuốn đưa lên GitHub:\ngit push\n\nMuốn lấy từ GitHub:\ngit pull\n\nMuốn tạo nhánh:\ngit switch -c\n\nMuốn gộp nhánh:\ngit merge\n\nMuốn lịch sử sạch:\ngit rebase\n\nMuốn cất tạm:\ngit stash\n\nMuốn undo file chưa commit:\ngit restore\n\nMuốn undo commit local:\ngit reset\n\nMuốn undo commit public:\ngit revert\n\nMuốn lấy một commit:\ngit cherry-pick\n\nMuốn đánh dấu version:\ngit tag\n\n\n## 20.5. Mẫu .gitignore tổng hợp\n\n\n# OS\n.DS_Store\nThumbs.db\n\n# Logs\n*.log\nnpm-debug.log*\n\n# Environment\n.env\n.env.*\n!.env.example\n\n# Dependencies\nnode_modules/\nvendor/\n\n# Build\ndist/\nbuild/\ncoverage/\n\n# Python\n__pycache__/\n*.pyc\n.venv/\nvenv/\n\n# IDE\n.vscode/\n.idea/\n\n\n## 20.6. Mẫu PULL_REQUEST_TEMPLATE.md\n\n\n## Summary\nMô tả ngắn gọn thay đổi.\n\n## Why\nVì sao cần thay đổi này?\n\n## Changes\n- \n- \n- \n\n## Testing\n- [ ] Tested locally\n- [ ] Added/updated tests\n- [ ] CI passed\n\n## Screenshots\nNếu có thay đổi UI, thêm ảnh ở đây.\n\n## Checklist\n- [ ] Code follows project conventions\n- [ ] No secrets committed\n- [ ] Documentation updated\n- [ ] Linked related issue\n\n\n## 20.7. Mẫu CONTRIBUTING.md\n\n\n# Contributing Guide\n\nCảm ơn bạn muốn đóng góp cho dự án.\n\n## Workflow\n\n1. Fork repository.\n2. Create a new branch.\n3. Make changes.\n4. Commit with clear messages.\n5. Push your branch.\n6. Open a Pull Request.\n\n## Branch naming\n\n- feature/short-description\n- bugfix/short-description\n- docs/short-description\n- chore/short-description\n\n## Commit message\n\nUse Conventional Commits:\n\n- feat: add new feature\n- fix: fix bug\n- docs: update documentation\n- refactor: improve code structure\n- test: add or update tests\n- chore: maintenance work\n\n## Pull Request\n\nPR should include:\n\n- Clear title.\n- Summary.\n- Testing notes.\n- Related issue.\n- Screenshots if needed.\n\n\n## 20.8. Mẫu CHANGELOG.md\n\n\n# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n## [Unreleased]\n\n### Added\n- \n\n### Changed\n- \n\n### Fixed\n- \n\n## [1.0.0] - YYYY-MM-DD\n\n### Added\n- Initial release.\n\n\n## 20.9. Câu hỏi phỏng vấn Git thường gặp\n\n\nCâu 1: Git khác GitHub như thế nào?\nTrả lời: Git là công cụ quản lý phiên bản chạy local. GitHub là nền tảng lưu trữ và cộng tác dựa trên Git.\n\nCâu 2: Git pull khác git fetch như thế nào?\nTrả lời: fetch tải thay đổi từ remote nhưng không merge. pull thường là fetch + merge hoặc fetch + rebase.\n\nCâu 3: Merge khác rebase như thế nào?\nTrả lời: merge gộp lịch sử và có thể tạo merge commit. rebase đặt lại nền commit giúp lịch sử tuyến tính nhưng có thể viết lại hash.\n\nCâu 4: Khi nào dùng revert thay vì reset?\nTrả lời: Khi commit đã public/shared, dùng revert để tạo commit đảo ngược mà không viết lại lịch sử.\n\nCâu 5: Staging area dùng để làm gì?\nTrả lời: Cho phép chọn thay đổi cụ thể để đưa vào commit.\n\nCâu 6: Conflict là gì?\nTrả lời: Là khi Git không tự gộp được thay đổi vì nhiều nhánh sửa cùng vùng code.\n\nCâu 7: Force push nguy hiểm thế nào?\nTrả lời: Nó có thể ghi đè lịch sử remote và làm mất commit của người khác.\n\nCâu 8: Làm sao xóa file khỏi Git nhưng giữ local?\nTrả lời: dùng git rm --cached file rồi thêm vào .gitignore.\n\nCâu 9: Detached HEAD là gì?\nTrả lời: Là trạng thái HEAD trỏ trực tiếp tới commit thay vì branch.\n\nCâu 10: Tag dùng để làm gì?\nTrả lời: Đánh dấu commit quan trọng, thường là phiên bản release.\n\n\n## 20.10. Kết luận\n\n\nGit và GitHub không chỉ là công cụ lưu code. Chúng là nền tảng của quy trình phát triển phần mềm hiện đại.\n\nHọc Git tốt không có nghĩa là nhớ mọi lệnh ngay lập tức. Điều quan trọng là hiểu mô hình:\n\nWorking Directory -> Staging Area -> Commit History -> Remote\n\nKhi hiểu mô hình này, bạn có thể suy luận được phần lớn tình huống thực tế.\n\nHãy luyện tập thường xuyên, tạo repo thật, tạo branch thật, tạo conflict thật và tự xử lý. Sau một thời gian, Git sẽ trở thành kỹ năng tự nhiên trong công việc hằng ngày.\n\n============================================================\nHẾT GIÁO TRÌNH\n============================================================'
    );

END $$;
