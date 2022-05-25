/*let nm :string = 'kim'; //변수의 type지정
//number,boolean,null,undefined,bigint,[],{}...
let last :string[] = ['kim','park'] //array type 지정
let obj :{name:string} = {name:'kim'}
let both :string|number = 123;//Union type
type Mytype = string | number; //type을 변수에 지정(보통 대문자로)

function test(e :number) :number{//함수에 type지정(괄호안은 받는 변수 type) 그 밖은 return할 변수 type
    return e * 3
}
type Member = [number,boolean]; //tuple type
let joo :Member = [123,true]

type People={
    [key :string] : string //[모든 object속성] = 글자로된 모든 object 속성 type 은 string
}
let john :People={ name:'kk' }

class User{
    name :string;
     constructor(name :string){
        this.name=name;
     }
}*/
var nm = 'kim';
var age = 24;
var mar = false;
var member = ['kim', 'park'];
var people = { member1: 'kim', member2: 'park' };
var a; //어떤 type도 가능 = 타입쉴드 해제 문법
//type관련 버그를 못잡음
a = 123;
a = [];
var b; //type관련 버그 잡음
a = 123;
a = {};
var arr = [1, '2', 3];
var ob = { data: '123' };
var y; //변수만 선언하면 any type로 자동 할당
function test(x) {
    //파라미터 변수에 ? 넣으면 파라미터를 넣어도 되고 안넣어도됨 x? :number === (x :number|undefined)
    1 + 1; //return 안할때(return을 안쓰고 상단에 void)
}
test();
function test2(x) {
    if (x) {
        console.log("안녕하세요" + x);
    }
    else {
        console.log('이름이 없습니다');
    }
}
function test3(x) {
    return x.toLocaleString().length; //문자로 변환후 숫자의길이 계산(숫자자체의 길이 계산 불가)
}
function 내함수(x) {
    //return x + 1  //에러남 
    //type이 하나로 정해지지않았을때 Type Narrowing사용
    if (typeof x === 'string') {
        return x + '1';
    }
    else {
        return x + 1;
    }
}
var ani = 123;
var Born = { region: 'seoul' }; //const Born = 'seoul'   -> Born = 'busan'은 const특성상 안되지만 object타입안에걸 바꾸는건 가능
Born.region = 'busan';
var Gfriend = {
    name: 'joo'
};
