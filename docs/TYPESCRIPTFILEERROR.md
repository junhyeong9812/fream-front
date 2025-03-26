TypeScript: Restart TS Server - 문제 해결 가이드
개요
TypeScript: Restart TS Server는 Visual Studio Code에서 TypeScript 언어 서버를 재시작하는 기능입니다. 이는 TypeScript 관련 문제를 해결하는 간단하고 효과적인 방법입니다.
발생 상황

파일 이름 변경 후 TypeScript 인식 오류
Import 경로 문제
대소문자 불일치로 인한 파일 인식 문제
TypeScript 언어 서버의 캐시 또는 상태 불일치

해결 방법

1. 실행 방법

VS Code에서 Ctrl+Shift+P (Windows/Linux) 또는 Cmd+Shift+P (Mac)
"TypeScript: Restart TS server" 입력 및 선택

2. 단축키

직접적인 단축키는 없지만, 명령 팔레트를 통해 빠르게 실행 가능

작동 원리

TypeScript 언어 서버를 완전히 종료하고 다시 시작
현재 열려있는 프로젝트의 TypeScript 상태를 초기화
캐시된 파일 정보와 import 상태 재설정

주요 해결 사례

파일 이름 대소문자 변경 후 인식 문제
Import 경로 오류
타입 선언 파일 인식 문제
코드 완성 및 오류 표시 문제

예방 및 대안

1. 파일 명명 규칙

일관된 파일 이름 대소문자 사용
TypeScript 프로젝트에서 명확한 명명 규칙 수립

2. tsconfig.json 설정

```
   {
   "compilerOptions": {
   "forceConsistentCasingInFileNames": true
   }
   }
```

3. 정기적인 관리

프로젝트 종속성 정리
Node modules 재설치
TypeScript 버전 업데이트

주의사항

빈번한 서버 재시작은 성능에 영향을 줄 수 있음
지속적인 문제는 근본 원인 파악 필요

문제 해결 흐름

파일 이름/경로 확인
Import 문 검토
TypeScript 서버 재시작
여전히 문제 지속 시 프로젝트 종속성 재설치

결론
TypeScript: Restart TS Server는 간단하지만 강력한 문제 해결 도구입니다. 개발 중 발생하는 일시적인 TypeScript 관련 문제를 빠르게 해결할 수 있습니다.
