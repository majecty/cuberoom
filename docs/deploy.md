# 배포

큐브룸은 아마존의 서버 한 대에 배포되어 있습니다.

## 서버에 접속하기

다음 설정을 ~/.ssh/config 파일에 저장합니다.

```
Host cuberoom
    HostName 54.180.193.88
    User ubuntu
    IdentityFile ~/.ssh/cuberoom.pem
    Port 22
```

이후에는 `ssh cuberoom`으로 접속합니다.

## 서버 환경 안내

### cuberoom-{a,b,c}와 releases디렉토리

접속하면 cuberoom-a, cuberoom-b, cuberoom-c, releases 디렉토리가 있습니다.
releases에 들어가면 cuberoom.net, prev.cuberoom.net, test.cuberoom.net의 소프트 링크가 있습니다.
이들은 각각 cuberoom-a, cuberoom-b, cuberoom-c 중 하나에 연결되어 있습니다.
(test.cuberoom.net은 테스트가 필요할 때만 만들기 때문에 없을 수 있습니다.)

cuberoom.net에는 https://cuberoom.net에 일반 유저들이 접속할 때 사용하는 코드와 리소스가
있습니다. prev.cuberoom.net에는 이전 버전의 코드와 리소스가 있습니다. cuberoom.net에서
발견된 문제가 이전 버전에 존재했는지 찾기 위해 사용합니다. test.cuberoom.net에는
cuberoom.net에 올라가기 전의 버전의 코드와 리소스를 둡니다. 며칠 두고 문제가 없는지 확인한 뒤
cuberoom.net으로 올립니다.

test.cuberoom.net -> cuberoom.net으로 옮기거나, cuberoom.net -> prev.cuberoom.net으로 옮길 때에는
releases 디렉토리에 있는 소프트 링크가 가리키는 곳만 바꿉니다. 그 뒤 서버를 적절한 env 옵션울 주어
다시 켭니다.

### nginx

서버에서는 nginx가 모든 요청을 받아서 적절한 서버로 배분합니다. static 파일들의 경우 nginx가 직접
static 파일들을 서빙합니다. nginx의 static 서빙은 /home/ubuntu/releases/ 디렉토리를 통해서 서빙합니다.
파이썬 서버로 가는 요청들은 리버시 프록시를 사용하여 로컬호스트에서 listen하는 서버로 요청을 보내줍니다.


## 버전 관리

client/package.json 파일에 있는 버전을 수정하면 서버, 클라 모두에 적용됩니다.
