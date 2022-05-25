function cleaning(a: (string|number)[]){
    let numArray :number[]=[];
    a.forEach((n)=>{
        if(typeof n === 'string'){
            numArray.push(parseFloat(n))
        }else{
            numArray.push(n)
        }
    })
    return numArray
}
function subjectFun( x :{subject : string | string[]} ){
    if (typeof x.subject === 'string') {
      return x.subject
    } else if (Array.isArray(x.subject) ){
      return x.subject[x.subject.length - 1]
    } else {
      return '없쪄'
    }
  }
  
  console.log(subjectFun( { subject : ['english', 'art'] }  ) )