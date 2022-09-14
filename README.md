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

[👉 Swagger Docs 바로가기](https://app.swaggerhub.com/apis-docs/sys-ryan/shopping-mall_management_backend_service/1.0)

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
✔️ Readme.md 작성  
✔️ Unit test 수행   
✔️ e2e test 수행      
✔️ 배포  //작업중   

# 테스트  

## Unit Test

### 테스트 커버리지

#### Orders Service (주문)

- 주문 생성 기능 검증
- 주문 목록 조회 기능 검증
- 주문 조회 기증 검증
- 주문 상태 변경 기능 검증

#### Deliveries Service (배송)

- 주문 발송 처리(배송 정보 생성) 기능 검증
- 배송 상태 업데이트 (배송 중, 배송 완료) 기능 검증
- 배송 목록 조회 기능 검증

#### Coupons Service (쿠폰)

쿠폰 타입

- 쿠폰 타입 생성 기능 검증  

쿠폰

- 쿠폰 코드 발급 기능 검증
- 사용 처리 기능 검증 (이미 사용되었을 경우 throws exception)
- 사용 처리 기능 검증 (쿠폰이 만료되었을 경우 throws exception)
- 사용 처리 기능 검증 (존재하지 않는 쿠폰 코드를 사용하는 경우 throws exception)  

### 테스트 결과

#### Orders Service (주문)
<img width="838" alt="스크린샷 2022-09-14 오후 11 37 30" src="https://user-images.githubusercontent.com/63445753/190185588-5a630325-5ab0-42e9-b630-a93234dca155.png">


#### Deliveries Service (배송)
<img width="834" alt="스크린샷 2022-09-14 오후 11 37 56" src="https://user-images.githubusercontent.com/63445753/190185626-ff7c5226-c393-484c-8335-7e2d1af9465c.png">


#### Coupons Service (쿠폰)
<img width="744" alt="스크린샷 2022-09-14 오후 11 39 44" src="https://user-images.githubusercontent.com/63445753/190185685-f0d67a20-0840-4b7e-bb47-5f7e67cc5b2f.png">  

<img width="909" alt="스크린샷 2022-09-14 오후 11 39 06" src="https://user-images.githubusercontent.com/63445753/190185706-d3a9c85c-51d9-497e-8ef0-23407bf87408.png">

## e2e Test

### 테스트 커버리지

#### 주문 내역

- 주문 내역 열람 기능 검증
- 주문 내역 검색 기능 검증 (by 주문 상태)
- 주문 내역 검색 기능 검증 (by 시작일자, 종료일자)
- 주문 내역 검색 기능 검증 (by 주문자 명)
- 주문 내역 검색 기능 검증 (by 국가코드)

#### 쿠폰

- 쿠폰 타입 목록 조회 기능 검증 (쿠폰 타입별 사용 횟수, 쿠폰 타입별 총 할인액 정보를 포함해야 함)
- 쿠폰 사용에 따른 할인 적용 기능 검증 (배송비 할인) // == 구매 내역 추가 테스트
- 쿠폰 사용에 따른 할인 적용 기능 검증 (상품 가격 정액 할인) // == 구매 내역 추가 테스트
- 쿠폰 사용에 따른 할인 적용 기능 검증 (상품 가격 % 할인) // == 구매 내역 추가 테스트

### 테스트 결과

#### 주문 내역

<img width="840" alt="스크린샷 2022-09-14 오후 11 43 41" src="https://user-images.githubusercontent.com/63445753/190187321-838dc96b-1403-4a49-ba2c-da66c4169ba7.png">

#### 쿠폰

<img width="829" alt="스크린샷 2022-09-14 오후 11 47 08" src="https://user-images.githubusercontent.com/63445753/190187435-855d7edc-cdd3-4d89-a65e-d62ed9b39384.png">

# 서비스 배포 

<img width="1192" alt="스크린샷 2022-09-15 오전 12 12 56" src="https://user-images.githubusercontent.com/63445753/190193882-9bb294f0-475b-4058-bd33-89bb5b08c5aa.png">

<img width="1192" alt="스크린샷 2022-09-15 오전 12 11 33" src="https://user-images.githubusercontent.com/63445753/190193671-25c1df88-8717-4326-8b0d-5d15e788ef48.png">

