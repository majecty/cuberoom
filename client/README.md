# Cuberoom client

## 프로젝트 셋업하기

### 라이브러리 설치

다음 명령어로 필요한 라이브러리들을 설치합니다.

```sh
yarn
```

### static파일 설치 

[이 링크](https://drive.google.com/file/d/1SpdvHijLMv_3o_LdN0QXbusHVzrcsBEN/view)에서 static 파일들을 다운받아서 압축을 푼다.
프로젝트 루트로부터 client/public/static/character-resource 위치에 skinX_hairX... 디렉토리들이 위치해야한다.


## 로컬에서 실행하기

```sh
yarn run dev
```

## lint 돌리기

```sh
# 린트 돌리기
yarn run eslint

# 파일이 수정될 때마다 린트 돌리기
yarn run eslint-watch
```

## 배포용 빌드하기

다음 명령어를 사용하여 빌드한다.
빌드한 결과물은 client/public에 포함되어 있으며
프로덕션에서는 client/public 에 있는 파일들을 서빙한다. 

```sh
yarn run build
```

