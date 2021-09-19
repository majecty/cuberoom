# cuberoom_server

## 설정하기

### python 환경 설정

환경을 격리하기 위하여 virtualenv를 사용한다.

서버 디렉토리에서 다음 코드를 실행한다.

```sh
virtualenv cuberoomenv
. ./cuberoomenv/bin/activate
pip3 install -r ./requirements.txt
```

라이브러리 설치가 다 끝났다면 `deactivate`를 실행하여 virtualenv를 끈다.

### static 파일 다운로드

[이 링크](https://drive.google.com/file/d/1SpdvHijLMv_3o_LdN0QXbusHVzrcsBEN/view)에서 static 파일들을 다운받아서 압축을 푼다.
프로젝트 루트로부터 server/static 위치에 이미지 파일들이 위치해야 한다.

## 로컬에서 실행하기

```sh
. ./cuberoom/bin/activate
CUBEROOM_ENV=local python3 ./__init__.py
```

## 프로덕션 실행하기

```sh
. ./cuberoom/bin/activate
CUBEROOM_ENV=production python3 ./__init__.py
```

http://cuberoom.net
~ November

## Client 
https://github.com/leegakyeong/cuberoom

## nginx + uWSGI + Flask
### nginx

### uWSGI

### Flask


## AWS



