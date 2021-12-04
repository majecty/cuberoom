
COMMIT_HASH=`ssh cuberoom "(cd releases/test.cuberoom.net; git rev-parse HEAD)"`
echo commit hash $COMMIT_HASH
git reset --hard $COMMIT_HASH

ssh cuberoom "(cd releases/test.cuberoom.net; git restore --staged .)"
ssh cuberoom "(cd releases/test.cuberoom.net; git diff)" | git apply
(cd client; yarn)
(cd client; yarn run build)
scp client/public/static/build/* cuberoom:~/releases/test.cuberoom.net/client/public/static/build/
