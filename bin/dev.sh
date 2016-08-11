#!/bin/bash
# trap killgroup SIGINT

killgroup(){
	echo killing...
	kill 0
}

loop(){
	echo $1
	sleep $1
	loop $1
}

APP_PATH=$(pwd) nodemon src/ &
NODE_ENV=DEVELOPMENT webpack --watch &
wait

# trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

# # launch webpack in the background to watch for changed files in the frontend code
# webpack --watch &

# # launch the node server
# nodemon /src --debug