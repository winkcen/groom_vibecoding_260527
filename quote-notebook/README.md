# 💡 바이브 코딩 입문자용 MVP 프로젝트 허브 (Groom)

> 본 저장소는 코딩 입문자를 위해 구성된 직관적이고 시각적 완성도가 높은 미니 웹 토이프로젝트들의 모음집입니다.
> 별도의 설치나 빌드 과정 없이 각 폴더 내의 `index.html` 파일을 더블클릭하여 바로 실행할 수 있습니다.

---

## 📂 프로젝트 목록

### 1. 💡 하루 한 줄 명언수첩 (`quote-notebook/`)
*   **소개**: 매번 다른 명언을 감상하고, 음성으로 듣고, 내 보관함에 영구 저장하는 웹수첩입니다.
*   **주요 기술**: HTML5, Vanilla CSS3, JavaScript (SpeechSynthesis API, LocalStorage, Custom Dialog)
*   **학습 테마**: 기초 DOM 제어, 로컬 브라우저 데이터 영구 관리, 테마 토글 및 오디오 인터렉션.
*   **실행 파일**: [quote-notebook/index.html](./quote-notebook/index.html)

### 2. ⚡ 즉석 밈 생성기 (`meme-generator/`)
*   **소개**: 템플릿 이미지 위에 자유롭게 글자를 드래그 배치하고 조절하여 나만의 유쾌한 짤방(Meme)을 만들고 내려받는 도구입니다.
*   **주요 기술**: HTML5, CSS3, JavaScript (Drag & Drop DOM API, html2canvas capture library)
*   **학습 테마**: **CSS Position (`relative`와 `absolute`)의 관계 실습**, 마우스/터치 좌표 변환 계산, 라이브 CSS 코드 뷰어 연동.
*   **실행 파일**: [meme-generator/index.html](./meme-generator/index.html)

---

## 🛠 공통 기술 스택

*   **Markup & Logic**: HTML5, Vanilla JavaScript (ES6+)
*   **Styling**: Pure CSS3 (HSL 컬러 토큰, 반응형 미디어 쿼리, Glassmorphism, Keyframe animations)
*   **Icons**: [Lucide Icons](https://lucide.dev/) (CDN 라이브러리 연동)

---

## 🚀 실행 및 테스트 방법

1. 저장소를 클론 또는 다운로드합니다.
2. 원하는 프로젝트 폴더(`quote-notebook` 또는 `meme-generator`)로 이동합니다.
3. 해당 폴더의 **`index.html`** 파일을 웹 브라우저에서 직접 더블클릭하여 실행합니다.
4. 모든 기능은 서버리스(Serverless) 클라이언트 단독 코드로 동작하므로 오프라인 환경에서도 안전하게 즐기실 수 있습니다.
