
function vaildEmail(email){
    var re = /^[s](?[0-9a-zA-Z])*@[0-9a-zA-Z](?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    if(re.test(email) == false){
        console.log('이메일 형식이 올바르지 않습니다');
        return true;
    }
    else
        return false;
}

function validPassword(password){
    var pattern1 = /[0-9]/;
    var pattern2 = /[a-z]/;

    if(pattern1.test(password) == false || pattern2.test(password) == false){
        console.log('비밀번호 형식이 올바르지 않습니다');
        return true;
    }
    else
        return false;
}