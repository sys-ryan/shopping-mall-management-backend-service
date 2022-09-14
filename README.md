# 제품 쇼핑몰 관리 페이지 Backend 서비스 

| 👉 목차                            |                                        |
| ---------------------------------- | -------------------------------------- |
| [1. 요구사항 분석](#요구사항-분석) | 각 요구사항 분석                       |
| [2. API 명세서](#API-명세서)       | swagger url                            |
| [3. 구현 과정](#구현-과정)         | 기술스택, 모델링, 폴더 구조, 작업 내역 |
| [4. 테스트](#테스트)               | 각 서비스 unit test / e2e test                   |
| [5. 서비스 배포](#서비스-배포)     | service url 및 배포 화면                          |

관리자가 관리 페이지에서 제품 주문 관리를 할 수 있도록 여러가지 기능을 제공하는 백엔드 서비스 입니다. 제품 주문 내역을 열람하거나 주문상태, 시작일자, 종료일자에 따른 필터, 주문자 명으로 검색등 검색시 다양한 필터를 제공하고 주문에 대한 발송 처리도 가능합니다. 제품을 배송처리 하고 제품의 배송 상태를 배송 중, 배송 완료 등으로 수정 가능합니다.     
또한 해당 서비스는 쿠폰 서비스도 제공합니다. 쿠폰 관리를 위해 새로운 쿠폰 타입(배송비 할인, % 할인, 정액 할인)을 신설하거나, 특정 신규 쿠폰 코드를 발급할 수 있습니다. 발급된 쿠폰의 사용 내역 열람시 쿠폰 타입 별 사용 횟수와 총 할인액을 함께 제공합니다. 주문 생성 시 발급된 쿠폰 코드를 함께 제출하면 쿠폰 사용에 따른 할인이 적용되어 주문이 생성됩니다. 주문 정보는 `기존 가격`, `할인 받은 금액`, `할인 후 가격`, `기존 배송비`, `할인 받은 배송비 금액`, `할인 후 배송비` 등 쿠폰 적용 전/후의 상세한 가격 변화 정보를 유지합니다.  
배송비는 배송 국가가 한국이 아닌 경우, 실시간 원-달러 환율 정보 API를 통해 실시간 환율 정보를 반영한 달러 배송비로 변환하여 저장합니다. 


# 요구사항 분석

## 1. 주문 내역 관리

- 주문 내역 열람 기능을 제공한다. 

- 주문  내역 검색 기능을 제공한다.
	- 주문 상태별 검색
	- 시작일자, 종료일자에 따른 주문 내역 검색
	- 주문자 명으로 검색
	- 주문자 도시 명으로 검색
	
- 주문에 대한 발송 처리 기능을 제공한다.


## 2. 쿠폰 관리
- 새로운 쿠폰 타입을 생성하는 기능을 제공한다. 
	- 정액 할인 타입
	- % 할인 타입
	- 배송비 할인 타입

- 특정 쿠폰 타입에 대한 쿠폰 코드를 발급하는 기능을 제공한다. 

- 쿠폰 사용 내역 열람 기능을 제공한다.
	- 쿠폰 타입별 사용 횟수
	- 쿠폰 타입별 총 할인액

- 주문 생성시 쿠폰을 사용하면 할인을 적용한다.

## 3. 배송 관리 

- 제품 배송 상태 업데이트 기능을 제공한다.
	- 배송 중
	- 배송 완료

- 구매 국가 ,구매 갯수에 따른 배송비를 적용한다. 
	- 달러 단위 배송인 경우 현재 원-달러 환율을 가져와서 배송비에 적용한다. 

## 4. 테스트 코드 작성
- 요구사항에 맞는 테스트코드를 작성한다. 


# API 명세서

swagger를 사용하여 제작한 API Docs

[👉 Swagger Docs 바로가기]() // TODO: 작업중

# 구현 과정  

## 기술 스택

- Framework: `NestJS`
- Database: `AWS RDS - mysql`
- ORM: `TypeORM`

## 환경 세팅

### 모델링

> 데이터베이스는 AWS RDS - mysql로 생성했습니다.

![shopping-mall-management-backend-service (3)](https://user-images.githubusercontent.com/63445753/190066303-454ee49f-1a00-4df9-a167-6827ba18a37e.png)


### 폴더 구조

```
shopping-mall-management-backend-service/
├─ src/
│  ├─ common/
│  ├─ database/
│  ├─ resources/
│  │  ├─ countries/
│  │  ├─ coupon_types/
│  │  ├─ deliveries/
│  │  ├─ coupons/
│  │  ├─ delivery_costs/
│  │  ├─ orders/
│  │  ├─ users/
│  ├─ app.module.ts
│  ├─ app.controller.ts
│  ├─ app.service.ts
│  ├─ main.ts
├─ test/
```

resources 폴더 내에 백엔드 서비스에 필요한 리소스들을 기준으로 폴더로 나누고, DTO 및 Entity를 작성하여 테이블 생성
- countries : 국가 명, 국가 코드 리소스
- coupon_types : 쿠폰 타입 리소스
- coupons : 쿠폰 리소스
- deliveries : 배송 리소스
- delivery_costs : 배송비 리소스
- orders : 주문 리소스
- users : 주문자(사용자) 리소스

각 리소스 폴더에 module, controller, service가 정의되어 있음  

database: 데이터베이스 리소스 

common: enum, type 등 프로젝트에서 공통으로 사용되는 파일 저장

test: e2e 테스트


## 작업 내역  

✔️ 서버 초기 세팅  
✔️ orders 생성(쿠폰 X), 조회 기능 구현  
✔️ Coupon Type 관련 기능 구현    
✔️ 쿠폰 기능 구현 및 order 추가 기능 구현    
✔️ Users API 구현   
✔️ Delivery API 구현  
✔️ KR 이 아닌 경우 배송비 실시간 환율 처리  
✔️ 프로젝트 리펙토링  
✔️ Readme.md 작성  (작업중) 
✔️ Unit test 수행 (작업중)
✔️ e2e test 수행  //작업중  
✔️ 배포  //작업중 

# 테스트  

## Unit Test

### 테스트 커버리지

<!--#### Weather service

- 날씨 정보를 Weather API로부터 fetch 하는지 검증 (fetchWeather)
- 날씨 정보를 정상적으로 저장하는지 검증 (saveCurrentWeather)

#### Posts service

- 게시글 생성

  - 게시글 생성 성공 검증 (날씨 정보 포함 확인)
  - 게시글 생성시 비밀번호 암호화 검증

- 게시글 조회

  - 게시글 리스트 조회 성공 검증
  - 게시글 조회 성공 검증
  - 존재하지 않는 게시글 id로 조회시 Exception 검증

- 게시글 수정

  - 게시글 수정 성공 검증
  - 존재하지 않는 게시글 id로 수정시 Exception 검증

- 게시글 삭제
  - 게시글 삭제 성공 검증
  - 존재하지 않는 게시글 id로 삭제시 Exception 검증
-->
### 테스트 결과

<!--#### Weather service

<img width="534" alt="스크린샷 2022-09-07 오후 7 14 35" src="https://user-images.githubusercontent.com/63445753/188853738-7496f78c-1662-4bf3-a7fa-ba001976abec.png">

#### Posts Service

<img width="615" alt="스크린샷 2022-09-07 오후 7 15 05" src="https://user-images.githubusercontent.com/63445753/188853775-ee31388a-cbea-41ad-a682-4de0f8c60b3a.png">

-->

## e2e Test

### 테스트 커버리지

<!--- 게시글 저장

  - title, content에 이모지 저장 검증
  - title 20자 이상일 경우 생성 실패 검증
  - content 200자 이상일 경우 생성 실패 검증
  - 비밀번호 정책 (6자이상 숫자 1개이상 반드시 포함) 위반시 생성 실패 검증

- 게시글 조회

  - 게시글 리스트 조회시 default pagenation option 적용 검증

- 게시글 수정

  - 잘못된 비밀번호로 게시글 수정 요청시 exception 검증

- 게시글 삭제
  - 잘못된 비밀번호로 게시글 삭제 요청시 exception 검증-->

### 테스트 결과

<!--<img width="795" alt="스크린샷 2022-09-07 오후 7 13 36" src="https://user-images.githubusercontent.com/63445753/188853406-7738688e-b796-4a26-ad48-cecf627fe0a9.png">-->

# 서비스 배포 

> 배포 url

👉 <!--https://posts-with-weather-service.herokuapp.com/api/v1--> // TODO: 배포 Url

// TODO: 배포 캡쳐 이미지
