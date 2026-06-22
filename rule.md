### Agentic Player 10 공모전

1. [Agentic Player 10](https://b.kakao.com/views/PlayMCP/AGENTIC_PlAYER_10)은 직접 개발한 MCP서버를 PlayMCP에 등록하여 참가하는 공모전입니다.
2. 공모전 예선 참가를 위해서는 반드시 카카오 클라우드가 제공하는 PlayMCP in KC(MCP 서버 배포 서비스)를 이용하여 MCP 서버를 등록해야 합니다.
3. 공모전은 2026년 6월 15일부터 7월 14일까지 예선 응모를 할 수 있으며, 공모전에 관한 자세한 일정은 [**공모전 페이지**](https://b.kakao.com/views/PlayMCP/AGENTIC_PlAYER_10)에서 확인해 주세요.

## 공모전 참가 진행 순서

아래 순서를 차례로 진행하여 공모전 예선에 참여하세요.

### 1. MCP 서버 개발

1. **반드시 [PlayMCP에서 제공하는 개발가이드](https://kko.to/PlayMCPdevguide)를 준수하여 MCP 서버를 개발합니다.**
2. 처음 개발은 로컬 환경에서 진행하시는 것을 추천합니다.
3. 로컬 환경에서 모든 테스트 및 개발을 완료합니다.

### 2. PlayMCP in KC 에서 MCP 서버 배포

1. 카카오는 Agentic Player 10 예선 참가를 하실때 사용할 수 있는 MCP 서버 클라우드를 무상으로 제공합니다.
2.  [PlayMCP in KC 이용 가이드](https://www.notion.so/3749b97b488880a58d90ff614ea361d4?pvs=21)를 참고하여 MCP Endpoint URL 을 획득합니다.
    1. MCP 서버 클라우드는 PlayMCP in KC 라는 별도 서비스를 통해 이용하실 수 있습니다.
    2. [Git 소스](https://www.notion.so/Git-MCP-3749b97b4888809d8f07eb0f008a252c?pvs=21) 또는 [컨테이너 이미지](https://www.notion.so/MCP-3749b97b488880a18f73f5871a314a98?pvs=21)로 MCP서버를 생성할 수 있습니다.

### 3. PlayMCP에 MCP 서버 등록

1. [PlayMCP](https://playmcp.kakao.com/)에 회원 가입 및 로그인 합니다.
2. [개발자 콘솔](https://playmcp.kakao.com/console)에서 “새로운 MCP 서버 등록”을 클릭하여 정보를 입력합니다.
    1. MCP Endpoint 항목에 PlayMCP in KC에서 발급된 Endpoint URL을 입력한 후 “정보 불러오기”를 클릭합니다.
    2. 이때 정보 불러오기가 성공해야 합니다. 만약 실패하였다면 개발한 MCP에 문제가 있는 것입니다.
3. **정보 입력 후 반드시 “임시 등록”을 클릭합니다. (지금은 ”등록 및 심사요청”을 클릭하지 마세요.)**
    
    ![image.png](attachment:e96d8a88-6c73-48ce-a243-66a3a6cfe645:image.png)
    
4. 임시등록된 상태에서 “MCP 상세 미리보기”를 눌러 나오는 팝업에서 “도구함에 추가”를 눌러 도구함에 담습니다.
    
    ![image.png](attachment:57bc153b-a878-4d63-a1fa-e44e1ec5ac6b:image.png)
    
    ![image.png](attachment:89267ed7-f4b9-44fd-bcff-f38d94233302:image.png)
    
5. PlayMCP에서 제공하는 AI채팅을 통해 충분히 테스트 합니다.
6. 모든 테스트가 완료되면 임시 등록 상태의 MCP를 “심사 요청”을 클릭하여 심사 요청합니다.
    
    ![image.png](attachment:e6487153-2443-4106-aef2-eecbc524ff46:image.png)
    

### 4. PlayMCP 심사 진행 후 공개

1. 심사 요청 후 보통 심사 완료까지 통상 영업일 기준 1~2일이 소요됩니다. (최대 영업일 기준 7일까지 소요될 수 있습니다.)
2. 심사가 반려되면 반려 사유와 함께 반려 이메일이 발송됩니다.
    1. 이때 이메일은 카카오계정의 대표이메일로 발송됩니다. 대표 이메일은 PlayMCP에서 “프로필 → 설정 → 내 정보 관리 → 연결된 이메일”에서 확인하실 수 있습니다.
    2. 반려가 되면 다시 임시 저장 상태가 됩니다. 반려 사유를 처리한 후 다시 “심사 요청”을 합니다.
3. 심사가 승인 되면 승인 메일이 발송 됩니다.
    1. PlayMCP 개발자 콘솔에서 MCP 상세 정보를 보시면 공개 상태가 “나에게만 공개”로 되어 있습니다.
    2. 공개 상태를 “전체 공개”로 전환해 주세요.
    3. 심사가 승인되고 전체 공개된 내 MCP의 상세페이지로 이동한 후 브라우저 주소창의 주소를 복사해 주세요. (ex. https://playmcp.kakao.com/mcp/12345678901234567)

### 5. 공모전 페이지에서 비즈폼을 이용해 예선 접수

1. [Agentic Player 10 공모전 페이지](https://b.kakao.com/views/PlayMCP/AGENTIC_PlAYER_10)로 이동합니다.
2. 공모전 페이지에서 “Player 예선 참여” 버튼을 클릭해 접수 양식을 작성하여 접수 완료 합니다.
    1. 접수 양식에서 2개까지의 MCP서버를 등록하여 참여할 수 있습니다.
3. 공모전 진행에 관해 궁금하신 사항은 [카카오 고객센터](https://cs.kakao.com/)로 문의하여 주시기 바랍니다.

PlayMCP in KC는 카카오 클라우드가 제공하는 MCP 서버 배포 서비스입니다. 

공모전 참가작에 한해 한시적으로 무상으로 지원하며 아래 유의사항을 반드시 지켜야 합니다.

## PlayMCP in KC 이용 유의사항

- PlayMCP in KC는 Agentic Player 10 공모전 참가를 위해 예선 접수 기간인 2026년 6월 15일 ~ 7월 14일에만 MCP 서버 발급이 가능합니다.
    - MCP 서버 발급 후 PlayMCP에 등록하여 심사 진행을 해야하므로 충분히 날짜에 여유를 두고 미리 MCP 서버 발급을 받으시길 바랍니다.
- PlayMCP in KC에 등록하여 발급받은 MCP Endpoint URL 로 PlayMCP 에 등록해야 공모전 참여가 가능합니다.
- PlayMCP in KC에 등록된 MCP 서버는 일정 기간동안만 지원되며, 공모전 종료 후 일정 기간 유지 후 무상 지원이 종료될 예정입니다. 무상 지원 종료 후에는 별도 과금을 통해 계속 유지(사업자에 한함) 하거나 다른 클라우드 서비스로 MCP 서버를 옮기길 수 있습니다. 무상 지원 종료 일정은 추후 다시 공지 드리겠습니다.
- **발급받은 MCP 서버를 공모전 참가가 아닌 다른 용도로 사용하거나 공모전 예선에 접수하지 않은 경우 임의로 회수 조치될 수 있습니다.**
- PlayMCP in KC는 PlayMCP 회원에 한해서만 이용할 수 있으며, 계정당 2대의 MCP서버를 등록할 수 있습니다.

## 개발 참고 사항

- Agentic Player 10은 MCP 서버를 개발할 수 있는 능력과 우수한 아이디어를 갖는 출품작을 수상하는 공모전입니다.
- PlayMCP in KC의 오류 사항 외에 **MCP 개발 진행시 발생하는 이슈 해결에 관해서는 별도 문의를 받거나 도움을 드리지 않고 있습니다.**
- 공모전 진행이나 PlayMCP in KC 이용에 관한 문의 사항은 카카오 고객센터로 문의해 주세요.

## 서버 등록하는 방법
PlayMCP in KC에 MCP 서버를 등록하는 방법 중 컨테이너 이미지를 활용한 등록 방법을 설명합니다.

내가 개발한 MCP 서버를 Docker 이미지로 제작 후 레지스트리에 등록한 후 사용합니다.

아래 순서대로 진행하여 개발하신 MCP서버를 등록하여 URL Endpoint를 받으면 완료입니다.

## 1. PlayMCP in KC 진입

1. 브라우저에서 https://playmcp.kakaocloud.io 로 진입합니다.
2. 카카오 계정 비로그인 상태에서는 로그인을 완료해야만 사이트에 진입할 수 있습니다. 이때 로그인 하는 계정은 PlayMCP 에 가입된 회원의 카카오 계정이어야 합니다.
3. 로그인을 완료하면 아래와 같이 PlayMCP in KC의 홈이 보입니다.

!image.png

## 2. 새 MCP 서버 등록

⚠️ 이미지는 linux/amd64 아키텍처로 빌드해야 합니다. Apple Silicon Mac에서는 `docker build --platform linux/amd64 …` 옵션을 사용하세요. arm64 이미지는 서버 활성화에 실패합니다.

1. “+ 새 MCP 서버 등록” 버튼을 클릭하여 “이미지 등록”을 선택합니다.
    
    !image.png
    

1. 이미지 등록 팝업이 뜨면 각 항목을 입력합니다.
    
    !image.png
    
- **MCP 서버 이름** : PlayMCP in KC 에 보여질 MCP 서버 이름을 입력합니다. 이 이름은 PlayMCP와 무관합니다.
- **설명** : PlayMCP in KC 에 보여질 MCP 서버 설명을 입력 합니다. 이 설명은 PlayMCP와 무관합니다.
- **Registry 호스트** : 이미지 파일이 올려져 있는 레지스트리의 호스트 정보를 입력합니다. 도커의 경우 docker.io 이고, 깃헙은 ghcr.io 입니다. 사용하시는 이미지 레지스트리에 따라 상이하니, 사용 중인 레지스트리에서 정보를 확인하세요.
- **Registry 사용자 :** 이미지를 등록한 레지스트리가 public이 아닌 private 인 경우 입력합니다. 레지스트리마다 사용하는 Registry 사용자 이름이 다르니 사용 중인 레지스트리에서 확인하세요.
- **Registry 비밀번호** : 이미지를 등록한 레지스트리가 public이 아닌 private 인 경우 입력합니다. 레지스트리마다 사용하는 Registry 비밀번호가 다르니 사용 중인 레지스트리에서 확인하세요.
- **image_name** : 레지스트리에 등록되어 있는 이미지의 이름을 입력합니다.
- **image_tag** : 이미지 버전을 입력하시면 됩니다.

## 3. 서버 활성화 및 완료

1. ‘이미지 등록’ 팝업에서 정보를 정상적으로 입력 후 ‘등록하기’를 클릭하면 서버 등록을 시작합니다. Status : **Starting** 이라고 나오면 잠시 기다립니다. 짧게는 수십 초 길게는 수 분까지 소요될 수 있습니다.
    
    !image.png
    
2. 서버 등록이 정상적으로 완료되면 Status가 **Active** 로 바뀝니다.
    
    !image.png
    
3. Active 된 서버를 클릭하여 상세 정보를 확인합니다.
    1. 상세 정보에 보시면 Endpoint URL이 있습니다. 이 URL을 복사하여 PlayMCP에 등록할 때 사용하면 됩니다.
    2. ‘중지’ 버튼을 이용해 서버를 일시 중지 시키거나, ‘삭제’ 버튼으로 서버를 삭제할 수도 있습니다.(삭제 후에는 되돌릴 수 없으니 신중히 선택해 주세요)
    3. MCP 서버는 총 2개까지 등록할 수 있습니다.

    PlayMCP in KC에 MCP 서버를 등록하는 방법 중 Git 소스를 활용한 등록 방법을 설명합니다.

내가 개발한 MCP 서버의 소스코드가 GitHub 같은 Git 저장소에 올려져 있을 때 사용합니다.

아래 순서대로 진행하여 개발하신 MCP서버를 등록하여 URL Endpoint를 받으면 완료입니다.

## 1. PlayMCP in KC 진입

1. 브라우저에서 https://playmcp.kakaocloud.io 로 진입합니다.
2. 카카오 계정 비로그인 상태에서는 로그인을 완료해야만 사이트에 진입할 수 있습니다. 이때 로그인 하는 계정은 PlayMCP 에 가입된 회원의 카카오 계정이어야 합니다.
3. 로그인을 완료하면 아래와 같이 PlayMCP in KC의 홈이 보입니다.

!image.png

## 2. 새 MCP 서버 등록

1. “+ 새 MCP 서버 등록” 버튼을 클릭하여 “Git 소스 빌드”를 선택합니다.
    
    !image.png
    
2. Git 소스 빌드 팝업이 뜨면 각 항목을 입력합니다.
    
    !image.png
    
- **MCP 서버 이름** : PlayMCP in KC 에 보여질 MCP 서버 이름을 입력합니다. 이 이름은 PlayMCP와 무관합니다.
- **설명** : PlayMCP in KC 에 보여질 MCP 서버 설명을 입력 합니다. 이 설명은 PlayMCP와 무관합니다.
- **Git URL** : Git 소스코드가 올려져 있는 저장소의 주소를 입력합니다. 저장소 루트(또는 지정한 Dockerfile 경로)에 Dockerfile이 반드시 포함되어 있어야 합니다.
- **브랜치 / ref :** 특별한 브랜치를 지정할 때 사용합니다. 보통은 main 을 사용합니다.
- **Dockerfile 경로 (선택)** : Dockerfile 경로가 기본 위치가 아닌 경우 입력합니다. 보통은 Dockerfile 로 두시면 됩니다.
- **PAT (선택)** : 깃 저장소(깃헙)가 public이 아닌 private 이라면 Personal Access Token 을 입력해야 합니다. 깃헙 기준으로 깃헙에서 "프로필 -> Settings -> Developer settings -> Personal access tokens"에서 토큰을 발급받으실 수 있습니다. PAT 발급 위치는 깃 저장소마다 다르므로 사용 중에 깃 저장소를 참고하세요. private이 아닌 public 저장소라면 비워두시면 됩니다.

## 3. 서버 활성화 및 완료

1. ‘Git 소스 빌드’ 팝업에서 정보를 정상적으로 입력 후 ‘등록하기’를 클릭하면 서버 등록을 시작합니다. Status : **Starting** 이라고 나오면 잠시 기다립니다. 짧게는 수십 초 길게는 수 분까지 소요될 수 있습니다.
    
    !image.png
    
2. 서버 등록이 정상적으로 완료되면 Status가 **Active** 로 바뀝니다.
    
    !image.png
    
3. Active 된 서버를 클릭하여 상세 정보를 확인합니다.
    1. 상세 정보에 보시면 Endpoint URL이 있습니다. 이 URL을 복사하여 PlayMCP에 등록할 때 사용하면 됩니다.
    2. ‘중지’ 버튼을 이용해 서버를 일시 중지 시키거나, ‘삭제’ 버튼으로 서버를 삭제할 수도 있습니다.(삭제 후에는 되돌릴 수 없으니 신중히 선택해 주세요)
    3. MCP 서버는 최대 2개까지 등록할 수 있습니다.