# # 1) Node 빌드 스테이지
# FROM node:18 AS builder

# # 빌드 아규먼트 선언
# ARG REACT_APP_IMP_CHANNEL_KEY
# ARG REACT_APP_NICE_CHANNEL_KEY
# ARG REACT_APP_PORTONE_CHANNEL_KEY

# # ENV로 설정 (CRA는 REACT_APP_ 접두어를 자동 인식)
# ENV REACT_APP_IMP_CHANNEL_KEY=$REACT_APP_IMP_CHANNEL_KEY
# ENV REACT_APP_NICE_CHANNEL_KEY=$REACT_APP_NICE_CHANNEL_KEY
# ENV REACT_APP_PORTONE_CHANNEL_KEY=$REACT_APP_PORTONE_CHANNEL_KEY

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .

# RUN npm run build  
# # /app/build 생성, REACT_APP_XXX 값을 번들에 삽입

# # 2) Nginx로 정적 파일 서빙
# FROM nginx:alpine
# COPY --from=builder /app/build /usr/share/nginx/html

# # (필요 시) Nginx 설정 커스터마이징
# # RUN rm /etc/nginx/conf.d/default.conf
# # COPY my-react.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# 1) Node 빌드 스테이지
FROM node:18 AS builder

# 빌드 아규먼트 선언
ARG REACT_APP_IMP_CHANNEL_KEY
ARG REACT_APP_NICE_CHANNEL_KEY
ARG REACT_APP_PORTONE_CHANNEL_KEY

# ENV 로 설정 (CRA는 REACT_APP_ 접두어로 시작하는 변수를 build 시점에 인식)
ENV REACT_APP_IMP_CHANNEL_KEY=$REACT_APP_IMP_CHANNEL_KEY
ENV REACT_APP_NICE_CHANNEL_KEY=$REACT_APP_NICE_CHANNEL_KEY
ENV REACT_APP_PORTONE_CHANNEL_KEY=$REACT_APP_PORTONE_CHANNEL_KEY

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./

RUN npm run build
FROM nginx:alpine

# 1) 빌드 결과물을 복사
COPY --from=builder /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY my-react.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
