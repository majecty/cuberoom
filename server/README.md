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

## test.cuberoom.net 실행하기

```sh
. ./cuberoom/bin/activate
CUBEROOM_ENV=staging python3 ./__init__.py
```

## prev.cuberoom.net 실행하기

```sh
. ./cuberoom/bin/activate
CUBEROOM_ENV=prev python3 ./__init__.py
```
