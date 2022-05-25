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
let nm :string = 'kim';
let age :number = 24;
let mar :boolean = false;
let member :string[] = ['kim','park']
let people :{member1 : string,member2 : string} = {member1 : 'kim',member2 : 'park'}
let a :any; //어떤 type도 가능 = 타입쉴드 해제 문법
//type관련 버그를 못잡음
a = 123;
a = []
let b :unknown; //type관련 버그 잡음
a = 123;
a = {}  
let arr :(number|string)[] = [1,'2',3]
let ob :{data  :(number|string)} = {data : '123'}
let y; //변수만 선언하면 any type로 자동 할당
function test(x? :number) :void{//return을 사전에 막아줌
    //파라미터 변수에 ? 넣으면 파라미터를 넣어도 되고 안넣어도됨 x? :number === (x :number|undefined)
    1+1 //return 안할때(return을 안쓰고 상단에 void)
}
test()

function test2(x? :string) {
    if(x){
        console.log("안녕하세요" + x);
    }
    else{
        console.log('이름이 없습니다');
    }
}
function test3(x :number | string) :number{ //숫자 또는 문자인 파라미터 변수의 길이 
    return x.toLocaleString().length//문자로 변환후 숫자의길이 계산(숫자자체의 길이 계산 불가)
}
function 내함수(x :number | string){ //x변수의 type가 유니온으로 둘다 되기때문에 즉,확실하지 않아서 오류
    //return x + 1  //에러남 
    //type이 하나로 정해지지않았을때 Type Narrowing사용
    if(typeof x === 'string'){
        return x + '1'
    }
    else{
        return x + 1
    }
 }
 type Animal = string | number | undefined; //type alias(타입 변수)
 let ani :Animal = 123;
 const Born = {region : 'seoul'} //const Born = 'seoul'   -> Born = 'busan'은 const특성상 안되지만 object타입안에걸 바꾸는건 가능
 Born.region = 'busan'
 type GF = {//타입키워드로 만든 후 가져다 쓰기
    readonly name : string //readonly추가시 object자료도 수정 불가
    //name? : string //?속성도 사용 가능 - name은 속성 선택사항이 됨(string | undefined)
 }
 const Gfriend :GF={
     name : 'joo'
 }
 //같은 이름의 type변수 재정의 불가
 type Name = string;
 type Age = number;
 type Person = Name | Age; //type변수를 union type로 합치기 가능
 type PositionX = {x :number}
 type PositionY = {y :number}
type New = PositionX & PositionY //=={x :number,y :number}  object타입 extend

type Test = {
    color? :string,
    size :number,
    readonly position :number[]
}
let last :"kim" //Literal types
let me :"kim"|"27";
function fun(a :'hello') :1 | 0{ //리턴값도 지정
    return 0
}
fun('hello') //특정값만 함수로 보내야할때