If running locally:

1. Fill in .env.copy file
2. Run yarn start
* If running on windows - change 
"build": "yarn build-linux ...
to "build": "yarn build-win ...

If deploying to heroku - look at ![Cloud Fullstack](https://github.com/SanariSan/cloud-fullstack) which is meant for deployment


# env variables go to docker-compose either from .env or from preceding parameters in cli
# so with local development we can afford to write secrets to .env directly and run `docker-compose up`
# while with deployment prepare prod.env file with common vars + github secrets that will be passed as
# preceding parameters and since they are missing in .env file they will appear as intended
