# 가상 안경 체험 웹앱

이 프로젝트는 사용자가 업로드한 얼굴 사진에 안경을 가상으로 착용해볼 수 있는 웹 애플리케이션입니다.

## 기능

- 얼굴 사진 업로드
- 안경 이미지 업로드
- MediaPipe를 사용한 얼굴 랜드마크 감지
- 안경 이미지의 자동 위치 조정 및 합성

## 기술 스택

### 백엔드
- Python
- Flask
- MediaPipe
- OpenCV
- NumPy

### 프론트엔드
- React
- Material-UI
- Axios
- React Dropzone

## 설치 및 실행

### 백엔드 설정
1. Python 가상환경 생성
```bash
python -m venv venv
```

2. 가상환경 활성화 (Windows)
```bash
venv\Scripts\activate
```

3. 필요한 패키지 설치
```bash
pip install -r requirements.txt
```

4. Flask 서버 실행
```bash
python app.py
```

### 프론트엔드 설정
1. 필요한 패키지 설치
```bash
npm install
```

2. 개발 서버 실행
```bash
npm start
```

## 사용 방법

1. 웹 브라우저에서 `http://localhost:3000` 접속
2. 얼굴 사진 업로드
3. 안경 이미지 업로드 (PNG 형식 권장)
4. "처리하기" 버튼 클릭
5. 결과 이미지 확인

## 주의사항

- 안경 이미지는 투명 배경(PNG)을 사용하는 것이 좋습니다.
- 얼굴 사진은 정면을 바라보는 사진을 사용하는 것이 좋습니다.
- 좋은 결과를 위해서는 적절한 조명이 있는 사진을 사용하세요. 