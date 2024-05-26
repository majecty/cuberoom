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

## 프론트엔드 배포

모든 static 파일 배포(1번만 하면 됨)

```sh
cd client/public
aws s3 sync . s3://cuberoom
```

character-resource 제외 배포

```sh
cd client/public
aws s3 sync . s3://cuberoom --exclude 'static/character-resource
```

배포 자동화 스크립트

```sh
# 주의사항: character-resource 빼는 것 안들어가있음.
# 주의사항: updated at 기준으로 바뀐 것만 찾아서 deploy
go run scripts/deploy-client/deployClient.go
```
